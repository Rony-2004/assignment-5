import React, { useState, useEffect } from 'react'
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Button,
  Avatar,
  Divider,
  useTheme,
  alpha,
  LinearProgress
} from '@mui/material'
import {
  People as PeopleIcon,
  Store as StoreIcon,
  Star as StarIcon,
  Add as AddIcon,
  PersonAdd,
  Storefront,
  TrendingUp,
  Assessment,
  Dashboard as DashboardIcon
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const theme = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/admin')
      setDashboardData(response.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const StatCard = ({ icon, title, value, color, progress, action, actionText }) => (
    <Card 
      sx={{ 
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        position: 'relative',
        overflow: 'hidden',
        height: '100%'
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 'bold', color }} gutterBottom>
              {title}
            </Typography>
            <Typography variant="h3" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
              {value}
            </Typography>
          </Box>
          <Avatar sx={{ 
            backgroundColor: alpha(color, 0.15), 
            color,
            width: 60,
            height: 60
          }}>
            {icon}
          </Avatar>
        </Box>
        
        {progress && (
          <Box mb={2}>
            <LinearProgress 
              variant="determinate" 
              value={progress} 
              sx={{ 
                height: 6, 
                borderRadius: 3,
                backgroundColor: alpha(color, 0.2),
                '& .MuiLinearProgress-bar': {
                  backgroundColor: color,
                  borderRadius: 3
                }
              }} 
            />
          </Box>
        )}

        {action && (
          <Box mt="auto">
            <Button
              fullWidth
              variant="contained"
              startIcon={<AddIcon />}
              onClick={action}
              sx={{
                backgroundColor: color,
                '&:hover': {
                  backgroundColor: alpha(color, 0.8),
                  transform: 'translateY(-2px)',
                  boxShadow: `0 8px 25px ${color}40`
                },
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 'bold',
                transition: 'all 0.3s ease'
              }}
            >
              {actionText}
            </Button>
          </Box>
        )}
      </CardContent>
      <Box
        sx={{
          position: 'absolute',
          top: -50,
          right: -50,
          width: 100,
          height: 100,
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
          zIndex: 0
        }}
      />
    </Card>
  )

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Box textAlign="center">
          <Box
            sx={{
              width: 60,
              height: 60,
              border: '4px solid #e0e0e0',
              borderTop: '4px solid #e91e63',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto',
              '@keyframes spin': {
                '0%': { transform: 'rotate(0deg)' },
                '100%': { transform: 'rotate(360deg)' },
              },
            }}
          />
          <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
            Loading admin dashboard...
          </Typography>
        </Box>
      </Box>
    )
  }

  if (!dashboardData) {
    return (
      <Box textAlign="center" py={8}>
        <Typography variant="h5" color="error">
          Error loading dashboard data
        </Typography>
      </Box>
    )
  }

  const { stats, recentUsers, recentStores, topRatedStores } = dashboardData

  return (
    <Box>
      <Box mb={4}>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar sx={{ 
            backgroundColor: '#e91e63', 
            mr: 2,
            width: 50,
            height: 50
          }}>
            <DashboardIcon sx={{ fontSize: 28 }} />
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
              Admin Dashboard
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Manage users, stores, and monitor system activity
            </Typography>
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            icon={<PeopleIcon sx={{ fontSize: 30 }} />}
            title="Total Users"
            value={stats.totalUsers}
            color="#e91e63"
            progress={Math.min((stats.totalUsers / 100) * 100, 100)}
            action={() => navigate('/admin/add-user')}
            actionText="Add User"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            icon={<StoreIcon sx={{ fontSize: 30 }} />}
            title="Total Stores"
            value={stats.totalStores}
            color="#2196f3"
            progress={Math.min((stats.totalStores / 50) * 100, 100)}
            action={() => navigate('/admin/add-store')}
            actionText="Add Store"
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            icon={<StarIcon sx={{ fontSize: 30 }} />}
            title="Total Ratings"
            value={stats.totalRatings}
            color="#4caf50"
            progress={Math.min((stats.totalRatings / 1000) * 100, 100)}
          />
        </Grid>
      </Grid>

      {/* Quick Actions */}
      <Card sx={{ mb: 4, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Typography variant="h5" sx={{ color: 'white', fontWeight: 'bold', mb: 3, fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>
            🚀 Quick Actions
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} lg={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<PersonAdd />}
                onClick={() => navigate('/admin/add-user')}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    transform: { xs: 'none', sm: 'translateY(-2px)' }
                  },
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Add New User
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<Storefront />}
                onClick={() => navigate('/admin/add-store')}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    transform: { xs: 'none', sm: 'translateY(-2px)' }
                  },
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                Add New Store
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<PeopleIcon />}
                onClick={() => navigate('/users')}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    transform: { xs: 'none', sm: 'translateY(-2px)' }
                  },
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                View All Users
              </Button>
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<StoreIcon />}
                onClick={() => navigate('/stores')}
                sx={{
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.3)',
                    transform: { xs: 'none', sm: 'translateY(-2px)' }
                  },
                  py: { xs: 1, sm: 1.5 },
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  fontSize: { xs: '0.875rem', sm: '1rem' }
                }}
              >
                View All Stores
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <TrendingUp sx={{ color: '#2196f3', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Recent Users
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Role</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {recentUsers.map((user, index) => (
                      <TableRow 
                        key={user.id}
                        sx={{ 
                          '&:hover': { backgroundColor: '#f8fafc' },
                          borderBottom: index === recentUsers.length - 1 ? 'none' : undefined
                        }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar 
                              sx={{ 
                                width: 32, 
                                height: 32, 
                                mr: 2,
                                backgroundColor: user.role === 'ADMIN' ? '#e91e63' : user.role === 'OWNER' ? '#2196f3' : '#4caf50',
                                fontSize: '0.875rem'
                              }}
                            >
                              {user.name.charAt(0)}
                            </Avatar>
                            <Typography fontWeight="medium">
                              {user.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {user.email}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label={user.role}
                            size="small"
                            sx={{
                              backgroundColor: user.role === 'ADMIN' ? alpha('#e91e63', 0.15) : user.role === 'OWNER' ? alpha('#2196f3', 0.15) : alpha('#4caf50', 0.15),
                              color: user.role === 'ADMIN' ? '#e91e63' : user.role === 'OWNER' ? '#2196f3' : '#4caf50',
                              fontWeight: 'bold'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <Assessment sx={{ color: '#ff9800', mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Top Rated Stores
                </Typography>
              </Box>
              <Divider sx={{ mb: 2 }} />
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                      <TableCell sx={{ fontWeight: 'bold' }}>Store</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Rating</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>Reviews</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topRatedStores.map((store, index) => (
                      <TableRow 
                        key={store.id}
                        sx={{ 
                          '&:hover': { backgroundColor: '#f8fafc' },
                          borderBottom: index === topRatedStores.length - 1 ? 'none' : undefined
                        }}
                      >
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <Avatar 
                              sx={{ 
                                width: 32, 
                                height: 32, 
                                mr: 2,
                                backgroundColor: '#2196f3',
                                fontSize: '0.875rem'
                              }}
                            >
                              <StoreIcon fontSize="small" />
                            </Avatar>
                            <Typography fontWeight="medium">
                              {store.name}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center">
                            <StarIcon 
                              sx={{ 
                                color: store.averageRating >= 4 ? '#4caf50' : store.averageRating >= 3 ? '#ff9800' : '#f44336',
                                mr: 0.5,
                                fontSize: 20
                              }} 
                            />
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                fontWeight: 'bold',
                                color: store.averageRating >= 4 ? '#4caf50' : store.averageRating >= 3 ? '#ff9800' : '#f44336'
                              }}
                            >
                              {store.averageRating}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={`${store.totalRatings} reviews`}
                            size="small"
                            sx={{
                              backgroundColor: alpha('#4caf50', 0.15),
                              color: '#4caf50',
                              fontWeight: 'bold'
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AdminDashboard
