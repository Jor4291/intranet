#!/bin/bash

# Frontend Setup Script
echo "🚀 Setting up Angular Frontend..."

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

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install it first:"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install Node.js first."
    exit 1
fi

# Check Node version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "⚠️  Warning: Node.js version 18+ is recommended. Current version: $(node -v)"
fi

# Check if Angular CLI is installed globally
if ! command -v ng &> /dev/null; then
    echo "📦 Installing Angular CLI globally..."
    npm install -g @angular/cli
fi

# Install dependencies
echo "📦 Installing npm dependencies..."
npm install

echo ""
echo "✅ Frontend setup complete!"
echo "📋 Next steps:"
echo "1. Start development server: ng serve"
echo "2. Open browser to: http://localhost:4200"

