import os
import glob
import logging
from datetime import datetime
from typing import List
from urllib.parse import urlparse, parse_qs, unquote_plus
import pandas as pd
import pyodbc
from src.core.settings import settings


# -------------------------
# Configuration
# -------------------------

PDF_FOLDER = r"D:\LLM_Models\Convergence\Data_Sourcing\pdfs"
CSV_FOLDER = r"D:\LLM_Models\Convergence\Data_Sourcing\csvs"

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# -------------------------
# Database connection
# -------------------------

def get_connection():
    """
    Build a pyodbc connection using the same configuration as the app's SQLAlchemy engine.
    Uses settings.sqlalchemy_url (mssql+pyodbc:///?odbc_connect=...) to ensure consistent DB and credentials.
    """
    url = settings.sqlalchemy_url
    parsed = urlparse(url)
    qs = parse_qs(parsed.query)
    if "odbc_connect" in qs and qs["odbc_connect"]:
        odbc_str = unquote_plus(qs["odbc_connect"][0])
        return pyodbc.connect(odbc_str)
    # Fallback: construct from individual settings (Trusted connection for local dev)
    encrypt = "yes" if settings.sql_encrypt.lower() == "yes" else "no"
    conn_str = (
        f"Driver=ODBC Driver 18 for SQL Server;"
        f"Server={settings.sqlserver_host},{settings.sqlserver_port};"
        f"Database={settings.sqlserver_db};"
        f"UID={settings.sqlserver_user};"
        f"PWD={settings.sqlserver_password};"
        f"Encrypt={encrypt};"
        f"TrustServerCertificate=yes"
    )
    return pyodbc.connect(conn_str)


# -------------------------
# Helper Functions
# -------------------------

def extract_tables_from_pdf(pdf_path: str) -> List[pd.DataFrame]:
    """
    Extract tables from a single PDF using pdfplumber.
    Returns a list of DataFrames (one per table).
    """
    # Priority 1: Camelot (stream/lattice)
    try:
        import camelot
        tables = []
        for flavor in ("lattice", "stream"):
            try:
                t = camelot.read_pdf(pdf_path, pages="all", flavor=flavor)
                for tbl in t:
                    df = tbl.df
                    if df is not None and not df.empty:
                        # Promote first row to header when it looks like headers
                        if df.shape[0] > 1:
                            df.columns = df.iloc[0].astype(str)
                            df = df.iloc[1:].reset_index(drop=True)
                        tables.append(df)
            except Exception:
                continue
        if tables:
            return tables
    except Exception:
        pass

    # Priority 2: Tabula (Java required)
    try:
        import tabula
        dfs = tabula.read_pdf(pdf_path, pages="all", multiple_tables=True, lattice=True, stream=True)
        cleaned: List[pd.DataFrame] = []
        for df in dfs or []:
            if df is not None and not df.empty:
                cleaned.append(df)
        if cleaned:
            return cleaned
    except Exception:
        pass

    # Fallback: pdfplumber
    tables_list: List[pd.DataFrame] = []
    try:
        import pdfplumber  # lazy import to avoid startup hard dependency
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                tables = page.extract_tables()
                for table in tables:
                    if table and len(table) > 1:
                        df = pd.DataFrame(table[1:], columns=table[0])
                        tables_list.append(df)
    except Exception:
        return []
    return tables_list


def clean_numeric_column(series: pd.Series) -> pd.Series:
    series = series.astype(str).str.replace("\xa0", " ")
    series = series.str.replace(" ", "").str.replace(",", ".")
    series = series.str.replace("%", "")
    return pd.to_numeric(series, errors="coerce").fillna(0)


def ensure_tables(cursor):
    cursor.execute(
        """
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Recettes' AND xtype='U')
        CREATE TABLE Recettes (
            ID INT IDENTITY(1,1) PRIMARY KEY,
            Chapitre NVARCHAR(255),
            Designation NVARCHAR(255),
            RecettesProposees DECIMAL(18,2) NULL,
            RecettesAdmises DECIMAL(18,2) NULL,
            DateCreation DATETIME NOT NULL
        )
        """
    )
    cursor.execute(
        """
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Depenses' AND xtype='U')
        CREATE TABLE Depenses (
            ID INT IDENTITY(1,1) PRIMARY KEY,
            Domaine NVARCHAR(255),
            Montant DECIMAL(18,2) NULL,
            Pourcentage DECIMAL(9,4) NULL,
            DateCreation DATETIME NOT NULL
        )
        """
    )
    cursor.execute(
        """
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='RecettesDetaillees' AND xtype='U')
        CREATE TABLE RecettesDetaillees (
            ID INT IDENTITY(1,1) PRIMARY KEY,
            NatureRecette NVARCHAR(255),
            Montant DECIMAL(18,2) NULL,
            Categorie NVARCHAR(255),
            DateCreation DATETIME NOT NULL
        )
        """
    )
    cursor.execute(
        """
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='DepensesDetaillees' AND xtype='U')
        CREATE TABLE DepensesDetaillees (
            ID INT IDENTITY(1,1) PRIMARY KEY,
            NatureDepense NVARCHAR(255),
            Montant DECIMAL(18,2) NULL,
            Categorie NVARCHAR(255),
            DateCreation DATETIME NOT NULL
        )
        """
    )


def row_exists(cursor, table: str, where_cols: list, row: pd.Series) -> bool:
    """Basic idempotency check using natural keys."""
    conditions = " AND ".join([f"{c} = ?" for c in where_cols])
    params = [row.get(c) for c in where_cols]
    cursor.execute(f"SELECT 1 FROM {table} WHERE {conditions}", params)
    return cursor.fetchone() is not None


# -------------------------
# ETL Process
# -------------------------

def etl_process() -> int:
    os.makedirs(PDF_FOLDER, exist_ok=True)
    os.makedirs(CSV_FOLDER, exist_ok=True)

    pdf_files = glob.glob(os.path.join(PDF_FOLDER, "*.pdf"))
    if not pdf_files:
        logger.warning("No PDF files found in folder: %s", PDF_FOLDER)
        return 0

    conn = get_connection()
    cursor = conn.cursor()
    ensure_tables(cursor)
    conn.commit()

    processed = 0

    for pdf_file in pdf_files:
        logger.info("Processing PDF: %s", pdf_file)
        tables = extract_tables_from_pdf(pdf_file)
        logger.info("Detected %d table(s) in %s", len(tables), os.path.basename(pdf_file))
        processed += 1

        year_hint = ''.join(filter(str.isdigit, os.path.basename(pdf_file)))[:4] or datetime.now().year

        any_saved = False
        for idx, df in enumerate(tables, start=1):
            cols_lower = [str(c).strip().lower() for c in df.columns]
            now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            # Recettes
            if "chapitre" in cols_lower and "designation" in cols_lower:
                # Attempt to resolve numeric columns by fuzzy match
                rp_col = next((c for c in df.columns if str(c).lower().startswith("recettes") and "propos" in str(c).lower()), "RecettesProposees")
                ra_col = next((c for c in df.columns if str(c).lower().startswith("recettes") and ("adm" in str(c).lower() or "recouvr" in str(c).lower())), "RecettesAdmises")
                df = df.rename(columns={rp_col: "RecettesProposees", ra_col: "RecettesAdmises"})
                if "RecettesProposees" in df.columns:
                    df["RecettesProposees"] = clean_numeric_column(df["RecettesProposees"])
                if "RecettesAdmises" in df.columns:
                    df["RecettesAdmises"] = clean_numeric_column(df["RecettesAdmises"])
                df["DateCreation"] = now
                csv_path = os.path.join(CSV_FOLDER, f"Recettes_{year_hint}.pdf.csv")
                df.to_csv(csv_path, index=False, encoding="utf-8-sig")
                inserted = 0
                for _, row in df.iterrows():
                    if not row_exists(cursor, "Recettes", ["Chapitre", "Designation", "RecettesProposees", "RecettesAdmises"], row):
                        cursor.execute(
                            """
                            INSERT INTO Recettes (Chapitre, Designation, RecettesProposees, RecettesAdmises, DateCreation)
                            VALUES (?, ?, ?, ?, ?)
                            """,
                            row.get("Chapitre"), row.get("Designation"), row.get("RecettesProposees"), row.get("RecettesAdmises"), now,
                        )
                        inserted += 1
                conn.commit()
                logger.info("Inserted %d new rows into Recettes", inserted)
                any_saved = True

            # Depenses
            elif "domaine" in cols_lower and ("montant" in cols_lower or any("montant" in str(c).lower() for c in df.columns)):
                montant_col = next((c for c in df.columns if "montant" in str(c).lower()), "Montant")
                pourc_col = next((c for c in df.columns if "%" in str(c) or "pourc" in str(c).lower()), "Pourcentage")
                df = df.rename(columns={montant_col: "Montant", pourc_col: "Pourcentage"})
                if "Montant" in df.columns:
                    df["Montant"] = clean_numeric_column(df["Montant"])
                if "Pourcentage" in df.columns:
                    df["Pourcentage"] = clean_numeric_column(df["Pourcentage"]) / 100.0
                df["DateCreation"] = now
                csv_path = os.path.join(CSV_FOLDER, f"Depenses_{year_hint}.pdf.csv")
                df.to_csv(csv_path, index=False, encoding="utf-8-sig")
                inserted = 0
                for _, row in df.iterrows():
                    if not row_exists(cursor, "Depenses", ["Domaine", "Montant", "Pourcentage"], row):
                        cursor.execute(
                            """
                            INSERT INTO Depenses (Domaine, Montant, Pourcentage, DateCreation)
                            VALUES (?, ?, ?, ?)
                            """,
                            row.get("Domaine"), row.get("Montant"), row.get("Pourcentage"), now,
                        )
                        inserted += 1
                conn.commit()
                logger.info("Inserted %d new rows into Depenses", inserted)
                any_saved = True

            # RecettesDetaillees
            elif any("naturerecette" in c for c in cols_lower):
                montant_col = next((c for c in df.columns if "montant" in str(c).lower()), "Montant")
                df = df.rename(columns={montant_col: "Montant"})
                df["Montant"] = clean_numeric_column(df["Montant"]) if "Montant" in df.columns else 0
                df["DateCreation"] = now
                csv_path = os.path.join(CSV_FOLDER, f"RecettesDetaillees_{year_hint}.pdf.csv")
                df.to_csv(csv_path, index=False, encoding="utf-8-sig")
                inserted = 0
                for _, row in df.iterrows():
                    if not row_exists(cursor, "RecettesDetaillees", ["NatureRecette", "Montant", "Categorie"], row):
                        cursor.execute(
                            """
                            INSERT INTO RecettesDetaillees (NatureRecette, Montant, Categorie, DateCreation)
                            VALUES (?, ?, ?, ?)
                            """,
                            row.get("NatureRecette"), row.get("Montant"), row.get("Categorie"), now,
                        )
                        inserted += 1
                conn.commit()
                logger.info("Inserted %d new rows into RecettesDetaillees", inserted)
                any_saved = True

            # DepensesDetaillees
            elif any("naturedepense" in c for c in cols_lower):
                montant_col = next((c for c in df.columns if "montant" in str(c).lower()), "Montant")
                df = df.rename(columns={montant_col: "Montant"})
                df["Montant"] = clean_numeric_column(df["Montant"]) if "Montant" in df.columns else 0
                df["DateCreation"] = now
                csv_path = os.path.join(CSV_FOLDER, f"DepensesDetaillees_{year_hint}.pdf.csv")
                df.to_csv(csv_path, index=False, encoding="utf-8-sig")
                inserted = 0
                for _, row in df.iterrows():
                    if not row_exists(cursor, "DepensesDetaillees", ["NatureDepense", "Montant", "Categorie"], row):
                        cursor.execute(
                            """
                            INSERT INTO DepensesDetaillees (NatureDepense, Montant, Categorie, DateCreation)
                            VALUES (?, ?, ?, ?)
                            """,
                            row.get("NatureDepense"), row.get("Montant"), row.get("Categorie"), now,
                        )
                        inserted += 1
                conn.commit()
                logger.info("Inserted %d new rows into DepensesDetaillees", inserted)
                any_saved = True

            else:
                # Fallback: save any detected table to a generic CSV if schema doesn't match
                generic_name = os.path.join(CSV_FOLDER, f"{os.path.splitext(os.path.basename(pdf_file))[0]}_table{idx}.csv")
                try:
                    df.to_csv(generic_name, index=False, encoding="utf-8-sig")
                    logger.info("Saved generic CSV: %s", generic_name)
                    any_saved = True
                except Exception as e:
                    logger.warning("Failed to save generic CSV for table %d in %s: %s", idx, os.path.basename(pdf_file), e)

        if not any_saved:
            logger.warning("No CSVs saved for %s (no matching schemas or tables)", os.path.basename(pdf_file))

    cursor.close()
    conn.close()
    logger.info("ETL process completed successfully.")
    return processed


if __name__ == "__main__":
    etl_process()


