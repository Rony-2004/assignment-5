import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Container, Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { useAuth } from './contexts/AuthContext.jsx'
import Navbar from './components/Layout/Navbar.jsx'
import Login from './pages/Auth/Login.jsx'
import Register from './pages/Auth/Register.jsx'
import AdminDashboard from './pages/Admin/AdminDashboard.jsx'
import UserDashboard from './pages/User/UserDashboard.jsx'
import OwnerDashboard from './pages/Owner/OwnerDashboard.jsx'
import StoreList from './pages/Stores/StoreList.jsx'
import UserList from './pages/Admin/UserList.jsx'
import AddUser from './pages/Admin/AddUser.jsx'
import AddStore from './pages/Admin/AddStore.jsx'
import UpdatePassword from './pages/Auth/UpdatePassword.jsx'
import ProtectedRoute from './components/Auth/ProtectedRoute.jsx'

// Create a beautiful theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
      light: '#64b5f6',
      dark: '#1976d2',
    },
    secondary: {
      main: '#ff4081',
      light: '#ff80ab',
      dark: '#c60055',
    },
    background: {
      default: '#f8fafc',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: '0 16px 48px rgba(0,0,0,0.15)',
            transform: 'translateY(-4px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
        },
        contained: {
          boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
          '&:hover': {
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
})

function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box 
          display="flex" 
          justifyContent="center" 
          alignItems="center" 
          minHeight="100vh"
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }}
        >
          <Box textAlign="center">
            <Box
              sx={{
                width: 60,
                height: 60,
                border: '4px solid #ffffff30',
                borderTop: '4px solid #ffffff',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite',
                margin: '0 auto',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' },
                },
              }}
            />
            <Box mt={2} color="white" fontSize="1.2rem" fontWeight={600}>
              Loading...
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box className="App" sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
        {user && <Navbar />}
        <Box sx={{ minHeight: user ? 'calc(100vh - 64px)' : '100vh' }}>
          <Routes>
            <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
            
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Container maxWidth="xl" sx={{ py: 4 }}>
                  {user?.role === 'ADMIN' && <AdminDashboard />}
                  {user?.role === 'USER' && <UserDashboard />}
                  {user?.role === 'OWNER' && <OwnerDashboard />}
                </Container>
              </ProtectedRoute>
            } />
            
            <Route path="/stores" element={
              <ProtectedRoute>
                <Container maxWidth="xl" sx={{ py: 4 }}>
                  <StoreList />
                </Container>
              </ProtectedRoute>
            } />
            
            <Route path="/users" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Container maxWidth="xl" sx={{ py: 4 }}>
                  <UserList />
                </Container>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/add-user" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Container maxWidth="xl" sx={{ py: 4 }}>
                  <AddUser />
                </Container>
              </ProtectedRoute>
            } />
            
            <Route path="/admin/add-store" element={
              <ProtectedRoute allowedRoles={['ADMIN']}>
                <Container maxWidth="xl" sx={{ py: 4 }}>
                  <AddStore />
                </Container>
              </ProtectedRoute>
            } />
            
            <Route path="/update-password" element={
              <ProtectedRoute>
                <Container maxWidth="md" sx={{ py: 4 }}>
                  <UpdatePassword />
                </Container>
              </ProtectedRoute>
            } />
            
            <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  )
}

export default App
