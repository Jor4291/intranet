#!/bin/bash

# Vercel deployment script for Laravel Intranet
echo "🚀 Starting Vercel deployment..."

# Set up environment
export APP_ENV=production
export DB_CONNECTION=sqlite
export DB_DATABASE=/tmp/database.sqlite

# Generate application key if not set
if [ -z "$APP_KEY" ]; then
    echo "🔑 Generating application key..."
    php backend/artisan key:generate
fi

# Create SQLite database
echo "📊 Creating SQLite database..."
touch /tmp/database.sqlite
chmod 666 /tmp/database.sqlite

# Run migrations
echo "🔄 Running database migrations..."
cd backend
php artisan migrate --force

# Seed the database
echo "🌱 Seeding database..."
php artisan db:seed --force

echo "✅ Deployment complete!"
