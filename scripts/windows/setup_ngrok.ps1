# ngrok Setup Script for Worldwide Access
Write-Host "Setting up ngrok for worldwide access..." -ForegroundColor Green

# Check if ngrok is already installed
if (Get-Command ngrok -ErrorAction SilentlyContinue) {
    Write-Host "ngrok is already installed!" -ForegroundColor Yellow
} else {
    Write-Host "Installing ngrok..." -ForegroundColor Blue
    
    # Download ngrok
    $ngrokUrl = "https://bin.equinox.io/c/bNyj1mQVY4c/ngrok-v3-stable-windows-amd64.zip"
    $ngrokZip = "$env:TEMP\ngrok.zip"
    $ngrokDir = "$env:USERPROFILE\ngrok"
    
    # Create ngrok directory
    if (!(Test-Path $ngrokDir)) {
        New-Item -ItemType Directory -Path $ngrokDir -Force
    }
    
    # Download ngrok
    Write-Host "Downloading ngrok..." -ForegroundColor Blue
    Invoke-WebRequest -Uri $ngrokUrl -OutFile $ngrokZip
    
    # Extract ngrok
    Write-Host "Extracting ngrok..." -ForegroundColor Blue
    Expand-Archive -Path $ngrokZip -DestinationPath $ngrokDir -Force
    
    # Add to PATH
    $currentPath = [Environment]::GetEnvironmentVariable("PATH", "User")
    if ($currentPath -notlike "*$ngrokDir*") {
        [Environment]::SetEnvironmentVariable("PATH", "$currentPath;$ngrokDir", "User")
        Write-Host "Added ngrok to PATH" -ForegroundColor Green
    }
    
    # Clean up
    Remove-Item $ngrokZip -Force
    
    Write-Host "ngrok installed successfully!" -ForegroundColor Green
}

Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Sign up at https://ngrok.com (free account)" -ForegroundColor White
Write-Host "2. Get your auth token from the dashboard" -ForegroundColor White
Write-Host "3. Run: ngrok config add-authtoken YOUR_TOKEN" -ForegroundColor White
Write-Host "4. Run: ngrok http 8000" -ForegroundColor White
Write-Host ""
Write-Host "This will give you a public URL like: https://abc123.ngrok.io" -ForegroundColor Yellow
Write-Host "Share this URL with anyone worldwide!" -ForegroundColor Green
