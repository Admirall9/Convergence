# Deployment Guide

## Production Deployment

### Prerequisites

1. **Python 3.10+** (tested with 3.11, 3.12, 3.13)
2. **SQL Server** (2019 or later)
3. **Node.js 18+** (for frontend build)
4. **Web server** (Nginx, Apache, or IIS)

### Backend Deployment

#### 1. Install Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt

# Or if using Poetry
poetry install --no-dev
```

#### 2. Environment Configuration

Create production `.env` file:

```bash
# Production settings
APP_ENV=production
APP_HOST=0.0.0.0
APP_PORT=8000
LOG_LEVEL=WARNING

# Database (use production credentials)
SQLSERVER_HOST=your-sql-server-host
SQLSERVER_PORT=1433
SQLSERVER_DB=Convergence
SQLSERVER_USER=production_user
SQLSERVER_PASSWORD=secure-password
SQL_ENCRYPT=yes

# AI Configuration
AI_PROVIDER=openai
OPENAI_API_KEY=your-production-api-key
AI_MODEL=gpt-4
AI_MAX_TOKENS=1000
AI_TEMPERATURE=0.7

# Security
AUTH_SECRET=your-very-secure-secret-key-here
TOKEN_EXP_MINUTES=60
```

#### 3. Database Setup

1. Create production database
2. Run migrations (if using Alembic)
3. Import sample data (optional)

#### 4. Start Backend Service

**Option A: Direct Python**
```bash
python src/main.py
```

**Option B: Uvicorn**
```bash
uvicorn src.main:app --host 0.0.0.0 --port 8000 --workers 4
```

**Option C: Gunicorn (Linux)**
```bash
gunicorn src.main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
```

**Option D: Windows Service**
- Use NSSM (Non-Sucking Service Manager)
- Or Windows Task Scheduler

### Frontend Deployment

#### 1. Build Frontend

```bash
cd client
npm install
npm run build
```

#### 2. Serve Static Files

**Option A: Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        root /path/to/client/dist;
        try_files $uri $uri/ /index.html;
    }
    
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

**Option B: Apache**
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /path/to/client/dist
    
    <Directory /path/to/client/dist>
        AllowOverride All
        Require all granted
    </Directory>
    
    ProxyPass /api/ http://127.0.0.1:8000/
    ProxyPassReverse /api/ http://127.0.0.1:8000/
</VirtualHost>
```

**Option C: IIS**
- Deploy to IIS with URL Rewrite module
- Configure reverse proxy for API calls

### Docker Deployment (Optional)

#### 1. Create Dockerfile

```dockerfile
# Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY src/ ./src/
EXPOSE 8000

CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### 2. Docker Compose

```yaml
version: '3.8'
services:
  backend:
    build: .
    ports:
      - "8000:8000"
    environment:
      - SQLSERVER_HOST=sqlserver
      - SQLSERVER_DB=Convergence
    depends_on:
      - sqlserver

  frontend:
    build: ./client
    ports:
      - "80:80"
    depends_on:
      - backend

  sqlserver:
    image: mcr.microsoft.com/mssql/server:2022-latest
    environment:
      - ACCEPT_EULA=Y
      - SA_PASSWORD=YourStrong!Passw0rd
    ports:
      - "1433:1433"
```

### Security Considerations

#### 1. Environment Variables
- Never commit `.env` files
- Use secure secret management
- Rotate API keys regularly

#### 2. Database Security
- Use strong passwords
- Enable SSL/TLS encryption
- Regular backups
- Access control

#### 3. API Security
- Rate limiting
- CORS configuration
- Input validation
- Authentication tokens

#### 4. Frontend Security
- HTTPS only
- Content Security Policy
- XSS protection
- Secure headers

### Monitoring and Logging

#### 1. Application Logs
```bash
# Configure structured logging
LOG_LEVEL=INFO
```

#### 2. Health Checks
- Backend: `GET /health`
- Database: `GET /health/db`

#### 3. Performance Monitoring
- Response times
- Error rates
- Database performance
- AI API usage

### Backup Strategy

#### 1. Database Backups
```sql
-- Full backup
BACKUP DATABASE Convergence TO DISK = 'C:\Backups\Convergence.bak'

-- Transaction log backup
BACKUP LOG Convergence TO DISK = 'C:\Backups\Convergence.trn'
```

#### 2. Application Backups
- Source code (Git repository)
- Configuration files
- Static assets
- AI conversation logs

### Scaling Considerations

#### 1. Horizontal Scaling
- Multiple backend instances
- Load balancer (Nginx, HAProxy)
- Database clustering
- CDN for static assets

#### 2. Vertical Scaling
- More CPU/RAM for backend
- Faster database server
- SSD storage
- Network optimization

### Maintenance

#### 1. Regular Updates
- Security patches
- Dependency updates
- Database maintenance
- Performance optimization

#### 2. Monitoring
- Uptime monitoring
- Error tracking
- Performance metrics
- User analytics

### Troubleshooting

#### Common Issues

1. **Database Connection**
   - Check connection string
   - Verify SQL Server is running
   - Test with SSMS

2. **API Errors**
   - Check logs
   - Verify environment variables
   - Test endpoints manually

3. **Frontend Issues**
   - Check build process
   - Verify API base URL
   - Browser console errors

4. **AI Integration**
   - Verify API keys
   - Check rate limits
   - Monitor costs
