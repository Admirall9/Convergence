import urllib.parse
from pydantic_settings import BaseSettings


class AppSettings(BaseSettings):
    app_name: str = "Convergence"
    app_env: str = "development"
    app_host: str = "127.0.0.1"
    app_port: int = 8000
    log_level: str = "INFO"
    auth_secret: str = "change-this-dev-secret"
    token_exp_minutes: int = 30

    sqlserver_host: str = "localhost"
    sqlserver_port: int = 1433
    sqlserver_db: str = "Convergence"
    sqlserver_user: str = "sa"
    sqlserver_password: str = "YourStrong!Passw0rd"
    sql_encrypt: str = "no"  # yes/no

    # AI Configuration
    ai_provider: str = "openai"  # openai or anthropic
    openai_api_key: str = ""
    anthropic_api_key: str = ""
    ai_model: str = "gpt-4"  # gpt-4, gpt-3.5-turbo, claude-3-sonnet-20240229
    ai_max_tokens: int = 1000
    ai_temperature: float = 0.1

    # Vector Database Configuration
    vector_model: str = "paraphrase-multilingual-MiniLM-L12-v2"
    vector_dimension: int = 384
    vector_similarity_threshold: float = 0.7

    # MongoDB Configuration (for raw data storage)
    mongodb_url: str = "mongodb://localhost:27017"
    mongodb_db: str = "convergence_raw"

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

    @property
    def sqlalchemy_url(self) -> str:
        # Build ODBC connection string and URL-encode it
        encrypt = "yes" if self.sql_encrypt.lower() == "yes" else "no"
        trust = "yes"  # trust for local dev; set to 'no' with valid certs in prod
        odbc_str = (
            "Driver=ODBC Driver 18 for SQL Server;"
            f"Server={self.sqlserver_host},{self.sqlserver_port};"
            f"Database={self.sqlserver_db};"
            f"UID={self.sqlserver_user};"
            f"PWD={self.sqlserver_password};"
            f"Encrypt={encrypt};"
            f"TrustServerCertificate={trust}"
        )
        encoded = urllib.parse.quote_plus(odbc_str)
        return f"mssql+pyodbc:///?odbc_connect={encoded}"


settings = AppSettings()


