import pyodbc

CONN_STR = (
    "DRIVER={ODBC Driver 18 for SQL Server};"
    "SERVER=DESKTOP-7HNDN07\\SQLEXPRESS;"
    "DATABASE=Convergence;"
    "UID=sa;PWD=AdmiraL!1997*02;"
    "Encrypt=no;TrustServerCertificate=yes;"
)

regions = [
    ("Tanger-Tétouan-Al Hoceïma", "TTA"),
    ("L'Oriental", "LOR"),
    ("Fès-Meknès", "FES"),
    ("Rabat-Salé-Kénitra", "RSK"),
    ("Béni Mellal-Khénifra", "BMK"),
    ("Casablanca-Settat", "CAS"),
    ("Marrakech-Safi", "MRS"),
    ("Drâa-Tafilalet", "DRT"),
    ("Souss-Massa", "SMS"),
    ("Guelmim-Oued Noun", "GON"),
    ("Laâyoune-Sakia El Hamra", "LSEH"),
    ("Dakhla-Oued Ed-Dahab", "DOED"),
]

roles = [
    ("Admin", "Full access"),
    ("Moderator", "Review management"),
    ("Citizen", "General user"),
]


def main():
    conn = pyodbc.connect(CONN_STR)
    cur = conn.cursor()

    # Seed Regions
    for name, code in regions:
        cur.execute(
            "IF NOT EXISTS (SELECT 1 FROM core.Regions WHERE RegionName = ?) "
            "INSERT INTO core.Regions(RegionName, Code) VALUES (?, ?)",
            name, name, code,
        )

    # Seed Roles
    for role, desc in roles:
        cur.execute(
            "IF NOT EXISTS (SELECT 1 FROM auth.Roles WHERE RoleName = ?) "
            "INSERT INTO auth.Roles(RoleName, Description) VALUES (?, ?)",
            role, role, desc,
        )

    conn.commit()
    cur.close()
    conn.close()
    print("Seed completed.")


if __name__ == "__main__":
    main()


