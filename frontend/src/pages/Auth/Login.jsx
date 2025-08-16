import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  InputAdornment
} from '@mui/material'
import { 
  Visibility, 
  VisibilityOff, 
  Person, 
  Business, 
  AdminPanelSettings,
  ContentCopy
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext.jsx'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  
  const { login } = useAuth()
  const navigate = useNavigate()

  const testCredentials = [
    {
      role: 'Admin',
      email: 'admin@storerating.com',
      password: 'Admin@1234',
      icon: <AdminPanelSettings sx={{ fontSize: 40, color: '#e91e63' }} />,
      color: '#e91e63',
      description: 'Full system access'
    },
    {
      role: 'Store Owner',
      email: 'owner@storerating.com',
      password: 'Admin@1234',
      icon: <Business sx={{ fontSize: 40, color: '#2196f3' }} />,
      color: '#2196f3',
      description: 'Manage your stores'
    },
    {
      role: 'User',
      email: 'user@storerating.com',
      password: 'Admin@1234',
      icon: <Person sx={{ fontSize: 40, color: '#4caf50' }} />,
      color: '#4caf50',
      description: 'Browse and rate stores'
    }
  ]

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const result = await login(formData.email, formData.password)
    
    if (result.success) {
      navigate('/dashboard')
    } else {
      setError(result.error)
    }
    
    setLoading(false)
  }

  const handleCredentialClick = (email, password) => {
    setFormData({ email, password })
  }

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        py: 4
      }}
    >
      <Container maxWidth="xl">
        <Grid container spacing={4} alignItems="center" sx={{ minHeight: '100vh' }}>
          {/* Login Form */}
          <Grid item xs={12} lg={6}>
            <Paper 
              elevation={10} 
              sx={{ 
                p: { xs: 3, sm: 4 }, 
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                mx: { xs: 2, sm: 0 }
              }}
            >
              <Box textAlign="center" mb={3}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1,
                    fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                  }}
                >
                  Store Rating System
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
                  Welcome Back! Please sign in to continue
                </Typography>
              </Box>
              
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    borderRadius: 2,
                    '& .MuiAlert-icon': {
                      fontSize: '1.5rem'
                    }
                  }}
                >
                  {error}
                </Alert>
              )}
              
              <Box component="form" onSubmit={handleSubmit}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  autoFocus
                  value={formData.email}
                  onChange={handleChange}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#2196f3',
                      },
                    },
                  }}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  autoComplete="current-password"
                  value={formData.password}
                  onChange={handleChange}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => setShowPassword(!showPassword)}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      '&:hover fieldset': {
                        borderColor: '#2196f3',
                      },
                    },
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ 
                    mt: 3, 
                    mb: 2,
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #1BA5D1 90%)',
                      transform: 'translateY(-2px)',
                      boxShadow: '0 8px 25px rgba(33, 150, 243, 0.3)'
                    },
                    transition: 'all 0.3s ease'
                  }}
                >
                  {loading ? 'Signing In...' : 'Sign In'}
                </Button>
                
                <Box textAlign="center">
                  <Link to="/register" style={{ textDecoration: 'none' }}>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: '#2196f3',
                        fontWeight: 'medium',
                        '&:hover': {
                          color: '#1976d2'
                        }
                      }}
                    >
                      Don't have an account? Sign Up
                    </Typography>
                  </Link>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Test Credentials */}
          <Grid item xs={12} lg={6}>
            <Paper 
              elevation={10}
              sx={{ 
                p: { xs: 2, sm: 3 },
                borderRadius: 3,
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)',
                mx: { xs: 2, sm: 0 },
                mt: { xs: 3, lg: 0 }
              }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 'bold',
                  mb: 3,
                  textAlign: 'center',
                  color: '#333'
                }}
              >
                🔑 Test Credentials
              </Typography>
              
              {testCredentials.map((cred, index) => (
                <Card 
                  key={index}
                  sx={{ 
                    mb: 2,
                    borderRadius: 2,
                    border: `2px solid ${cred.color}`,
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: { xs: 'none', sm: 'translateY(-3px)' },
                      boxShadow: `0 8px 25px ${cred.color}40`
                    }
                  }}
                  onClick={() => handleCredentialClick(cred.email, cred.password)}
                >
                  <CardContent sx={{ p: { xs: 1.5, sm: 2 } }}>
                    <Box display="flex" alignItems="center" mb={1}>
                      {cred.icon}
                      <Box ml={2} flexGrow={1}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: cred.color }}>
                          {cred.role}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {cred.description}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ my: 1 }} />
                    <Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between" mb={0.5}>
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          📧 {cred.email}
                        </Typography>
                        <IconButton 
                          size="small" 
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(cred.email)
                          }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Box>
                      <Box display="flex" alignItems="center" justifyContent="space-between">
                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                          🔒 {cred.password}
                        </Typography>
                        <IconButton 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation()
                            copyToClipboard(cred.password)
                          }}
                        >
                          <ContentCopy fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
              
              <Alert 
                severity="info" 
                sx={{ 
                  mt: 2,
                  borderRadius: 2,
                  background: 'linear-gradient(45deg, #e3f2fd 30%, #bbdefb 90%)'
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                  💡 Click on any credential card to auto-fill the login form
                </Typography>
              </Alert>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Login
