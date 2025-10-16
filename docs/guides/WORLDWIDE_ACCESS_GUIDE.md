# Worldwide Access Guide

## 🌍 Making Your Website Accessible Globally

### Option 1: ngrok (Recommended for Testing)

**ngrok** is the easiest way to expose your local server to the internet.

#### Setup ngrok:

1. **Download ngrok** from [ngrok.com](https://ngrok.com/download)
2. **Sign up** for a free account
3. **Get your auth token** from the dashboard
4. **Configure ngrok**:
   ```bash
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

#### Expose your backend:
```bash
# In one terminal - start your backend
python -m uvicorn src.main:app --host 0.0.0.0 --port 8000

# In another terminal - expose it
ngrok http 8000
```

#### Expose your frontend:
```bash
# In one terminal - start your frontend
cd client
npm run dev

# In another terminal - expose it
ngrok http 5173
```

**Result**: You'll get URLs like:
- Backend: `https://abc123.ngrok.io` 
- Frontend: `https://def456.ngrok.io`

### Option 2: Cloudflare Tunnel (Free & Secure)

#### Setup Cloudflare Tunnel:

1. **Install cloudflared**:
   ```bash
   # Download from https://github.com/cloudflare/cloudflared/releases
   # Or use package manager
   ```

2. **Login to Cloudflare**:
   ```bash
   cloudflared tunnel login
   ```

3. **Create tunnel**:
   ```bash
   cloudflared tunnel create convergence
   ```

4. **Configure tunnel** (create `config.yml`):
   ```yaml
   tunnel: convergence
   credentials-file: /path/to/credentials.json
   
   ingress:
     - hostname: convergence.yourdomain.com
       service: http://localhost:8000
     - hostname: convergence-app.yourdomain.com  
       service: http://localhost:5173
     - service: http_status:404
   ```

5. **Run tunnel**:
   ```bash
   cloudflared tunnel run convergence
   ```

### Option 3: VPS/Cloud Server (Production)

#### Deploy to a cloud provider:

**Recommended Providers:**
- **DigitalOcean** ($5/month droplet)
- **AWS EC2** (Free tier available)
- **Google Cloud** (Free tier available)
- **Azure** (Free tier available)
- **Hetzner** (€3.29/month)

#### Quick VPS Setup:

1. **Create a server** (Ubuntu 22.04 recommended)
2. **Install dependencies**:
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Python
   sudo apt install python3.11 python3.11-pip python3.11-venv -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install SQL Server (if needed)
   wget -qO- https://packages.microsoft.com/keys/microsoft.asc | sudo apt-key add -
   sudo add-apt-repository "$(wget -qO- https://packages.microsoft.com/config/ubuntu/22.04/mssql-server-2022.list)"
   sudo apt-get update
   sudo apt-get install -y mssql-server
   ```

3. **Deploy your application**:
   ```bash
   # Clone your repository
   git clone YOUR_REPO_URL
   cd Convergence
   
   # Setup backend
   python3.11 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   
   # Setup frontend
   cd client
   npm install
   npm run build
   
   # Start services
   ```

4. **Configure reverse proxy** (Nginx):
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;
       
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

### Option 4: Railway (Easiest Deployment)

**Railway** offers one-click deployment:

1. **Connect your GitHub repository**
2. **Railway auto-detects** FastAPI + React
3. **Deploy with one click**
4. **Get a public URL** instantly

Visit: [railway.app](https://railway.app)

### Option 5: Render (Free Tier Available)

**Render** provides free hosting:

1. **Connect GitHub repository**
2. **Choose "Web Service"**
3. **Configure build command**:
   ```bash
   pip install -r requirements.txt && cd client && npm install && npm run build
   ```
4. **Set start command**:
   ```bash
   python -m uvicorn src.main:app --host 0.0.0.0 --port $PORT
   ```

### Option 6: Heroku (Easy but Limited)

1. **Install Heroku CLI**
2. **Create Procfile**:
   ```
   web: python -m uvicorn src.main:app --host 0.0.0.0 --port $PORT
   ```
3. **Deploy**:
   ```bash
   git add .
   git commit -m "Deploy to Heroku"
   git push heroku main
   ```

## 🔧 Quick Setup for Local Testing

### Make your local server accessible:

1. **Update your backend to accept external connections**:
   ```python
   # In src/main.py, change host from 127.0.0.1 to 0.0.0.0
   uvicorn.run(
       "src.main:app",
       host="0.0.0.0",  # This allows external connections
       port=8000,
       reload=True
   )
   ```

2. **Configure your router** (if needed):
   - Port forward 8000 and 5173
   - Or use ngrok for instant access

3. **Update frontend API URL**:
   ```bash
   # In client/.env
   VITE_API_BASE_URL=https://your-ngrok-url.ngrok.io
   ```

## 🚀 Recommended Quick Start

**For immediate worldwide access:**

1. **Use ngrok** (5 minutes setup):
   ```bash
   # Install ngrok
   # Get auth token from ngrok.com
   ngrok config add-authtoken YOUR_TOKEN
   
   # Start your backend
   python -m uvicorn src.main:app --host 0.0.0.0 --port 8000
   
   # In another terminal
   ngrok http 8000
   ```

2. **Update frontend** to use ngrok URL:
   ```bash
   cd client
   # Update API base URL in your code
   npm run dev
   
   # In another terminal
   ngrok http 5173
   ```

3. **Share the ngrok URLs** with anyone worldwide!

## 🔒 Security Considerations

- **Use HTTPS** in production
- **Set up authentication** for admin functions
- **Configure CORS** properly
- **Use environment variables** for secrets
- **Enable rate limiting**
- **Set up monitoring**

## 📱 Mobile Access

Your website will work on:
- ✅ **Desktop browsers** (Chrome, Firefox, Safari, Edge)
- ✅ **Mobile browsers** (iOS Safari, Android Chrome)
- ✅ **Tablets** (iPad, Android tablets)
- ✅ **Any device** with internet connection

The responsive design ensures it looks great on all screen sizes!
