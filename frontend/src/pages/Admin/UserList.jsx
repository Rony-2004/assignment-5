import React, { useState, useEffect } from 'react'
import {
  Typography,
  Card,
  CardContent,
  Button,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Grid,
  InputAdornment,
  Chip,
  Alert,
  Avatar,
  TableSortLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  useMediaQuery,
  alpha
} from '@mui/material'
import {
  Search as SearchIcon,
  Add as AddIcon,
  People,
  Visibility,
  Edit,
  Delete,
  FilterList,
  PersonAdd,
  Business,
  AdminPanelSettings,
  Person,
  Star
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import api from '../../services/api.js'

const UserList = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [totalUsers, setTotalUsers] = useState(0)
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  })
  const [orderBy, setOrderBy] = useState('name')
  const [order, setOrder] = useState('asc')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [selectedUser, setSelectedUser] = useState(null)
  const [viewUserDialog, setViewUserDialog] = useState(false)
  
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))

  const roles = [
    { value: '', label: 'All Roles' },
    { value: 'USER', label: 'Normal User', icon: <Person />, color: '#4caf50' },
    { value: 'OWNER', label: 'Store Owner', icon: <Business />, color: '#2196f3' },
    { value: 'ADMIN', label: 'Administrator', icon: <AdminPanelSettings />, color: '#e91e63' }
  ]

  useEffect(() => {
    fetchUsers()
  }, [page, rowsPerPage, searchFilters, orderBy, order])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        sortBy: orderBy,
        sortOrder: order,
        ...searchFilters
      }

      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key]
        }
      })

      const response = await api.get('/users', { params })
      setUsers(response.data.users)
      setTotalUsers(response.data.pagination.total)
    } catch (error) {
      console.error('Error fetching users:', error)
      setMessage({ type: 'error', text: 'Failed to load users' })
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

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc'
    setOrder(isAsc ? 'desc' : 'asc')
    setOrderBy(property)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const getRoleInfo = (role) => {
    return roles.find(r => r.value === role) || { color: '#9e9e9e', icon: <Person /> }
  }

  const handleViewUser = (user) => {
    setSelectedUser(user)
    setViewUserDialog(true)
  }

  const clearFilters = () => {
    setSearchFilters({
      name: '',
      email: '',
      address: '',
      role: ''
    })
    setPage(0)
  }

  if (loading && users.length === 0) {
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
            Loading users...
          </Typography>
        </Box>
      </Box>
    )
  }

  return (
    <Box>
      <Box mb={4}>
        <Box 
          display="flex" 
          flexDirection={{ xs: 'column', md: 'row' }}
          justifyContent="space-between"
          alignItems={{ xs: 'flex-start', md: 'center' }}
          gap={2}
          mb={2}
        >
          <Box display="flex" alignItems="center">
            <Avatar sx={{ 
              backgroundColor: '#e91e63', 
              mr: 2,
              width: { xs: 40, md: 50 },
              height: { xs: 40, md: 50 }
            }}>
              <People sx={{ fontSize: { xs: 24, md: 28 } }} />
            </Avatar>
            <Box>
              <Typography 
                variant={isMobile ? "h5" : "h3"} 
                sx={{ 
                  fontWeight: 'bold',
                  background: 'linear-gradient(45deg, #e91e63 30%, #f06292 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}
              >
                User Management
              </Typography>
              <Typography variant={isMobile ? "body2" : "h6"} color="text.secondary">
                View, search, and manage all system users
              </Typography>
            </Box>
          </Box>
          
          <Box 
            display="flex" 
            flexDirection={{ xs: 'column', sm: 'row' }}
            gap={2}
            width={{ xs: '100%', md: 'auto' }}
          >
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/admin/add-user')}
              fullWidth={isMobile}
              sx={{
                background: 'linear-gradient(45deg, #e91e63 30%, #f06292 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #c2185b 30%, #e91e63 90%)',
                }
              }}
            >
              Add New User
            </Button>
            <Button
              variant="outlined"
              startIcon={<FilterList />}
              onClick={clearFilters}
              fullWidth={isMobile}
            >
              Clear Filters
            </Button>
          </Box>
        </Box>
      </Box>

      {message.text && (
        <Alert 
          severity={message.type} 
          sx={{ mb: 3 }}
          onClose={() => setMessage({ type: '', text: '' })}
        >
          {message.text}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={3}>
            <FilterList sx={{ color: '#2196f3', mr: 1 }} />
            <Typography variant={isMobile ? "body1" : "h6"} sx={{ fontWeight: 'bold' }}>
              Search & Filter Users
            </Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          
          <Grid container spacing={{ xs: 2, md: 3 }}>
            <Grid item xs={12} sm={6} lg={3}>
              <TextField
                fullWidth
                size={isMobile ? "small" : "medium"}
                label="Search by Name"
                value={searchFilters.name}
                onChange={handleSearchChange('name')}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="primary" />
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
            <Grid item xs={12} sm={6} lg={3}>
              <TextField
                fullWidth
                size={isMobile ? "small" : "medium"}
                label="Search by Email"
                value={searchFilters.email}
                onChange={handleSearchChange('email')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <TextField
                fullWidth
                size={isMobile ? "small" : "medium"}
                label="Search by Address"
                value={searchFilters.address}
                onChange={handleSearchChange('address')}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} lg={3}>
              <FormControl fullWidth size={isMobile ? "small" : "medium"}>
                <InputLabel>Filter by Role</InputLabel>
                <Select
                  value={searchFilters.role}
                  onChange={handleSearchChange('role')}
                  label="Filter by Role"
                  sx={{
                    borderRadius: 2,
                  }}
                >
                  {roles.map((role) => (
                    <MenuItem key={role.value} value={role.value}>
                      <Box display="flex" alignItems="center">
                        {role.icon && (
                          <Avatar sx={{ 
                            width: 24, 
                            height: 24, 
                            mr: 2, 
                            backgroundColor: role.color + '20',
                            color: role.color 
                          }}>
                            {role.icon}
                          </Avatar>
                        )}
                        {role.label}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Desktop Table View */}
      {!isMobile && (
        <Card>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow sx={{ backgroundColor: '#f8fafc' }}>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'name'}
                      direction={orderBy === 'name' ? order : 'asc'}
                      onClick={() => handleSort('name')}
                      sx={{ fontWeight: 'bold' }}
                    >
                      User
                    </TableSortLabel>
                  </TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'email'}
                      direction={orderBy === 'email' ? order : 'asc'}
                      onClick={() => handleSort('email')}
                      sx={{ fontWeight: 'bold' }}
                    >
                      Email
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Address</TableCell>
                  <TableCell>
                    <TableSortLabel
                      active={orderBy === 'role'}
                      direction={orderBy === 'role' ? order : 'asc'}
                      onClick={() => handleSort('role')}
                      sx={{ fontWeight: 'bold' }}
                    >
                      Role
                    </TableSortLabel>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Rating</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user, index) => {
                const roleInfo = getRoleInfo(user.role)
                return (
                  <TableRow 
                    key={user.id}
                    sx={{ 
                      '&:hover': { backgroundColor: '#f8fafc' },
                      borderBottom: index === users.length - 1 ? 'none' : undefined
                    }}
                  >
                    <TableCell>
                      <Box display="flex" alignItems="center">
                        <Avatar 
                          sx={{ 
                            width: 40, 
                            height: 40, 
                            mr: 2,
                            backgroundColor: roleInfo.color,
                            fontSize: '1rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {user.name.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                            {user.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            ID: {user.id}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" color="text.secondary">
                        {user.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ 
                          maxWidth: 200,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {user.address}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip 
                        icon={roleInfo.icon}
                        label={user.role}
                        sx={{
                          backgroundColor: alpha(roleInfo.color, 0.15),
                          color: roleInfo.color,
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      {user.role === 'OWNER' ? (
                        user.averageRating ? (
                          <Box display="flex" alignItems="center">
                            <Star sx={{ color: '#ff9800', mr: 0.5, fontSize: 20 }} />
                            <Typography sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                              {user.averageRating} / 5
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No ratings
                          </Typography>
                        )
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          N/A
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton
                          onClick={() => handleViewUser(user)}
                          sx={{ color: '#2196f3' }}
                        >
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>

        {users.length === 0 && !loading && (
          <Box textAlign="center" sx={{ py: 8 }}>
            <People sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              No Users Found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              No users match your current search criteria.
            </Typography>
            <Button
              variant="contained"
              startIcon={<PersonAdd />}
              onClick={() => navigate('/admin/add-user')}
              sx={{
                background: 'linear-gradient(45deg, #e91e63 30%, #f06292 90%)',
              }}
            >
              Add First User
            </Button>
          </Box>
        )}

        <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
          <TablePagination
            component="div"
            count={totalUsers}
            page={page}
            onPageChange={handlePageChange}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            rowsPerPageOptions={[5, 10, 25, 50]}
            sx={{
              '& .MuiTablePagination-toolbar': {
                fontSize: '0.875rem'
              }
            }}
          />
        </Box>
      </Card>
      )}

      {/* Mobile Card View */}
      {isMobile && (
        <Box>
          {users.map((user) => {
            const roleInfo = getRoleInfo(user.role);
            return (
              <Card key={user.id} sx={{ mb: 2, border: `1px solid ${alpha('#e91e63', 0.1)}` }}>
                <CardContent>
                  <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" alignItems="center" flex={1}>
                      <Avatar
                        sx={{
                          bgcolor: roleInfo.color,
                          mr: 2,
                          width: 48,
                          height: 48,
                          fontSize: '1.25rem',
                          fontWeight: 'bold'
                        }}
                      >
                        {user.name.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
                          {user.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {user.email}
                        </Typography>
                        <Chip 
                          icon={roleInfo.icon}
                          label={user.role}
                          size="small"
                          sx={{
                            backgroundColor: alpha(roleInfo.color, 0.15),
                            color: roleInfo.color,
                            fontWeight: 'bold'
                          }}
                        />
                      </Box>
                    </Box>
                    <IconButton
                      onClick={() => handleViewUser(user)}
                      sx={{ color: '#2196f3' }}
                    >
                      <Visibility />
                    </IconButton>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Address
                      </Typography>
                      <Typography variant="body2">
                        {user.address}
                      </Typography>
                    </Grid>
                    {user.role === 'OWNER' && (
                      <Grid item xs={12}>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Rating
                        </Typography>
                        {user.averageRating ? (
                          <Box display="flex" alignItems="center">
                            <Star sx={{ color: '#ff9800', mr: 0.5, fontSize: 18 }} />
                            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ff9800' }}>
                              {user.averageRating} / 5
                            </Typography>
                          </Box>
                        ) : (
                          <Typography variant="body2" color="text.secondary">
                            No ratings
                          </Typography>
                        )}
                      </Grid>
                    )}
                  </Grid>
                </CardContent>
              </Card>
            );
          })}

          {users.length === 0 && !loading && (
            <Card>
              <CardContent>
                <Box textAlign="center" sx={{ py: 4 }}>
                  <People sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    No Users Found
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    No users match your search criteria.
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<PersonAdd />}
                    onClick={() => navigate('/admin/add-user')}
                    fullWidth
                    sx={{
                      background: 'linear-gradient(45deg, #e91e63 30%, #f06292 90%)',
                    }}
                  >
                    Add First User
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <TablePagination
              component="div"
              count={totalUsers}
              page={page}
              onPageChange={handlePageChange}
              rowsPerPage={rowsPerPage}
              onRowsPerPageChange={handleRowsPerPageChange}
              rowsPerPageOptions={[5, 10, 25]}
              sx={{
                '& .MuiTablePagination-toolbar': {
                  fontSize: '0.75rem'
                },
                '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                  fontSize: '0.75rem'
                }
              }}
            />
          </Box>
        </Box>
      )}

      {/* User Details Dialog */}
      <Dialog 
        open={viewUserDialog} 
        onClose={() => setViewUserDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" alignItems="center">
            <Avatar sx={{ 
              width: 40, 
              height: 40, 
              mr: 2,
              backgroundColor: selectedUser ? getRoleInfo(selectedUser.role).color : '#9e9e9e'
            }}>
              {selectedUser?.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6">User Details</Typography>
              <Typography variant="body2" color="text.secondary">
                {selectedUser?.name}
              </Typography>
            </Box>
          </Box>
        </DialogTitle>
        <DialogContent>
          {selectedUser && (
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Name</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedUser.name}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Email</Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>{selectedUser.email}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Role</Typography>
                <Chip 
                  icon={getRoleInfo(selectedUser.role).icon}
                  label={selectedUser.role}
                  sx={{
                    backgroundColor: alpha(getRoleInfo(selectedUser.role).color, 0.15),
                    color: getRoleInfo(selectedUser.role).color,
                    fontWeight: 'bold',
                    mt: 0.5
                  }}
                />
              </Grid>
              {selectedUser.role === 'OWNER' && (
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary">Average Rating</Typography>
                  <Typography variant="body1" sx={{ mb: 2 }}>
                    {selectedUser.averageRating ? `${selectedUser.averageRating} / 5` : 'No ratings yet'}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12}>
                <Typography variant="subtitle2" color="text.secondary">Address</Typography>
                <Typography variant="body1">{selectedUser.address}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">Created At</Typography>
                <Typography variant="body1">
                  {new Date(selectedUser.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary">User ID</Typography>
                <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
                  {selectedUser.id}
                </Typography>
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewUserDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UserList
