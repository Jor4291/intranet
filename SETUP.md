# Intranet MVP Setup Guide

## Prerequisites

- PHP 8.1+ with Composer
- Node.js 18+ with npm
- MySQL 8.0+
- Angular CLI (install with `npm install -g @angular/cli`)

## Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install PHP dependencies:
```bash
composer install
```

3. Copy environment file:
```bash
cp .env.example .env
```

4. Generate application key:
```bash
php artisan key:generate
```

5. Update `.env` with your database credentials:
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=intranet
DB_USERNAME=root
DB_PASSWORD=your_password
```

6. Create the database:
```bash
mysql -u root -p -e "CREATE DATABASE intranet;"
```

7. Run migrations:
```bash
php artisan migrate
```

8. Seed the database (creates demo organization, roles, and admin user):
```bash
php artisan db:seed
```

9. Create storage link:
```bash
php artisan storage:link
```

10. Start the Laravel development server:
```bash
php artisan serve
```

The API will be available at `http://localhost:8000`

### Default Admin Credentials
- **Organization Slug**: `demo`
- **Username**: `admin`
- **Password**: `password123`

## Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
ng serve
```

The frontend will be available at `http://localhost:4200`

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/me` - Get current user

### Newsfeed
- `GET /api/newsfeed` - Get newsfeed posts
- `POST /api/newsfeed` - Create post
- `POST /api/newsfeed/{id}/comment` - Add comment
- `POST /api/newsfeed/{id}/like` - Like post
- `DELETE /api/newsfeed/{id}/like` - Unlike post

### Chat
- `GET /api/chat/contacts` - Get contacts
- `GET /api/chat/messages/{userId}` - Get messages
- `POST /api/chat/messages` - Send message

### Tasks
- `GET /api/tasks` - Get tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Documents
- `GET /api/documents` - Get documents
- `POST /api/documents` - Upload document
- `DELETE /api/documents/{id}` - Delete document

### User Groups
- `GET /api/user-groups` - Get groups
- `POST /api/user-groups` - Create group
- `POST /api/user-groups/{id}/members` - Add member
- `DELETE /api/user-groups/{id}/members/{userId}` - Remove member

### Roles
- `GET /api/roles` - Get roles
- `POST /api/roles` - Create role
- `POST /api/users/{id}/roles` - Assign role

### External Links
- `GET /api/external-links` - Get links
- `POST /api/external-links` - Create link
- `PUT /api/external-links/{id}` - Update link
- `DELETE /api/external-links/{id}` - Delete link

### Real-time (SSE)
- `GET /api/sse/stream` - SSE stream for real-time updates
- `POST /api/sse/status` - Update user status

### TOTP
- `POST /api/totp/generate` - Generate TOTP secret
- `POST /api/totp/verify` - Verify TOTP code
- `POST /api/totp/disable` - Disable TOTP

## Project Structure

```
Intranet/
├── backend/              # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   └── Controllers/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   └── routes/
│       └── api.php
├── frontend/             # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/     # Services, interceptors
│   │   │   ├── features/  # Feature modules
│   │   │   └── shared/    # Shared components
│   │   └── environments/
│   └── angular.json
└── README.md
```

## Next Steps

1. Implement widget components in Angular
2. Add real-time chat functionality
3. Implement file upload/download
4. Add role-based UI restrictions
5. Implement user group filtering
6. Add external API integrations
7. Deploy to demo environment

