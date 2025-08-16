import React, { useState } from 'react'
import { 
  Box, 
  Card, 
  CardContent, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Alert, 
  MenuItem,
  Avatar,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  IconButton,
  Divider,
  Paper
} from '@mui/material'
import {
  PersonAdd,
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Home,
  AdminPanelSettings,
  Business,
  ArrowBack,
  Save
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'

const AddUser = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER'
  })
  const [validationErrors, setValidationErrors] = useState({})

  const roles = [
    { value: 'USER', label: 'Normal User', icon: <Person />, color: '#4caf50', description: 'Can browse and rate stores' },
    { value: 'OWNER', label: 'Store Owner', icon: <Business />, color: '#2196f3', description: 'Can manage assigned stores' },
    { value: 'ADMIN', label: 'Administrator', icon: <AdminPanelSettings />, color: '#e91e63', description: 'Full system access' }
  ]

  const validateForm = () => {
    const errors = {}

    // Name validation: Min 20 characters, Max 60 characters
    if (!formData.name) {
      errors.name = 'Name is required'
    } else if (formData.name.length < 20) {
      errors.name = 'Name must be at least 20 characters'
    } else if (formData.name.length > 60) {
      errors.name = 'Name must not exceed 60 characters'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Password validation: 8-16 characters, at least one uppercase letter and one special character
    if (!formData.password) {
      errors.password = 'Password is required'
    } else if (formData.password.length < 8 || formData.password.length > 16) {
      errors.password = 'Password must be 8-16 characters'
    } else if (!/[A-Z]/.test(formData.password)) {
      errors.password = 'Password must include at least one uppercase letter'
    } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password)) {
      errors.password = 'Password must include at least one special character'
    }

    // Address validation: Max 400 characters
    if (!formData.address) {
      errors.address = 'Address is required'
    } else if (formData.address.length > 400) {
      errors.address = 'Address must not exceed 400 characters'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError('')
    setSuccess('')

    try {
      await api.post('/auth/register', formData)
      setSuccess('User created successfully!')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'USER'
      })
      
      // Navigate back after delay
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Error creating user:', error)
      setError(error.response?.data?.message || 'Failed to create user')
    } finally {
      setLoading(false)
    }
  }

  const selectedRole = roles.find(role => role.value === formData.role)

  return (
    <Box>
      <Box mb={4}>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate('/dashboard')}
          sx={{ mb: 2 }}
        >
          Back to Dashboard
        </Button>
        
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ 
            backgroundColor: '#e91e63', 
            mr: 2,
            width: 50,
            height: 50
          }}>
            <PersonAdd sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #e91e63 30%, #f06292 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Add New User
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Create a new user account with specified role and permissions
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card>
            <CardContent sx={{ p: 4 }}>
              {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                  {error}
                </Alert>
              )}
              
              {success && (
                <Alert severity="success" sx={{ mb: 3 }}>
                  {success}
                </Alert>
              )}

              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Full Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={!!validationErrors.name}
                      helperText={validationErrors.name || `${formData.name.length}/60 characters (minimum 20 required)`}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color={validationErrors.name ? 'error' : 'primary'} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Email Address"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!validationErrors.email}
                      helperText={validationErrors.email || 'Enter a valid email address'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color={validationErrors.email ? 'error' : 'primary'} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      error={!!validationErrors.password}
                      helperText={validationErrors.password || '8-16 characters with uppercase and special character'}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color={validationErrors.password ? 'error' : 'primary'} />
                          </InputAdornment>
                        ),
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
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Address"
                      name="address"
                      multiline
                      rows={3}
                      value={formData.address}
                      onChange={handleChange}
                      error={!!validationErrors.address}
                      helperText={validationErrors.address || `${formData.address.length}/400 characters`}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1 }}>
                            <Home color={validationErrors.address ? 'error' : 'primary'} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                        },
                      }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>User Role</InputLabel>
                      <Select
                        name="role"
                        value={formData.role}
                        onChange={handleChange}
                        label="User Role"
                        sx={{
                          borderRadius: 2,
                        }}
                      >
                        {roles.map((role) => (
                          <MenuItem key={role.value} value={role.value}>
                            <Box display="flex" alignItems="center">
                              <Avatar sx={{ 
                                width: 24, 
                                height: 24, 
                                mr: 2, 
                                backgroundColor: role.color + '20',
                                color: role.color 
                              }}>
                                {role.icon}
                              </Avatar>
                              {role.label}
                            </Box>
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <Box display="flex" gap={2} justifyContent="flex-end">
                      <Button
                        variant="outlined"
                        onClick={() => navigate('/dashboard')}
                        sx={{ borderRadius: 2, px: 4 }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={loading}
                        startIcon={<Save />}
                        sx={{
                          borderRadius: 2,
                          px: 4,
                          background: 'linear-gradient(45deg, #e91e63 30%, #f06292 90%)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #c2185b 30%, #e91e63 90%)',
                          }
                        }}
                      >
                        {loading ? 'Creating User...' : 'Create User'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Selected Role
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              {selectedRole && (
                <Box textAlign="center">
                  <Avatar sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 2,
                    backgroundColor: selectedRole.color + '20',
                    color: selectedRole.color 
                  }}>
                    {React.cloneElement(selectedRole.icon, { sx: { fontSize: 40 } })}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 'bold', color: selectedRole.color }}>
                    {selectedRole.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {selectedRole.description}
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>

          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Form Validation Rules
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Name:</Typography>
                <Typography variant="body2" color="text.secondary">
                  • Minimum 20 characters<br/>
                  • Maximum 60 characters
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Password:</Typography>
                <Typography variant="body2" color="text.secondary">
                  • 8-16 characters<br/>
                  • At least one uppercase letter<br/>
                  • At least one special character
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Address:</Typography>
                <Typography variant="body2" color="text.secondary">
                  • Maximum 400 characters
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Email:</Typography>
                <Typography variant="body2" color="text.secondary">
                  • Must be valid email format
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AddUser
