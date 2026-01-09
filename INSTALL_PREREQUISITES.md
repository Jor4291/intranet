# Installing Prerequisites

## Step 1: Add Homebrew to PATH

Homebrew is installed but not in your PATH. Add it to your shell configuration:

**For Apple Silicon Macs (M1/M2/M3):**
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
eval "$(/opt/homebrew/bin/brew shellenv)"
```

**For Intel Macs:**
```bash
echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zshrc
eval "$(/usr/local/bin/brew shellenv)"
```

Then verify it works:
```bash
brew --version
```

## Step 2: Install PHP

```bash
brew install php@8.1
```

Or for the latest PHP version:
```bash
brew install php
```

After installation, add PHP to your PATH:
```bash
# For PHP 8.1
echo 'export PATH="/opt/homebrew/opt/php@8.1/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/php@8.1/sbin:$PATH"' >> ~/.zshrc

# Or for latest PHP
echo 'export PATH="/opt/homebrew/opt/php/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/php/sbin:$PATH"' >> ~/.zshrc

# Reload your shell
source ~/.zshrc
```

Verify PHP installation:
```bash
php -v
```

## Step 3: Install Composer

```bash
brew install composer
```

Verify Composer installation:
```bash
composer --version
```

## Step 4: Install Node.js

```bash
brew install node
```

Verify Node.js installation:
```bash
node -v
npm -v
```

## Step 5: Install Angular CLI

```bash
npm install -g @angular/cli
```

Verify Angular CLI installation:
```bash
ng version
```

## Step 6: Install MySQL

```bash
brew install mysql
brew services start mysql
```

Set a root password (optional but recommended):
```bash
mysql_secure_installation
```

## Quick Install Script

You can run all of the above in one go:

```bash
# Add Homebrew to PATH (choose one based on your Mac)
# For Apple Silicon:
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zshrc
eval "$(/opt/homebrew/bin/brew shellenv)"

# For Intel:
# echo 'eval "$(/usr/local/bin/brew shellenv)"' >> ~/.zshrc
# eval "$(/usr/local/bin/brew shellenv)"

# Install all prerequisites
brew install php composer node mysql

# Start MySQL
brew services start mysql

# Install Angular CLI
npm install -g @angular/cli

# Add PHP to PATH (adjust version if needed)
echo 'export PATH="/opt/homebrew/opt/php/bin:$PATH"' >> ~/.zshrc
echo 'export PATH="/opt/homebrew/opt/php/sbin:$PATH"' >> ~/.zshrc

# Reload shell
source ~/.zshrc

# Verify installations
php -v
composer --version
node -v
npm -v
ng version
```

## Troubleshooting

### If commands still not found after adding to PATH:
1. Close and reopen your terminal
2. Or run: `source ~/.zshrc`
3. Or start a new terminal session

### If you get permission errors:
- Make sure you're not using `sudo` with Homebrew
- Check file permissions: `ls -la ~/.zshrc`

### If MySQL won't start:
```bash
brew services list
brew services restart mysql
```

