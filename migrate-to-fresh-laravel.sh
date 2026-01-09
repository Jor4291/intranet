#!/bin/bash

# Script to migrate custom code to a fresh Laravel installation
echo "🔄 Migrating to Fresh Laravel Installation..."
echo ""

cd "$(dirname "$0")"

# Create fresh Laravel installation
echo "📦 Creating fresh Laravel installation..."
composer create-project --prefer-dist laravel/laravel backend-fresh

# Copy our custom code
echo "📋 Copying custom code..."

# Models
echo "  - Models..."
cp -r backend/app/Models/* backend-fresh/app/Models/ 2>/dev/null

# Controllers
echo "  - Controllers..."
cp -r backend/app/Http/Controllers/* backend-fresh/app/Http/Controllers/ 2>/dev/null

# Migrations
echo "  - Migrations..."
cp -r backend/database/migrations/* backend-fresh/database/migrations/ 2>/dev/null
cp -r backend/database/seeders/* backend-fresh/database/seeders/ 2>/dev/null

# Routes
echo "  - Routes..."
cp backend/routes/api.php backend-fresh/routes/api.php

# Config (keep our filesystems.php)
echo "  - Config..."
cp backend/config/filesystems.php backend-fresh/config/filesystems.php

# .env file
echo "  - Environment..."
if [ -f backend/.env ]; then
    cp backend/.env backend-fresh/.env
fi

# Composer dependencies
echo "  - Dependencies..."
cd backend-fresh
composer require laravel/sanctum spatie/laravel-permission

echo ""
echo "✅ Migration complete!"
echo ""
echo "📋 Next steps:"
echo "1. cd backend-fresh"
echo "2. php artisan key:generate"
echo "3. php artisan migrate"
echo "4. php artisan db:seed"
echo "5. php artisan storage:link"
echo ""

