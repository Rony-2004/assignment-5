import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon
} from '@mui/icons-material';
import api from '../../services/api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchFilters, setSearchFilters] = useState({
    name: '',
    email: '',
    address: '',
    role: ''
  });
  const [userDialog, setUserDialog] = useState({
    open: false,
    user: null,
    isEdit: false
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER'
  });
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchUsers();
  }, [page, rowsPerPage, searchFilters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        ...searchFilters
      };

      Object.keys(params).forEach(key => {
        if (params[key] === '') {
          delete params[key];
        }
      });

      const response = await api.get('/users', { params });
      setUsers(response.data.users);
      setTotalUsers(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching users:', error);
      setMessage({ type: 'error', text: 'Failed to load users' });
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (field) => (event) => {
    setSearchFilters({
      ...searchFilters,
      [field]: event.target.value
    });
    setPage(0);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const openUserDialog = (user = null) => {
    setUserDialog({
      open: true,
      user,
      isEdit: !!user
    });
    
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        password: '',
        address: user.address,
        role: user.role
      });
    } else {
      setFormData({
        name: '',
        email: '',
        password: '',
        address: '',
        role: 'USER'
      });
    }
    setErrors({});
  };

  const closeUserDialog = () => {
    setUserDialog({
      open: false,
      user: null,
      isEdit: false
    });
    setFormData({
      name: '',
      email: '',
      password: '',
      address: '',
      role: 'USER'
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (formData.name.length < 20 || formData.name.length > 60) {
      newErrors.name = 'Name must be between 20 and 60 characters';
    }
    
    if (formData.address.length > 400) {
      newErrors.address = 'Address must not exceed 400 characters';
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!userDialog.isEdit) {
      const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
      if (!passwordRegex.test(formData.password)) {
        newErrors.password = 'Password must be 8-16 characters with at least one uppercase letter and one special character';
      }
    }
    
    return newErrors;
  };

  const handleFormChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const submitUser = async () => {
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      setSubmitting(true);
      
      const userData = { ...formData };
      if (userDialog.isEdit) {
        delete userData.password;
      }

      if (userDialog.isEdit) {
        await api.put(`/users/${userDialog.user.id}`, userData);
        setMessage({ type: 'success', text: 'User updated successfully!' });
      } else {
        await api.post('/users', userData);
        setMessage({ type: 'success', text: 'User created successfully!' });
      }
      
      closeUserDialog();
      fetchUsers();
    } catch (error) {
      console.error('Error submitting user:', error);
      setMessage({ type: 'error', text: error.response?.data?.error || 'Failed to save user' });
    } finally {
      setSubmitting(false);
    }
  };

  const deleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete user "${userName}"?`)) {
      try {
        await api.delete(`/users/${userId}`);
        setMessage({ type: 'success', text: 'User deleted successfully!' });
        fetchUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
        setMessage({ type: 'error', text: 'Failed to delete user' });
      }
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN': return 'error';
      case 'OWNER': return 'warning';
      default: return 'default';
    }
  };

  if (loading && users.length === 0) {
    return <Typography>Loading users...</Typography>;
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">
          User Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => openUserDialog()}
        >
          Add User
        </Button>
      </Box>

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
            Search & Filter Users
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
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
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search by email"
                value={searchFilters.email}
                onChange={handleSearchChange('email')}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search by address"
                value={searchFilters.address}
                onChange={handleSearchChange('address')}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={searchFilters.role}
                  label="Role"
                  onChange={handleSearchChange('role')}
                >
                  <MenuItem value="">All Roles</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="OWNER">Store Owner</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Address</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Average Rating</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.address}</TableCell>
                <TableCell>
                  <Chip 
                    label={user.role} 
                    color={getRoleColor(user.role)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {user.role === 'OWNER' && user.averageRating 
                    ? `${user.averageRating} / 5` 
                    : user.role === 'OWNER' 
                      ? 'No ratings' 
                      : 'N/A'
                  }
                </TableCell>
                <TableCell>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => openUserDialog(user)}
                    sx={{ mr: 1 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => deleteUser(user.id, user.name)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {users.length === 0 && !loading && (
        <Box textAlign="center" sx={{ mt: 4 }}>
          <Typography variant="h6" color="textSecondary">
            No users found matching your search criteria
          </Typography>
        </Box>
      )}

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <TablePagination
          component="div"
          count={totalUsers}
          page={page}
          onPageChange={handlePageChange}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleRowsPerPageChange}
          rowsPerPageOptions={[5, 10, 25, 50]}
        />
      </Box>

      <Dialog open={userDialog.open} onClose={closeUserDialog} maxWidth="md" fullWidth>
        <DialogTitle>
          {userDialog.isEdit ? 'Edit User' : 'Add New User'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Full Name (20-60 characters)"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                error={!!errors.name}
                helperText={errors.name}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleFormChange}
                error={!!errors.email}
                helperText={errors.email}
                required
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth required>
                <InputLabel>Role</InputLabel>
                <Select
                  name="role"
                  value={formData.role}
                  label="Role"
                  onChange={handleFormChange}
                >
                  <MenuItem value="USER">User</MenuItem>
                  <MenuItem value="OWNER">Store Owner</MenuItem>
                  <MenuItem value="ADMIN">Admin</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {!userDialog.isEdit && (
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Password (8-16 chars, 1 uppercase, 1 special)"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleFormChange}
                  error={!!errors.password}
                  helperText={errors.password}
                  required
                />
              </Grid>
            )}
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Address (max 400 characters)"
                name="address"
                multiline
                rows={3}
                value={formData.address}
                onChange={handleFormChange}
                error={!!errors.address}
                helperText={errors.address}
                required
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeUserDialog}>Cancel</Button>
          <Button 
            onClick={submitUser} 
            variant="contained"
            disabled={submitting}
          >
            {submitting ? 'Saving...' : (userDialog.isEdit ? 'Update User' : 'Create User')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserList;
