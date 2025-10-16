# ngrok Setup Instructions

## Step 1: Sign up for ngrok (Free)
1. Go to https://dashboard.ngrok.com/signup
2. Create a free account
3. Verify your email

## Step 2: Get your auth token
1. After signing up, go to https://dashboard.ngrok.com/get-started/your-authtoken
2. Copy your auth token (it looks like: `2abc123def456ghi789jkl012mno345pqr678stu`)

## Step 3: Configure ngrok
Run this command with YOUR auth token:
```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

## Step 4: Start your services
```bash
# Backend (already running)
python -m uvicorn src.main:app --host 0.0.0.0 --port 8000

# Frontend (already running on port 5174)
# Your frontend is already running on http://localhost:5174/

# Expose to world
ngrok http 5174
```

## Alternative: Use the batch file
Just double-click `start_worldwide.bat` after setting up ngrok auth!
