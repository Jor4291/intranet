# Quick Start Guide

## Prerequisites Installation

### macOS Installation (using Homebrew - recommended)

1. **Install Homebrew** (if not already installed):
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

2. **Install PHP 8.1+**:
```bash
brew install php@8.1
brew link php@8.1
```

3. **Install Composer**:
```bash
brew install composer
```

4. **Install Node.js 18+**:
```bash
brew install node
```

5. **Install MySQL**:
```bash
brew install mysql
brew services start mysql
```

6. **Install Angular CLI**:
```bash
npm install -g @angular/cli
```

### Alternative: Manual Installation

- **PHP**: Download from https://www.php.net/downloads.php
- **Composer**: Download from https://getcomposer.org/download/
- **Node.js**: Download from https://nodejs.org/
- **MySQL**: Download from https://dev.mysql.com/downloads/mysql/

## Automated Setup

Once prerequisites are installed, run the setup scripts:

### Backend Setup
```bash
cd backend
chmod +x setup.sh
./setup.sh
```

Then manually:
1. Edit `.env` file with your database credentials
2. Create database: `mysql -u root -p -e "CREATE DATABASE intranet;"`
3. Run migrations: `php artisan migrate`
4. Seed database: `php artisan db:seed`
5. Create storage link: `php artisan storage:link`

### Frontend Setup
```bash
cd frontend
chmod +x setup.sh
./setup.sh
```

## Manual Setup (Step by Step)

### Backend

1. **Navigate to backend directory**:
```bash
cd backend
```

2. **Install PHP dependencies**:
```bash
composer install
```

3. **Create .env file**:
```bash
cp .env.example .env
# Or create manually if .env.example doesn't exist
```

4. **Edit .env file** with your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=intranet
DB_USERNAME=root
DB_PASSWORD=your_password_here
```

5. **Generate application key**:
```bash
php artisan key:generate
```

6. **Create MySQL database**:
```bash
mysql -u root -p
```
Then in MySQL:
```sql
CREATE DATABASE intranet;
EXIT;
```

7. **Run migrations**:
```bash
php artisan migrate
```

8. **Seed the database** (creates demo org, roles, and admin user):
```bash
php artisan db:seed
```

9. **Create storage link**:
```bash
php artisan storage:link
```

10. **Start the server**:
```bash
php artisan serve
```

Backend will be available at: `http://localhost:8000`

### Frontend

1. **Navigate to frontend directory**:
```bash
cd frontend
```

2. **Install dependencies**:
```bash
npm install
```

3. **Start development server**:
```bash
ng serve
```

Frontend will be available at: `http://localhost:4200`

## Default Login Credentials

After running the seeders:
- **Organization Slug**: `demo`
- **Username**: `admin`
- **Password**: `password123`

## Troubleshooting

### Composer not found
- Make sure PHP and Composer are in your PATH
- Try: `export PATH=$PATH:/usr/local/bin` or add to `~/.zshrc`

### MySQL connection error
- Make sure MySQL is running: `brew services start mysql`
- Check your credentials in `.env`
- Verify database exists: `mysql -u root -p -e "SHOW DATABASES;"`

### Angular CLI not found
- Install globally: `npm install -g @angular/cli`
- Or use npx: `npx ng serve`

### Port already in use
- Backend: Change port with `php artisan serve --port=8001`
- Frontend: Change port with `ng serve --port=4201`

## Next Steps

Once both servers are running:
1. Open `http://localhost:4200` in your browser
2. Login with the default admin credentials
3. Start building out the widget components!

