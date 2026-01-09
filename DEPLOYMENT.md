# Intranet Deployment Guide

This guide covers deploying the Intranet application to Vercel for multi-user testing.

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to a GitHub repository
3. **Vercel CLI** (optional): `npm i -g vercel`

## Deployment Steps

### 1. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - **Framework Preset**: Other
   - **Root Directory**: `./` (leave empty)
   - **Build Command**: `npm run build` (for frontend)
   - **Output Directory**: `frontend/dist/intranet-frontend`

### 2. Environment Variables

Set these environment variables in Vercel dashboard (Project Settings > Environment Variables):

```
APP_NAME=Intranet
APP_ENV=production
APP_KEY=base64:your-generated-key-here
APP_DEBUG=false
APP_URL=https://your-project-name.vercel.app

DB_CONNECTION=sqlite
DB_DATABASE=/tmp/database.sqlite

SESSION_DRIVER=file
SESSION_LIFETIME=120
CACHE_DRIVER=file
QUEUE_CONNECTION=sync

SANCTUM_STATEFUL_DOMAINS=your-project-name.vercel.app
```

**Generate APP_KEY:**
```bash
cd backend
php artisan key:generate --show
```
Copy the generated key to Vercel's APP_KEY environment variable.

### 3. Update Configuration Files

Before deploying, update these files with your actual Vercel URL:

1. **`vercel.json`**: Replace `your-vercel-url.vercel.app` with your actual Vercel URL
2. **`backend/config/cors.php`**: Replace `your-vercel-url.vercel.app` with your actual Vercel URL
3. **`env-example.txt`**: Update with your actual Vercel URL

### 4. Deploy

1. Push your changes to GitHub
2. Vercel will automatically deploy
3. Monitor deployment in Vercel dashboard

### 5. Post-Deployment Setup

After successful deployment:

1. **Test Login**: Use the demo credentials:
   - Username: `admin@intranet.com`
   - Password: `password`

2. **Verify Database**: Check that dummy data is populated in all widgets

3. **Test Multi-User Access**: Open the app in multiple browser tabs/devices

## Architecture Overview

### Database
- **SQLite** for MVP (single shared database)
- **Future**: Separate databases per deployment
- **Persistence**: Server-authoritative data with real-time updates

### Authentication
- **Laravel Sanctum** for API authentication
- **Browser sessions** for state management
- **Separate user accounts** supported

### Real-time Features
- **Comments system** implemented (polling-based for MVP)
- **Future**: WebSocket support for live chat and real-time updates

### Performance
- **Serverless functions** for API routes
- **Static hosting** for frontend
- **File-based caching** and sessions

## Multi-User Testing

1. **Simultaneous Access**: Open the app in multiple browser tabs
2. **Different Devices**: Test on phones, tablets, and desktops
3. **User Isolation**: Each user should see their own data and interactions
4. **Real-time Updates**: Verify that comments and likes appear across all sessions

## Troubleshooting

### Common Issues

1. **CORS Errors**:
   - Verify `SANCTUM_STATEFUL_DOMAINS` matches your Vercel URL
   - Check `backend/config/cors.php` allowed origins

2. **Database Issues**:
   - SQLite database is created in `/tmp/` on Vercel
   - Migrations run automatically during deployment

3. **Authentication Issues**:
   - Verify `APP_KEY` is set correctly
   - Check Sanctum configuration

4. **Build Failures**:
   - Ensure all dependencies are in `package.json` and `composer.json`
   - Check build logs in Vercel dashboard

### Logs and Debugging

- **Vercel Dashboard**: View function logs and deployment status
- **Browser Console**: Check for frontend errors
- **Network Tab**: Verify API calls are working

## Future Enhancements

1. **Separate Databases**: Implement database-per-deployment
2. **WebSocket Integration**: Add real-time chat and live updates
3. **File Upload**: Implement document and file management
4. **User Registration**: Add self-registration flow
5. **Role-based Permissions**: Implement admin/user role restrictions

## Support

For deployment issues, check:
1. Vercel documentation: https://vercel.com/docs
2. Laravel deployment docs: https://laravel.com/docs/deployment
3. This project's GitHub issues
