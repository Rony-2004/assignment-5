import React, { useState, useEffect } from 'react'
import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Grid,
  TextField,
  Rating,
  Chip,
  TablePagination,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert
} from '@mui/material'
import {
  Search as SearchIcon,
  Store as StoreIcon,
  Star as StarIcon,
  LocationOn as LocationIcon
} from '@mui/icons-material'
import { useAuth } from '../../contexts/AuthContext.jsx'
import api from '../../services/api.js'

const StoreList = () => {
  const { user } = useAuth()
  const [stores, setStores] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalStores, setTotalStores] = useState(0)
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    address: ''
  })
  const [ratingDialog, setRatingDialog] = useState({
    open: false,
    store: null,
    rating: 0
  })
  const [submitting, setSubmitting] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    fetchStores()
  }, [page, rowsPerPage, searchFilters])

  const fetchStores = async () => {
    try {
      setLoading(true)
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...searchFilters
      }

      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key]
        }
      })

      const response = await api.get('/stores', { params })
      setStores(response.data.stores)
      setTotalStores(response.data.pagination.total)
    } catch (error) {
      console.error('Error fetching stores:', error)
      setMessage({ type: 'error', text: 'Failed to load stores' })
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (field) => (event) => {
    setSearchFilters({
      ...searchFilters,
      [field]: event.target.value
    })
    setPage(0)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const openRatingDialog = (store) => {
    setRatingDialog({
      open: true,
      store,
      rating: store.userRating || 0
    })
  }

  const closeRatingDialog = () => {
    setRatingDialog({
      open: false,
      store: null,
      rating: 0
    })
  }

  const submitRating = async () => {
    if (ratingDialog.rating === 0) {
      setMessage({ type: 'error', text: 'Please select a rating' })
      return
    }

    try {
      setSubmitting(true)
      await api.post('/ratings', {
        storeId: ratingDialog.store.id,
        value: ratingDialog.rating
      })

      setMessage({ 
        type: 'success', 
        text: ratingDialog.store.userRating 
          ? 'Rating updated successfully!' 
          : 'Rating submitted successfully!' 
      })
      
      closeRatingDialog()
      fetchStores()
    } catch (error) {
      console.error('Error submitting rating:', error)
      setMessage({ type: 'error', text: 'Failed to submit rating' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && stores.length === 0) {
    return <Typography>Loading stores...</Typography>
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        {user?.role === 'ADMIN' ? 'All Stores' : 'Browse Stores'}
      </Typography>

      {message.text && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 2 }}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Search Stores
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search by name"
                value={searchFilters.name}
                onChange={handleSearchChange('name')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Search by address"
                value={searchFilters.address}
                onChange={handleSearchChange('address')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <LocationIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <Grid container spacing={3}>
        {stores.map((store) => (
          <Grid item xs={12} md={6} lg={4} key={store.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                  <StoreIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6" component="div">
                    {store.name}
                  </Typography>
                </Box>

                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  <LocationIcon fontSize="small" sx={{ mr: 0.5, verticalAlign: 'middle' }} />
                  {store.address}
                </Typography>

                <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                  Owner: {store.owner.name}
                </Typography>

                <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>
                    Average Rating:
                  </Typography>
                  {store.averageRating > 0 ? (
                    <Box display="flex" alignItems="center">
                      <Rating value={store.averageRating} readOnly precision={0.1} size="small" />
                      <Typography variant="body2" sx={{ ml: 1 }}>
                        {store.averageRating.toFixed(1)} ({store.totalRatings} reviews)
                      </Typography>
                    </Box>
                  ) : (
                    <Typography variant="body2" color="textSecondary">
                      No ratings yet
                    </Typography>
                  )}
                </Box>

                {user?.role === 'USER' && (
                  <Box>
                    {store.userRating ? (
                      <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mr: 1 }}>
                          Your Rating:
                        </Typography>
                        <Chip 
                          icon={<StarIcon />} 
                          label={`${store.userRating}/5`}
                          color="warning"
                          size="small"
                        />
                      </Box>
                    ) : (
                      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        You haven't rated this store yet
                      </Typography>
                    )}

                    <Button
                      variant="contained"
                      fullWidth
                      onClick={() => openRatingDialog(store)}
                      startIcon={<StarIcon />}
                    >
                      {store.userRating ? 'Update Rating' : 'Rate Store'}
                    </Button>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {stores.length === 0 && !loading && (
        <Card>
          <CardContent>
            <Typography variant="h6" align="center" color="textSecondary">
              No stores found matching your search criteria
            </Typography>
          </CardContent>
        </Card>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <TablePagination
          component="div"
          count={totalStores}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Box>

      <Dialog open={ratingDialog.open} onClose={closeRatingDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          Rate {ratingDialog.store?.name}
        </DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" alignItems="center" sx={{ py: 2 }}>
            <Typography variant="body1" sx={{ mb: 2 }}>
              How would you rate this store?
            </Typography>
            <Rating
              value={ratingDialog.rating}
              onChange={(event, newValue) => {
                setRatingDialog({
                  ...ratingDialog,
                  rating: newValue || 0
                })
              }}
              size="large"
            />
            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
              {ratingDialog.rating > 0 ? `${ratingDialog.rating} star${ratingDialog.rating !== 1 ? 's' : ''}` : 'Select a rating'}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeRatingDialog}>Cancel</Button>
          <Button 
            onClick={submitRating} 
            variant="contained"
            disabled={submitting || ratingDialog.rating === 0}
          >
            {submitting ? 'Submitting...' : (ratingDialog.store?.userRating ? 'Update Rating' : 'Submit Rating')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default StoreList
