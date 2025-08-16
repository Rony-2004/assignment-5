import React, { useState, useEffect } from 'react';
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
  Chip
} from '@mui/material';
import {
  Star as StarIcon,
  Store as StoreIcon
} from '@mui/icons-material';
import api from '../../services/api';

const OwnerDashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/dashboard/owner');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography>Loading dashboard...</Typography>;
  }

  if (!dashboardData) {
    return <Typography>Error loading dashboard data</Typography>;
  }

  const { stores, summary } = dashboardData;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Store Owner Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <StoreIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Your Stores
                  </Typography>
                  <Typography variant="h4">
                    {summary.totalStores}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <StarIcon color="primary" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Total Ratings
                  </Typography>
                  <Typography variant="h4">
                    {summary.totalRatings}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <StarIcon color="warning" sx={{ mr: 2, fontSize: 40 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    Overall Average
                  </Typography>
                  <Typography variant="h4">
                    {summary.overallAverageRating || 'N/A'}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {stores.map((storeData) => (
        <Card key={storeData.store.id} sx={{ mb: 3 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
              <Typography variant="h5">
                {storeData.store.name}
              </Typography>
              <Box display="flex" alignItems="center" gap={2}>
                <Chip 
                  icon={<StarIcon />} 
                  label={`${storeData.averageRating} / 5`}
                  color="warning"
                  variant="outlined"
                />
                <Chip 
                  label={`${storeData.totalRatings} ratings`}
                  variant="outlined"
                />
              </Box>
            </Box>

            <Typography variant="body2" color="textSecondary" gutterBottom>
              {storeData.store.address}
            </Typography>

            <Grid container spacing={2} sx={{ mt: 2 }}>
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Rating Distribution
                </Typography>
                {Object.entries(storeData.ratingDistribution).map(([rating, count]) => (
                  <Box key={rating} display="flex" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Box display="flex" alignItems="center">
                      <Typography>{rating}</Typography>
                      <StarIcon fontSize="small" color="warning" sx={{ ml: 0.5 }} />
                    </Box>
                    <Typography fontWeight="bold">{count}</Typography>
                  </Box>
                ))}
              </Grid>

              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>
                  Recent Ratings
                </Typography>
                {storeData.recentRatings.length > 0 ? (
                  <TableContainer component={Paper} variant="outlined">
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>User</TableCell>
                          <TableCell>Rating</TableCell>
                          <TableCell>Date</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {storeData.recentRatings.map((rating) => (
                          <TableRow key={rating.id}>
                            <TableCell>{rating.user.name}</TableCell>
                            <TableCell>
                              <Box display="flex" alignItems="center">
                                <Typography>{rating.value}</Typography>
                                <StarIcon fontSize="small" color="warning" sx={{ ml: 0.5 }} />
                              </Box>
                            </TableCell>
                            <TableCell>
                              {new Date(rating.createdAt).toLocaleDateString()}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                ) : (
                  <Typography color="textSecondary">No ratings yet</Typography>
                )}
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      {stores.length === 0 && (
        <Card>
          <CardContent>
            <Typography variant="h6" align="center" color="textSecondary">
              No stores assigned to your account yet. Contact an administrator to get stores assigned.
            </Typography>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default OwnerDashboard;
