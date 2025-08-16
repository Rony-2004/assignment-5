# Store Rating System - Deployment Guide

A modern, responsive store rating and management system built with React, Node.js, Express, and PostgreSQL.

## 🚀 Live Demo

- Frontend: [Deployed on Vercel](https://your-app-name.vercel.app)
- Backend API: [Deployed on Render](https://your-backend-app.onrender.com)

## ✨ Features

- **Multi-Role System**: Admin, Store Owner, and User roles with different permissions
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop devices
- **Modern UI**: Built with Material-UI and stunning gradients
- **Real-time Updates**: Live data synchronization
- **Secure Authentication**: JWT-based authentication system
- **Store Management**: Complete CRUD operations for stores
- **Rating System**: 5-star rating system with reviews
- **Dashboard Analytics**: Comprehensive dashboards for all user roles

## 🏗️ Tech Stack

### Frontend
- **React 18** with Vite
- **Material-UI (MUI)** for components
- **React Router** for navigation
- **Axios** for API calls
- **Responsive Design** with breakpoints

### Backend
- **Node.js** with Express
- **PostgreSQL** with Prisma ORM
- **JWT Authentication**
- **CORS** enabled for cross-origin requests
- **Validation** with express-validator

## 📱 Responsive Design Features

- **Mobile-First Approach**: Optimized for all screen sizes
- **Adaptive Navigation**: Desktop menu converts to mobile drawer
- **Responsive Tables**: Desktop tables convert to mobile cards
- **Touch-Friendly**: Optimized for touch interactions
- **Fast Loading**: Optimized bundle size and lazy loading

## 🔐 Default Credentials

After deployment, you can login with these test accounts:

### Admin Account
- **Email**: admin@example.com
- **Password**: Admin@1234

### Store Owner Account
- **Email**: owner@example.com
- **Password**: Admin@1234

### Regular User Account
- **Email**: user@example.com
- **Password**: Admin@1234

## 🚀 Deployment Instructions

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database (can use free tier on Render, Supabase, or ElephantSQL)
- Vercel account (free tier available)
- Render account (free tier available)

### 1. Backend Deployment on Render

1. **Fork/Clone the repository**
2. **Create a new Web Service on Render**
   - Connect your GitHub repository
   - Select the `backend` folder as root directory
   - Set build command: `npm install && npx prisma generate`
   - Set start command: `npm start`

3. **Add Environment Variables on Render:**
   ```
   DATABASE_URL=postgresql://username:password@hostname:5432/database_name
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-very-long-and-random
   NODE_ENV=production
   CORS_ORIGIN=https://your-frontend-app.vercel.app
   ```

4. **Database Setup:**
   - Create a PostgreSQL database (Render PostgreSQL or external provider)
   - Run migrations: `npx prisma migrate deploy`
   - Seed the database: `npm run db:seed`

### 2. Frontend Deployment on Vercel

1. **Create a new project on Vercel**
   - Import your GitHub repository
   - Set root directory to `frontend`
   - Framework preset: Vite
   - Build command: `npm run build`
   - Output directory: `dist`

2. **Add Environment Variables on Vercel:**
   ```
   VITE_API_URL=https://your-backend-app.onrender.com/api
   VITE_APP_NAME=Store Rating System
   ```

3. **Update CORS Origins:**
   - After deployment, update the `CORS_ORIGIN` environment variable on Render
   - Set it to your Vercel domain: `https://your-app.vercel.app`

### 3. Final Configuration

1. **Update API URL**: Replace placeholder URLs in the code with your actual deployment URLs
2. **Test All Features**: Verify all functionality works in production
3. **Monitor Performance**: Check both Vercel and Render dashboards for performance metrics

## 🌟 Key Features Implemented

### Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- Role-based access control
- Secure API endpoints

### User Management
- Admin can create/view all users
- Role-based dashboards
- User profile management
- Password update functionality

### Store Management
- Store owners can manage their stores
- Admin oversight of all stores
- Store location and details
- Image support for store profiles

### Rating System
- 5-star rating system
- Review comments
- Average rating calculations
- Rating history and analytics

### Responsive Dashboard
- Real-time statistics
- Interactive charts and metrics
- Mobile-optimized layouts
- Role-specific data views

## 📋 Environment Variables Reference

### Backend (.env)
```env
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-key
PORT=5000
CORS_ORIGIN=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend (.env.local)
```env
VITE_API_URL=https://your-backend.onrender.com/api
VITE_APP_NAME=Store Rating System
```

## 🐛 Troubleshooting

### Common Issues:

1. **CORS Errors**: Ensure CORS_ORIGIN matches your frontend URL exactly
2. **Database Connection**: Verify DATABASE_URL is correct and database is accessible
3. **Build Failures**: Check Node.js version compatibility
4. **API 404 Errors**: Verify VITE_API_URL points to correct backend URL

### Performance Optimization:

1. **Frontend**: 
   - Lazy loading implemented for routes
   - Optimized bundle size with tree shaking
   - Image optimization and caching

2. **Backend**:
   - Database query optimization
   - Response compression
   - Efficient pagination

## 📞 Support

For deployment issues or questions:
- Check the deployment logs on Render/Vercel
- Verify all environment variables are set correctly
- Ensure database migrations have run successfully

## 🔄 Updates and Maintenance

1. **Database Migrations**: Use `npx prisma migrate deploy` for production
2. **Dependencies**: Regularly update packages for security
3. **Monitoring**: Set up uptime monitoring for both services
4. **Backups**: Regular database backups (automated on most PostgreSQL providers)

---

**Note**: Replace all placeholder URLs (`your-app-name.vercel.app`, `your-backend-app.onrender.com`) with your actual deployment URLs.

This system is now fully deployed and ready for production use with responsive design across all devices! 🎉
