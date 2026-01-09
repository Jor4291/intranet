#!/bin/bash

# Backend Setup Script
echo "🚀 Setting up Laravel Backend..."

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

# Check if composer is installed
if ! command -v composer &> /dev/null; then
    echo "❌ Composer is not installed. Please install it first:"
    echo "   Visit: https://getcomposer.org/download/"
    exit 1
fi

# Check if PHP is installed
if ! command -v php &> /dev/null; then
    echo "❌ PHP is not installed. Please install it first."
    exit 1
fi

# Install dependencies
echo "📦 Installing PHP dependencies..."
composer install

# Copy .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    if [ -f .env.example ]; then
        cp .env.example .env
        echo "✅ .env file created. Please update it with your database credentials."
    else
        echo "⚠️  .env.example not found. Creating basic .env file..."
        cat > .env << EOF
APP_NAME=Intranet
APP_ENV=local
APP_KEY=
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=intranet
DB_USERNAME=root
DB_PASSWORD=

SESSION_DRIVER=database
QUEUE_CONNECTION=database
CACHE_STORE=database
FILESYSTEM_DISK=local
EOF
    fi
else
    echo "✅ .env file already exists"
fi

# Generate app key
echo "🔑 Generating application key..."
php artisan key:generate

# Check database connection
echo "🔍 Checking database connection..."
php artisan migrate:status 2>&1 | grep -q "Connection" && echo "⚠️  Please configure your database in .env file" || echo "✅ Database connection OK"

echo ""
echo "📋 Next steps:"
echo "1. Update .env file with your database credentials"
echo "2. Create the database: mysql -u root -p -e 'CREATE DATABASE intranet;'"
echo "3. Run migrations: php artisan migrate"
echo "4. Seed database: php artisan db:seed"
echo "5. Create storage link: php artisan storage:link"
echo "6. Start server: php artisan serve"

