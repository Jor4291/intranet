# Cloud-Hosted Intranet Solution - MVP

A cloud-hosted intranet platform providing employees with centralized access to company news, contacts, documents, applications, and personal productivity tools.

## Project Structure

```
Intranet/
├── frontend/          # Angular application with Fuse theme & Tailwind CSS
├── backend/           # Laravel API backend
└── README.md
```

## Technology Stack

- **Frontend**: Angular with Fuse theme and Tailwind CSS
- **Backend**: Laravel (RESTful API)
- **Database**: MySQL

## MVP Features

### Authentication & Authorization
- User ID and Password login (8+ character requirement)
- TOTP-ready for AWS mobile authenticator integration
- Role-based access control (Basic, Moderator, Administrator)
- Custom role creation with view/edit-create/admin permissions

### Core Features
- Real-time chat with online status indicators
- Newsfeed with posts, comments, and likes
- User Groups management
- Company Documents repository
- Personal File Manager
- Task List widget

### Widgets
1. **Newsfeed Widget** - Internal articles and announcements
2. **Contacts Widget** - Employee directory with availability status
3. **Company Documents Widget** - Policy and procedure documents
4. **Links and External Applications Widget** - Quick access to external tools
5. **File Manager Widget** - Personal document storage
6. **Task List Widget** - Personal to-do list management

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- PHP 8.1+ and Composer
- MySQL 8.0+
- Angular CLI

### Backend Setup
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend Setup
```bash
cd frontend
npm install
ng serve
```

## Development Status

✅ **Completed:**
- Project structure and configuration
- Database schema with tenant isolation
- Laravel API backend with all core endpoints
- Angular frontend foundation with Tailwind CSS
- Authentication system (login/register)
- SSE endpoints for real-time updates
- TOTP structure (mock verification)
- File storage setup (local, S3-ready)
- Initial admin user seeder

🚧 **In Progress:**
- Widget implementations (Newsfeed, Contacts, Documents, Links, File Manager, Task List)
- Real-time chat UI
- Role-based UI restrictions
- User group management UI

📋 **See SETUP.md for detailed setup instructions**

## Architecture Decisions

- **Multi-tenancy**: Shared database with organization-based isolation
- **Real-time**: Server-Sent Events (SSE) for chat and online status
- **File Storage**: Local storage for MVP, easily switchable to S3
- **Authentication**: Laravel Sanctum with TOTP-ready structure
- **Frontend**: Angular 17+ with standalone components and Tailwind CSS

