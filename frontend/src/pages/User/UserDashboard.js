import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid
} from '@mui/material';
import {
  Store as StoreIcon,
  Star as StarIcon,
  AccountCircle as AccountIcon
} from '@mui/icons-material';

const UserDashboard = () => {
  const navigate = useNavigate();

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        User Dashboard
      </Typography>

      <Typography variant="body1" color="textSecondary" sx={{ mb: 4 }}>
        Welcome to the Store Rating System! Here you can browse stores, submit ratings, and manage your account.
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <StoreIcon color="primary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Browse Stores
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  View all registered stores, search by name or address, and see ratings from other users.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/stores')}
                  fullWidth
                >
                  View Stores
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <StarIcon color="warning" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Rate Stores
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Submit ratings from 1 to 5 stars for stores you've visited. Help other users make informed decisions.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/stores')}
                  fullWidth
                >
                  Rate Stores
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                <AccountIcon color="secondary" sx={{ fontSize: 60, mb: 2 }} />
                <Typography variant="h5" gutterBottom>
                  Update Password
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Keep your account secure by updating your password regularly.
                </Typography>
                <Button 
                  variant="contained" 
                  onClick={() => navigate('/update-password')}
                  fullWidth
                >
                  Update Password
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            How it works
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                1. Browse Stores
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Use the search and filter options to find stores by name, address, or rating.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                2. Submit Ratings
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Rate stores from 1 to 5 stars based on your experience. You can update your rating anytime.
              </Typography>
            </Grid>
            <Grid item xs={12} md={4}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                3. View Results
              </Typography>
              <Typography variant="body2" color="textSecondary">
                See average ratings and your personal ratings for each store to track your preferences.
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
};

export default UserDashboard;
