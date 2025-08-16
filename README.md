# 🏪 Store Rating System

A modern, full-stack web application for rating and managing stores with a comprehensive role-based access control system. Built with responsive design and stunning UI components.

## 🌟 Features

### 🎭 Multi-Role System
- **👨‍💼 System Administrator**: Complete system oversight with user and store management
- **🏪 Store Owner**: Dashboard analytics and store management capabilities  
- **👤 Regular User**: Store browsing, rating, and review functionality

### 📱 Responsive Design
- **Mobile-First Approach**: Optimized for all screen sizes (mobile, tablet, desktop)
- **Adaptive Navigation**: Desktop menu seamlessly converts to mobile drawer
- **Touch-Friendly**: Optimized for touch interactions and gestures
- **Fast Loading**: Optimized bundle size with lazy loading

### 🎨 Modern UI/UX
- **Material-UI Components**: Professional and consistent design system
- **Gradient Themes**: Beautiful gradient backgrounds and glass morphism effects
- **Interactive Elements**: Smooth transitions and hover effects
- **Credential Display**: Login screen shows test credentials for easy access

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt encryption for user passwords
- **Role-Based Access**: Different permissions for each user type
- **Protected Routes**: Secure API endpoints and frontend routes

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite for fast development and building
- **Material-UI (MUI)** for comprehensive component library
- **React Router** for client-side routing
- **Axios** for API communication
- **Responsive Design** with mobile-first breakpoints

### Backend  
- **Node.js** with Express.js framework
- **PostgreSQL** database with Prisma ORM
- **JWT** for authentication and authorization
- **Express Validator** for input validation
- **CORS** enabled for cross-origin requests

### DevOps & Deployment
- **Vercel** for frontend hosting (recommended)
- **Render** for backend and database hosting
- **Environment Variables** for secure configuration
- **Git** version control with comprehensive .gitignore

## 🔐 Default Login Credentials

After setting up the database, you can use these test accounts:

### Administrator Account
- **Email**: `admin@example.com`
- **Password**: `Admin@1234`
- **Access**: Full system management, user creation, store oversight

### Store Owner Account  
- **Email**: `owner@example.com`
- **Password**: `Admin@1234`
- **Access**: Store management, ratings analytics, dashboard

### Regular User Account
- **Email**: `user@example.com` 
- **Password**: `Admin@1234`
- **Access**: Store browsing, rating submission, profile management

## 🛠️ Setup Instructions

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **PostgreSQL** database (local or cloud)
- **npm** or **yarn** package manager
- **Git** for version control

### 🔧 Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   - Copy `.env.example` to `.env`
   - Update database connection and secrets:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/store_rating_db"
   JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
   PORT=5000
   CORS_ORIGIN="http://localhost:3000"
   ```

4. **Setup database:**
   ```bash
   npm run db:generate  # Generate Prisma client
   npm run db:migrate   # Run database migrations  
   npm run db:seed      # Seed with test data
   ```

5. **Start the backend server:**
   ```bash
   npm run dev          # Development with auto-reload
   # or
   npm start           # Production mode
   ```

### 🎨 Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment (optional):**
   - Copy `.env.example` to `.env.local` for custom API URLs
   ```env
   VITE_API_URL=http://localhost:5000/api  # Backend API URL
   VITE_APP_NAME=Store Rating System
   ```

4. **Start the development server:**
   ```bash
   npm run dev          # Development server with HMR
   # or  
   npm run build        # Production build
   npm run preview      # Preview production build
   ```

5. **Access the application:**
   - Open browser to `http://localhost:3000` or `http://localhost:5173`
   - Login with provided test credentials
   - Experience the responsive design on different screen sizes

## 📱 Responsive Design Testing

The application is fully responsive. Test on:
- **Mobile**: 320px - 768px (phones)
- **Tablet**: 768px - 1024px (tablets) 
- **Desktop**: 1024px+ (laptops, desktops)

### Key Responsive Features:
- Navigation converts to mobile drawer on small screens
- Tables become mobile-friendly cards 
- Touch-optimized buttons and interactions
- Adaptive font sizes and spacing
- Optimized images and layouts

## 🚀 Deployment Guide

For production deployment, see [`DEPLOYMENT.md`](./DEPLOYMENT.md) for detailed instructions on:
- **Vercel** deployment for frontend
- **Render** deployment for backend  
- Environment variable configuration
- Database setup and migrations
- Domain configuration and CORS setup

## 📚 API Documentation

### 🔐 Authentication Endpoints
- `POST /api/auth/register` - Register new user account
- `POST /api/auth/login` - User authentication login
- `PUT /api/auth/update-password` - Update user password

### 👥 User Management (Admin Only)
- `GET /api/users` - Get paginated users with search/filter
- `POST /api/users` - Create new user account
- `PUT /api/users/:id` - Update existing user
- `DELETE /api/users/:id` - Delete user account

### 🏪 Store Management
- `GET /api/stores` - Get stores with pagination, search, and filters
- `POST /api/stores` - Create new store (Admin/Owner)
- `PUT /api/stores/:id` - Update store information (Admin/Owner)
- `DELETE /api/stores/:id` - Delete store (Admin only)
- `GET /api/stores/:id` - Get single store details

### ⭐ Rating System
- `POST /api/ratings` - Submit or update store rating
- `GET /api/ratings/user/:userId` - Get user's rating history
- `GET /api/ratings/store/:storeId` - Get all ratings for a store
- `DELETE /api/ratings/:id` - Delete rating (Admin/Owner)

### 📊 Dashboard Analytics
- `GET /api/dashboard/admin` - Admin dashboard with system statistics
- `GET /api/dashboard/owner` - Store owner dashboard with store analytics
- `GET /api/dashboard/user` - User dashboard with rating history

## ✅ Form Validations

### User Registration/Management
- **Name**: 2-50 characters, letters and spaces only
- **Email**: Valid email format, unique in system
- **Password**: Minimum 8 characters with uppercase, lowercase, number
- **Address**: 10-200 characters
- **Role**: USER, OWNER, or ADMIN

### Store Management  
- **Store Name**: 3-100 characters, unique name required
- **Description**: 10-500 characters describing the store
- **Location**: 5-200 characters for store address
- **Category**: Selected from predefined categories

### Rating Submission
- **Rating**: 1-5 stars (integer values only)
- **Comment**: Optional, 0-500 characters
- **Store Selection**: Must be existing, active store

## 🔧 Development Features

### Code Quality
- **ESLint** configuration for code consistency
- **Prettier** for code formatting
- **Git Hooks** for pre-commit validation
- **Error Boundaries** for graceful error handling

### Performance Optimizations
- **Lazy Loading** for route components
- **Image Optimization** with responsive images
- **Bundle Splitting** for optimal loading
- **Caching Strategies** for API responses

### Security Measures
- **Input Sanitization** on all form inputs  
- **SQL Injection Protection** via Prisma ORM
- **XSS Protection** with Content Security Policy
- **Rate Limiting** on authentication endpoints

## 🐛 Troubleshooting

### Common Issues

1. **Database Connection Error**
   ```bash
   # Check if PostgreSQL is running
   # Verify DATABASE_URL in .env file
   npm run db:generate
   ```

2. **Port Already in Use**
   ```bash
   # Backend (Port 5000)
   netstat -ano | findstr :5000
   taskkill /PID <PID> /F
   
   # Frontend (Port 3000/5173)  
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

3. **CORS Errors in Production**
   - Update `CORS_ORIGIN` environment variable
   - Ensure frontend and backend URLs match
   - Check Vercel/Render deployment logs

4. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   npm run build
   ```

## 🤝 Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`  
5. **Open Pull Request** with detailed description

### Development Guidelines
- Follow existing code style and conventions
- Add tests for new functionality  
- Update documentation for API changes
- Ensure responsive design for all new components
- Test on multiple devices and screen sizes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Material-UI** for the comprehensive component library
- **Prisma** for the excellent database toolkit
- **Vercel** and **Render** for reliable hosting platforms
- **React** community for extensive documentation and support

---

## 📞 Support & Contact

For questions, issues, or contributions:
- **GitHub Issues**: [Create an issue](https://github.com/your-username/store-rating-system/issues)
- **Documentation**: Check the `DEPLOYMENT.md` for deployment guides
- **Community**: Join discussions in the repository

**Made with ❤️ by the Store Rating System Team**

---

*This application demonstrates modern full-stack development with responsive design, secure authentication, and comprehensive user management. Perfect for learning React, Node.js, and PostgreSQL integration!* 🚀
- **Address**: Max 400 characters
- **Password**: 8-16 characters, must include uppercase letter and special character
- **Email**: Standard email validation
- **Rating**: 1-5 stars

## Features Implemented

✅ User registration and authentication
✅ Role-based access control
✅ Store browsing and search
✅ Rating submission and updates
✅ Admin dashboard with statistics
✅ Store owner dashboard with analytics
✅ Responsive Material-UI design
✅ Form validation
✅ Pagination and sorting
✅ Real-time updates

## Development Notes

- The application uses Prisma as the ORM for database operations
- JWT tokens are used for authentication
- Material-UI provides the component library
- Vite is used as the build tool for faster development
- CORS is configured to allow frontend-backend communication

## Deployment

For production deployment:

1. Update environment variables for production
2. Build the frontend: `npm run build`
3. Serve the frontend build files
4. Deploy the backend with proper PostgreSQL connection
5. Update CORS settings for production domains

## License

This project is for educational/demonstration purposes.
