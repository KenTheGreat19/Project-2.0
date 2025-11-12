@echo off
echo 🚀 Setting up ApplyNHire...

:: Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

echo ✅ Node.js detected
node -v

:: Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ❌ npm is not installed. Please install npm first.
    exit /b 1
)

echo ✅ npm detected
npm -v

:: Install dependencies
echo 📦 Installing dependencies...
call npm install

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)

echo ✅ Dependencies installed successfully

:: Check if .env file exists
if not exist .env (
    echo 📝 Creating .env file from .env.example...
    copy .env.example .env
    echo ⚠️  Please update .env with your actual credentials
) else (
    echo ✅ .env file already exists
)

:: Generate Prisma client
echo 🔧 Generating Prisma client...
call npx prisma generate

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to generate Prisma client
    exit /b 1
)

echo ✅ Prisma client generated

:: Push database schema
echo 🗄️  Pushing database schema...
echo ⚠️  Make sure your DATABASE_URL in .env is configured correctly
call npx prisma db push

if %ERRORLEVEL% NEQ 0 (
    echo ❌ Failed to push database schema
    echo ℹ️  Please check your DATABASE_URL in .env
    exit /b 1
)

echo ✅ Database schema pushed successfully

echo.
echo 🎉 Setup complete!
echo.
echo Next steps:
echo 1. Update .env with your actual credentials
echo 2. Run 'npm run dev' to start the development server
echo 3. Open http://localhost:3000 in your browser
echo.
echo 📚 For more information, see README.md
