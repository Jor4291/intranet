#!/bin/bash

# Complete Setup Script for Intranet Project
# Run this from the project root directory

echo "🚀 Starting Intranet Setup..."
echo ""

# Source shell environment to get PATH updates
if [ -f ~/.zshrc ]; then
    source ~/.zshrc
fi

# Also try to add Homebrew to PATH if not already there
if [[ $(uname -m) == "arm64" ]] && [ -f /opt/homebrew/bin/brew ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)" 2>/dev/null
elif [ -f /usr/local/bin/brew ]; then
    eval "$(/usr/local/bin/brew shellenv)" 2>/dev/null
fi

# Get the directory where this script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

echo "📁 Working directory: $(pwd)"
echo ""

# Backend Setup
echo "═══════════════════════════════════════"
echo "🔧 Setting up Backend..."
echo "═══════════════════════════════════════"
cd backend
chmod +x setup.sh
./setup.sh
BACKEND_STATUS=$?
cd ..

if [ $BACKEND_STATUS -ne 0 ]; then
    echo ""
    echo "❌ Backend setup failed. Please check the errors above."
    exit 1
fi

echo ""
echo "═══════════════════════════════════════"
echo "🎨 Setting up Frontend..."
echo "═══════════════════════════════════════"
cd frontend
chmod +x setup.sh
./setup.sh
FRONTEND_STATUS=$?
cd ..

if [ $FRONTEND_STATUS -ne 0 ]; then
    echo ""
    echo "❌ Frontend setup failed. Please check the errors above."
    exit 1
fi

echo ""
echo "═══════════════════════════════════════"
echo "✅ Setup Complete!"
echo "═══════════════════════════════════════"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Configure database in backend/.env:"
echo "   - Update DB_DATABASE, DB_USERNAME, DB_PASSWORD"
echo ""
echo "2. Create the database:"
echo "   mysql -u root -p -e 'CREATE DATABASE intranet;'"
echo ""
echo "3. Run migrations:"
echo "   cd backend && php artisan migrate"
echo ""
echo "4. Seed the database:"
echo "   cd backend && php artisan db:seed"
echo ""
echo "5. Create storage link:"
echo "   cd backend && php artisan storage:link"
echo ""
echo "6. Start the servers:"
echo "   # Terminal 1 - Backend:"
echo "   cd backend && php artisan serve"
echo ""
echo "   # Terminal 2 - Frontend:"
echo "   cd frontend && ng serve"
echo ""

