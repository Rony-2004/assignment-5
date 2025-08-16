import React, { useState, useEffect } from 'react'
import {
  Typography,
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
  Grid,
  Chip,
  LinearProgress,
  Avatar,
  Divider,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material'
import {
  Star as StarIcon,
  Store as StoreIcon,
  TrendingUp,
  People,
  Assessment
} from '@mui/icons-material'
import api from '../../services/api.js'

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null)
  const [loading, setLoading] = useState(true)
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/owner')
      setDashboardData(response.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStarColor = (rating) => {
    if (rating >= 4.5) return '#4caf50'
    if (rating >= 3.5) return '#ff9800'
    if (rating >= 2.5) return '#ff5722'
    return '#f44336'
  }

  const StatCard = ({ icon, title, value, color, progress }) => (
    <Card 
      sx={{ 
        background: `linear-gradient(135deg, ${color}15 0%, ${color}05 100%)`,
        border: `1px solid ${color}30`,
        position: 'relative',
        overflow: 'hidden',
        height: { xs: 'auto', md: 140 }
      }}
    >
      <CardContent sx={{ position: 'relative', zIndex: 1, p: { xs: 2, md: 3 } }}>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Box flex={1}>
            <Typography 
              variant={isMobile ? "body1" : "h6"} 
              sx={{ fontWeight: 'bold', color }} 
              gutterBottom
            >
              {title}
            </Typography>
            <Typography 
              variant={isMobile ? "h5" : "h3"} 
              sx={{ fontWeight: 'bold', color: 'text.primary' }}
            >
              {value}
            </Typography>
            {progress && (
              <Box mt={1}>
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
          </Box>
          <Avatar sx={{ 
            backgroundColor: alpha(color, 0.15), 
            color,
            ml: 2,
            width: { xs: 48, md: 60 },
            height: { xs: 48, md: 60 }
          }}>
            {icon}
          </Avatar>
        </Box>
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
              borderTop: '4px solid #2196f3',
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
            Loading your dashboard...
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

  const { stores, summary } = dashboardData

  return (
    <Box>
      <Box mb={4}>
        <Typography 
          variant={isMobile ? "h4" : "h3"} 
          sx={{ 
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 1
          }}
        >
          Store Owner Dashboard
        </Typography>
        <Typography variant={isMobile ? "body1" : "h6"} color="text.secondary">
          Monitor your stores' performance and customer feedback
        </Typography>
      </Box>

      <Grid container spacing={{ xs: 2, md: 3 }} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            icon={<StoreIcon sx={{ fontSize: { xs: 24, md: 30 } }} />}
            title="Your Stores"
            value={summary.totalStores}
            color="#2196f3"
            progress={Math.min((summary.totalStores / 10) * 100, 100)}
          />
        </Grid>

        <Grid item xs={12} sm={6} lg={4}>
          <StatCard
            icon={<People sx={{ fontSize: { xs: 24, md: 30 } }} />}
            title="Total Ratings"
            value={summary.totalRatings}
            color="#4caf50"
            progress={Math.min((summary.totalRatings / 100) * 100, 100)}
          />
        </Grid>

        <Grid item xs={12} sm={12} lg={4}>
          <StatCard
            icon={<Assessment sx={{ fontSize: { xs: 24, md: 30 } }} />}
            title="Overall Average"
            value={summary.overallAverageRating || 'N/A'}
            color={getStarColor(summary.overallAverageRating)}
            progress={summary.overallAverageRating ? (summary.overallAverageRating / 5) * 100 : 0}
          />
        </Grid>
      </Grid>

      {stores.map((storeData, index) => (
        <Card 
          key={storeData.store.id} 
          sx={{ 
            mb: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e0e7ff',
            transition: 'all 0.3s ease',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }
          }}
        >
          <CardContent sx={{ p: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
              <Box flex={1}>
                <Box display="flex" alignItems="center" mb={1}>
                  <Avatar 
                    sx={{ 
                      backgroundColor: '#2196f3', 
                      mr: 2,
                      width: 50,
                      height: 50
                    }}
                  >
                    <StoreIcon sx={{ fontSize: 28 }} />
                  </Avatar>
                  <Box>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        fontWeight: 'bold',
                        color: '#1a1a1a'
                      }}
                    >
                      {storeData.store.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      📍 {storeData.store.address}
                    </Typography>
                  </Box>
                </Box>
              </Box>
              
              <Box display="flex" gap={2}>
                <Chip 
                  icon={<StarIcon sx={{ color: getStarColor(storeData.averageRating) }} />} 
                  label={`${storeData.averageRating} / 5`}
                  sx={{
                    backgroundColor: alpha(getStarColor(storeData.averageRating), 0.15),
                    color: getStarColor(storeData.averageRating),
                    fontWeight: 'bold',
                    fontSize: '0.9rem'
                  }}
                />
                <Chip 
                  icon={<People />}
                  label={`${storeData.totalRatings} ratings`}
                  sx={{
                    backgroundColor: alpha('#4caf50', 0.15),
                    color: '#4caf50',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </Box>

            {storeData.recentRatings.length > 0 && (
              <Box>
                <Divider sx={{ my: 2 }} />
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 'bold',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <TrendingUp sx={{ mr: 1, color: '#2196f3' }} />
                  Recent Ratings
                </Typography>
                <TableContainer 
                  component={Paper} 
                  variant="outlined"
                  sx={{ 
                    borderRadius: 2,
                    overflow: 'hidden',
                    boxShadow: 'none',
                    border: '1px solid #e0e7ff'
                  }}
                >
                  <Table>
                    <TableHead>
                      <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                        <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>User</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Rating</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', color: '#374151' }}>Date</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {storeData.recentRatings.slice(0, 5).map((rating, ratingIndex) => (
                        <TableRow 
                          key={rating.id}
                          sx={{ 
                            '&:hover': { 
                              backgroundColor: '#f8fafc' 
                            },
                            borderBottom: ratingIndex === storeData.recentRatings.slice(0, 5).length - 1 ? 'none' : undefined
                          }}
                        >
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Avatar 
                                sx={{ 
                                  width: 32, 
                                  height: 32, 
                                  mr: 2,
                                  backgroundColor: '#4caf50',
                                  fontSize: '0.875rem'
                                }}
                              >
                                {rating.user.name.charAt(0)}
                              </Avatar>
                              <Typography fontWeight="medium">
                                {rating.user.name}
                              </Typography>
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Box display="flex" alignItems="center">
                              <Typography 
                                sx={{ 
                                  fontWeight: 'bold',
                                  color: getStarColor(rating.value),
                                  fontSize: '1.1rem'
                                }}
                              >
                                {rating.value}
                              </Typography>
                              <StarIcon 
                                sx={{ 
                                  ml: 0.5, 
                                  color: getStarColor(rating.value),
                                  fontSize: 20
                                }} 
                              />
                            </Box>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(rating.createdAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            )}
          </CardContent>
        </Card>
      ))}

      {stores.length === 0 && (
        <Card sx={{ textAlign: 'center', py: 6 }}>
          <CardContent>
            <StoreIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No Stores Available
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Contact an administrator to get stores assigned to your account.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  )
}

export default OwnerDashboard
