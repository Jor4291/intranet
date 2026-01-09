#!/bin/bash

# Prerequisites Installation Script
echo "🚀 Installing Prerequisites for Intranet Project..."
echo ""

# Detect Mac architecture
if [[ $(uname -m) == "arm64" ]]; then
    BREW_PATH="/opt/homebrew/bin/brew"
    PHP_PATH="/opt/homebrew/opt/php"
    echo "📱 Detected: Apple Silicon Mac"
else
    BREW_PATH="/usr/local/bin/brew"
    PHP_PATH="/usr/local/opt/php"
    echo "💻 Detected: Intel Mac"
fi

# Add Homebrew to PATH if not already there
if ! command -v brew &> /dev/null; then
    echo "📦 Adding Homebrew to PATH..."
    if [ -f "$BREW_PATH" ]; then
        echo "eval \"\$($BREW_PATH shellenv)\"" >> ~/.zshrc
        eval "$($BREW_PATH shellenv)"
        echo "✅ Homebrew added to PATH"
    else
        echo "❌ Homebrew not found. Please install it first:"
        echo "   /bin/bash -c \"\$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)\""
        exit 1
    fi
else
    echo "✅ Homebrew already in PATH"
fi

# Install PHP
echo ""
echo "🐘 Installing PHP..."
if ! command -v php &> /dev/null; then
    brew install php
    echo "✅ PHP installed"
    
    # Add PHP to PATH
    if [[ $(uname -m) == "arm64" ]]; then
        echo 'export PATH="/opt/homebrew/opt/php/bin:$PATH"' >> ~/.zshrc
        echo 'export PATH="/opt/homebrew/opt/php/sbin:$PATH"' >> ~/.zshrc
    else
        echo 'export PATH="/usr/local/opt/php/bin:$PATH"' >> ~/.zshrc
        echo 'export PATH="/usr/local/opt/php/sbin:$PATH"' >> ~/.zshrc
    fi
    source ~/.zshrc
else
    echo "✅ PHP already installed"
fi

# Install Composer
echo ""
echo "📦 Installing Composer..."
if ! command -v composer &> /dev/null; then
    brew install composer
    echo "✅ Composer installed"
else
    echo "✅ Composer already installed"
fi

# Install Node.js
echo ""
echo "🟢 Installing Node.js..."
if ! command -v node &> /dev/null; then
    brew install node
    echo "✅ Node.js installed"
else
    echo "✅ Node.js already installed"
fi

# Install Angular CLI
echo ""
echo "🅰️  Installing Angular CLI..."
if ! command -v ng &> /dev/null; then
    npm install -g @angular/cli
    echo "✅ Angular CLI installed"
else
    echo "✅ Angular CLI already installed"
fi

# Install MySQL
echo ""
echo "🗄️  Installing MySQL..."
if ! brew list mysql &> /dev/null; then
    brew install mysql
    echo "✅ MySQL installed"
    
    # Start MySQL service
    echo "🚀 Starting MySQL service..."
    brew services start mysql
    echo "✅ MySQL service started"
else
    echo "✅ MySQL already installed"
    # Make sure it's running
    brew services start mysql 2>/dev/null || true
fi

echo ""
echo "═══════════════════════════════════════"
echo "✅ All Prerequisites Installed!"
echo "═══════════════════════════════════════"
echo ""
echo "📋 Verifying installations..."
echo ""

# Verify installations
echo -n "PHP: "
php -v 2>/dev/null | head -n 1 || echo "❌ Not found"

echo -n "Composer: "
composer --version 2>/dev/null | head -n 1 || echo "❌ Not found"

echo -n "Node.js: "
node -v 2>/dev/null || echo "❌ Not found"

echo -n "npm: "
npm -v 2>/dev/null || echo "❌ Not found"

echo -n "Angular CLI: "
ng version 2>/dev/null | head -n 1 || echo "❌ Not found"

echo -n "MySQL: "
mysql --version 2>/dev/null | head -n 1 || echo "❌ Not found"

echo ""
echo "📝 Note: If any commands show 'not found', you may need to:"
echo "   1. Close and reopen your terminal"
echo "   2. Or run: source ~/.zshrc"
echo ""
echo "🚀 Next step: Run ./setup-all.sh to set up the project"

