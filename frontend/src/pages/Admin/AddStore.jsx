import React, { useState, useEffect } from 'react'
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
  FormControl,
  InputLabel,
  Select,
  InputAdornment,
  Divider,
  Chip,
  CircularProgress
} from '@mui/material'
import {
  Storefront,
  Email,
  Store,
  Home,
  Person,
  ArrowBack,
  Save,
  Business
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'

const AddStore = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [loadingOwners, setLoadingOwners] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [owners, setOwners] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  })
  const [validationErrors, setValidationErrors] = useState({})

  useEffect(() => {
    fetchOwners()
  }, [])

  const fetchOwners = async () => {
    try {
      setLoadingOwners(true)
      const response = await api.get('/users?role=OWNER')
      setOwners(response.data.users || [])
    } catch (error) {
      console.error('Error fetching owners:', error)
      setError('Failed to load store owners')
    } finally {
      setLoadingOwners(false)
    }
  }

  const validateForm = () => {
    const errors = {}

    // Name validation: Min 20 characters, Max 60 characters
    if (!formData.name) {
      errors.name = 'Store name is required'
    } else if (formData.name.length < 20) {
      errors.name = 'Store name must be at least 20 characters'
    } else if (formData.name.length > 60) {
      errors.name = 'Store name must not exceed 60 characters'
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email) {
      errors.email = 'Email is required'
    } else if (!emailRegex.test(formData.email)) {
      errors.email = 'Please enter a valid email address'
    }

    // Address validation: Max 400 characters
    if (!formData.address) {
      errors.address = 'Address is required'
    } else if (formData.address.length > 400) {
      errors.address = 'Address must not exceed 400 characters'
    }

    // Owner validation
    if (!formData.ownerId) {
      errors.ownerId = 'Please select a store owner'
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
      await api.post('/stores', formData)
      setSuccess('Store created successfully!')
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        address: '',
        ownerId: ''
      })
      
      // Navigate back after delay
      setTimeout(() => {
        navigate('/dashboard')
      }, 2000)
    } catch (error) {
      console.error('Error creating store:', error)
      setError(error.response?.data?.message || 'Failed to create store')
    } finally {
      setLoading(false)
    }
  }

  const selectedOwner = owners.find(owner => owner.id === formData.ownerId)

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
            backgroundColor: '#2196f3', 
            mr: 2,
            width: 50,
            height: 50
          }}>
            <Storefront sx={{ fontSize: 28 }} />
          </Avatar>
          <Box>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #2196f3 30%, #64b5f6 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Add New Store
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Register a new store and assign it to a store owner
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
                      label="Store Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      error={!!validationErrors.name}
                      helperText={validationErrors.name || `${formData.name.length}/60 characters (minimum 20 required)`}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Store color={validationErrors.name ? 'error' : 'primary'} />
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
                      label="Store Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!validationErrors.email}
                      helperText={validationErrors.email || 'Enter store contact email address'}
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
                      label="Store Address"
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
                    <FormControl 
                      fullWidth 
                      error={!!validationErrors.ownerId}
                      disabled={loadingOwners}
                    >
                      <InputLabel>Store Owner</InputLabel>
                      <Select
                        name="ownerId"
                        value={formData.ownerId}
                        onChange={handleChange}
                        label="Store Owner"
                        sx={{
                          borderRadius: 2,
                        }}
                      >
                        {loadingOwners ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} sx={{ mr: 2 }} />
                            Loading owners...
                          </MenuItem>
                        ) : owners.length === 0 ? (
                          <MenuItem disabled>
                            No store owners available
                          </MenuItem>
                        ) : (
                          owners.map((owner) => (
                            <MenuItem key={owner.id} value={owner.id}>
                              <Box display="flex" alignItems="center" width="100%">
                                <Avatar sx={{ 
                                  width: 32, 
                                  height: 32, 
                                  mr: 2, 
                                  backgroundColor: '#2196f3',
                                  fontSize: '0.875rem'
                                }}>
                                  {owner.name.charAt(0)}
                                </Avatar>
                                <Box flexGrow={1}>
                                  <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                                    {owner.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {owner.email}
                                  </Typography>
                                </Box>
                                <Chip
                                  label="OWNER"
                                  size="small"
                                  sx={{
                                    backgroundColor: '#2196f320',
                                    color: '#2196f3',
                                    fontWeight: 'bold'
                                  }}
                                />
                              </Box>
                            </MenuItem>
                          ))
                        )}
                      </Select>
                      {validationErrors.ownerId && (
                        <Typography variant="caption" color="error" sx={{ mt: 1, ml: 2 }}>
                          {validationErrors.ownerId}
                        </Typography>
                      )}
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
                          background: 'linear-gradient(45deg, #2196f3 30%, #64b5f6 90%)',
                          '&:hover': {
                            background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
                          }
                        }}
                      >
                        {loading ? 'Creating Store...' : 'Create Store'}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          {selectedOwner && (
            <Card sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                  Selected Owner
                </Typography>
                <Divider sx={{ mb: 2 }} />
                
                <Box textAlign="center">
                  <Avatar sx={{ 
                    width: 80, 
                    height: 80, 
                    mx: 'auto', 
                    mb: 2,
                    backgroundColor: '#2196f3',
                    fontSize: '2rem'
                  }}>
                    {selectedOwner.name.charAt(0)}
                  </Avatar>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {selectedOwner.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {selectedOwner.email}
                  </Typography>
                  <Chip
                    icon={<Business />}
                    label="Store Owner"
                    sx={{
                      backgroundColor: '#2196f320',
                      color: '#2196f3',
                      fontWeight: 'bold'
                    }}
                  />
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    📍 {selectedOwner.address}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold' }}>
                Form Validation Rules
              </Typography>
              <Divider sx={{ mb: 2 }} />
              
              <Box mb={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Store Name:</Typography>
                <Typography variant="body2" color="text.secondary">
                  • Minimum 20 characters<br/>
                  • Maximum 60 characters
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Email:</Typography>
                <Typography variant="body2" color="text.secondary">
                  • Must be valid email format<br/>
                  • Store contact email
                </Typography>
              </Box>
              
              <Box mb={2}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Address:</Typography>
                <Typography variant="body2" color="text.secondary">
                  • Maximum 400 characters<br/>
                  • Full store address
                </Typography>
              </Box>
              
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>Owner:</Typography>
                <Typography variant="body2" color="text.secondary">
                  • Must select an existing owner<br/>
                  • Only users with OWNER role
                </Typography>
              </Box>
            </CardContent>
          </Card>

          {owners.length === 0 && !loadingOwners && (
            <Card sx={{ mt: 2 }}>
              <CardContent>
                <Alert severity="warning">
                  <Typography variant="body2">
                    No store owners available. Create users with OWNER role first.
                  </Typography>
                  <Button
                    size="small"
                    onClick={() => navigate('/admin/add-user')}
                    sx={{ mt: 1 }}
                  >
                    Add Store Owner
                  </Button>
                </Alert>
              </CardContent>
            </Card>
          )}
        </Grid>
      </Grid>
    </Box>
  )
}

export default AddStore
