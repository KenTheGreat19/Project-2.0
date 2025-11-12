# ApplyNHire Quick Setup Script
# This script will set up everything automatically

Write-Host "🚀 ApplyNHire Quick Setup" -ForegroundColor Cyan
Write-Host "=========================" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "Checking Node.js installation..." -ForegroundColor Yellow
$nodeVersion = node --version 2>$null
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ Node.js $nodeVersion found" -ForegroundColor Green
Write-Host ""

# Generate NextAuth secret
Write-Host "Generating security keys..." -ForegroundColor Yellow
$secret = -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
Write-Host "✅ Security key generated" -ForegroundColor Green
Write-Host ""

# Ask for admin email
Write-Host "Enter your admin email (for admin dashboard access):" -ForegroundColor Yellow
$adminEmail = Read-Host "Admin email"
if ([string]::IsNullOrWhiteSpace($adminEmail)) {
    $adminEmail = "admin@applynhire.com"
    Write-Host "Using default: $adminEmail" -ForegroundColor Gray
}
Write-Host ""

# Create .env file with SQLite (no external database needed!)
Write-Host "Creating configuration file..." -ForegroundColor Yellow
$envContent = @"
# Database (SQLite - No setup required!)
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="$secret"

# Admin Configuration
ADMIN_EMAIL="$adminEmail"

# App URL
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Email (Optional - Leave empty for now)
RESEND_API_KEY=""
RESEND_FROM_EMAIL=""

# Google OAuth (Optional - Leave empty for now)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
"@

$envContent | Out-File -FilePath ".env" -Encoding UTF8 -Force
Write-Host "✅ Configuration file created (.env)" -ForegroundColor Green
Write-Host ""

# Install dependencies if needed
if (-Not (Test-Path "node_modules")) {
    Write-Host "Installing dependencies... (This may take a few minutes)" -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
    Write-Host ""
}

# Generate Prisma client
Write-Host "Setting up database..." -ForegroundColor Yellow
npx prisma generate
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to generate Prisma client" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Database client generated" -ForegroundColor Green
Write-Host ""

# Push database schema
Write-Host "Creating database tables..." -ForegroundColor Yellow
npx prisma db push
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to create database tables" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Database tables created" -ForegroundColor Green
Write-Host ""

# Success message
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host ""
Write-Host "Your ApplyNHire portal is ready!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run: npm run dev" -ForegroundColor White
Write-Host "2. Open: http://localhost:3000" -ForegroundColor White
Write-Host "3. Register as employer or applicant" -ForegroundColor White
Write-Host "4. Access admin at /admin with email: $adminEmail" -ForegroundColor White
Write-Host ""
Write-Host "Admin Credentials:" -ForegroundColor Yellow
Write-Host "  Email: $adminEmail" -ForegroundColor White
Write-Host "  (Use this email to register, then access /admin)" -ForegroundColor Gray
Write-Host ""
Write-Host "Press any key to start the development server..." -ForegroundColor Cyan
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# Start development server
Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Yellow
Write-Host ""
npm run dev
