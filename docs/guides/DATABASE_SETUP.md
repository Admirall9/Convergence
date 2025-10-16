# Database Setup Guide

## SQL Server Configuration

The Convergence platform uses SQL Server as the primary database.

### Prerequisites

1. **SQL Server 2019 or later** (LocalDB, Express, or Full version)
2. **ODBC Driver 18 for SQL Server** (automatically installed with SQL Server)

### Setup Steps

#### 1. Install SQL Server

**Option A: SQL Server Express (Recommended for development)**
- Download from [Microsoft SQL Server Express](https://www.microsoft.com/en-us/sql-server/sql-server-downloads)
- Install with default settings
- Note the instance name (usually `SQLEXPRESS`)

**Option B: SQL Server LocalDB (Lightweight)**
- Included with Visual Studio or download separately
- Perfect for development and testing

#### 2. Create Database

1. Open SQL Server Management Studio (SSMS) or use command line
2. Connect to your SQL Server instance
3. Create a new database:

```sql
CREATE DATABASE Convergence;
GO

USE Convergence;
GO
```

#### 3. Create Database User (Optional)

For better security, create a dedicated user:

```sql
-- Create login
CREATE LOGIN convergence_user WITH PASSWORD = 'YourStrong!Passw0rd';
GO

-- Create user in database
USE Convergence;
GO
CREATE USER convergence_user FOR LOGIN convergence_user;
GO

-- Grant permissions
ALTER ROLE db_owner ADD MEMBER convergence_user;
GO
```

#### 4. Configure Connection

Update your `.env` file or environment variables:

```bash
SQLSERVER_HOST=localhost
SQLSERVER_PORT=1433
SQLSERVER_DB=Convergence
SQLSERVER_USER=sa
SQLSERVER_PASSWORD=YourStrong!Passw0rd
SQL_ENCRYPT=no
```

For named instances (like SQL Express):
```bash
SQLSERVER_HOST=localhost\\SQLEXPRESS
SQLSERVER_PORT=1433
```

#### 5. Run Database Migrations

The application will automatically create tables on first run. You can also run migrations manually:

```bash
# If using Alembic (if configured)
alembic upgrade head
```

### Sample Data

The application includes sample data for:
- Government institutions
- Legal documents and laws
- Citizen reviews
- AI queries

### Troubleshooting

#### Connection Issues

1. **Enable TCP/IP Protocol:**
   - Open SQL Server Configuration Manager
   - Navigate to SQL Server Network Configuration
   - Enable TCP/IP protocol
   - Restart SQL Server service

2. **Check Firewall:**
   - Ensure port 1433 is open
   - Add SQL Server to Windows Firewall exceptions

3. **Authentication:**
   - Use SQL Server Authentication
   - Or enable Mixed Mode authentication

#### Common Error Messages

**"Login failed for user"**
- Check username and password
- Verify SQL Server Authentication is enabled

**"Cannot connect to server"**
- Verify server name and port
- Check if SQL Server service is running
- Test connection with SSMS first

**"Driver not found"**
- Install ODBC Driver 18 for SQL Server
- Download from Microsoft website

### Production Considerations

For production deployment:

1. **Use Windows Authentication** when possible
2. **Enable SSL/TLS encryption**
3. **Use strong passwords**
4. **Configure backup strategy**
5. **Set up monitoring and logging**

### Database Schema

The application creates these main tables:
- `Institutions` - Government institutions
- `Officials` - Government officials
- `Laws` - Legal documents
- `LawArticles` - Individual law articles
- `Reviews` - Citizen reviews
- `AIQueries` - AI assistant queries
- `Users` - System users

All tables are created automatically on first startup.
