#!/bin/bash

echo "🚀 Setting up minimal Intranet MVP..."

# Backend setup (no database)
cd backend
echo "📦 Installing PHP dependencies..."
composer install --no-dev --optimize-autoloader

echo "🔑 Generating app key..."
php artisan key:generate

# Create minimal .env for demo
cat > .env << EOL
APP_NAME=Intranet
APP_ENV=production
APP_KEY=$(php artisan key:generate --show)
APP_DEBUG=false
APP_URL=https://intranet-two-sepia.vercel.app
LOG_CHANNEL=stack
LOG_LEVEL=error
CACHE_DRIVER=array
SESSION_DRIVER=array
SANCTUM_STATEFUL_DOMAINS=intranet-two-sepia.vercel.app
EOL

cd ..

# Frontend setup
cd frontend
echo "📦 Installing Node dependencies..."
npm install

echo "🏗️ Building for production..."
npm run build

cd ..

echo "✅ Minimal setup complete!"
echo ""
echo "🎯 To run locally:"
echo "  Backend: cd backend && php artisan serve --host=127.0.0.1 --port=8000"
echo "  Frontend: cd frontend && npm start"
echo ""
echo "🔐 Demo login: demo / neill / demo123"
echo ""
echo "📤 Ready for Vercel deployment with commit: $(git rev-parse --short HEAD)"
