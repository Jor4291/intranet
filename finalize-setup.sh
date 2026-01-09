#!/bin/bash

# Finalize Setup Script - Database and Server Startup
echo "🚀 Finalizing Intranet Setup..."
echo ""

# Source environment
if [ -f ~/.zshrc ]; then
    source ~/.zshrc
fi

if [[ $(uname -m) == "arm64" ]] && [ -f /opt/homebrew/bin/brew ]; then
    eval "$(/opt/homebrew/bin/brew shellenv)" 2>/dev/null
fi

cd "$(dirname "$0")"

# Step 1: Check .env configuration
echo "═══════════════════════════════════════"
echo "📝 Step 1: Database Configuration"
echo "═══════════════════════════════════════"

cd backend

if [ ! -f .env ]; then
    echo "❌ .env file not found. Please run ./setup-all.sh first."
    exit 1
fi

# Check if database is configured
DB_NAME=$(grep "^DB_DATABASE=" .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")
DB_USER=$(grep "^DB_USERNAME=" .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")
DB_PASS=$(grep "^DB_PASSWORD=" .env | cut -d '=' -f2 | tr -d '"' | tr -d "'")

echo "Current database configuration:"
echo "  Database: ${DB_NAME:-'not set'}"
echo "  Username: ${DB_USER:-'not set'}"
echo "  Password: ${DB_PASS:-'(empty)'}"
echo ""

if [ -z "$DB_NAME" ] || [ "$DB_NAME" = "" ]; then
    echo "⚠️  Database name not configured in .env"
    echo "   Please edit backend/.env and set:"
    echo "   DB_DATABASE=intranet"
    echo "   DB_USERNAME=root"
    echo "   DB_PASSWORD=your_password"
    echo ""
    read -p "Press Enter after updating .env file..."
fi

# Step 2: Create database
echo ""
echo "═══════════════════════════════════════"
echo "🗄️  Step 2: Creating Database"
echo "═══════════════════════════════════════"

DB_NAME=${DB_NAME:-intranet}
DB_USER=${DB_USER:-root}

echo "Creating database: $DB_NAME"
if [ -z "$DB_PASS" ] || [ "$DB_PASS" = "" ]; then
    mysql -u "$DB_USER" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Database created successfully"
    else
        echo "⚠️  Could not create database without password."
        echo "   Please run manually: mysql -u root -p -e 'CREATE DATABASE $DB_NAME;'"
        read -p "Press Enter after creating the database..."
    fi
else
    mysql -u "$DB_USER" -p"$DB_PASS" -e "CREATE DATABASE IF NOT EXISTS $DB_NAME;" 2>/dev/null
    if [ $? -eq 0 ]; then
        echo "✅ Database created successfully"
    else
        echo "⚠️  Could not create database. Please check your credentials."
        echo "   Run manually: mysql -u $DB_USER -p -e 'CREATE DATABASE $DB_NAME;'"
        read -p "Press Enter after creating the database..."
    fi
fi

# Step 3: Run migrations
echo ""
echo "═══════════════════════════════════════"
echo "🔄 Step 3: Running Migrations"
echo "═══════════════════════════════════════"

php artisan migrate --force
if [ $? -eq 0 ]; then
    echo "✅ Migrations completed successfully"
else
    echo "❌ Migrations failed. Please check your database configuration."
    exit 1
fi

# Step 4: Seed database
echo ""
echo "═══════════════════════════════════════"
echo "🌱 Step 4: Seeding Database"
echo "═══════════════════════════════════════"

php artisan db:seed --force
if [ $? -eq 0 ]; then
    echo "✅ Database seeded successfully"
    echo ""
    echo "📋 Default Admin Credentials:"
    echo "   Organization Slug: demo"
    echo "   Username: admin"
    echo "   Password: password123"
else
    echo "❌ Seeding failed."
    exit 1
fi

# Step 5: Create storage link
echo ""
echo "═══════════════════════════════════════"
echo "📁 Step 5: Creating Storage Link"
echo "═══════════════════════════════════════"

php artisan storage:link
if [ $? -eq 0 ]; then
    echo "✅ Storage link created successfully"
else
    echo "⚠️  Storage link creation failed (may already exist)"
fi

echo ""
echo "═══════════════════════════════════════"
echo "✅ Setup Complete!"
echo "═══════════════════════════════════════"
echo ""
echo "🚀 To start the servers:"
echo ""
echo "   Terminal 1 - Backend:"
echo "   cd backend && php artisan serve"
echo ""
echo "   Terminal 2 - Frontend:"
echo "   cd frontend && ng serve"
echo ""
echo "   Then open: http://localhost:4200"
echo ""

