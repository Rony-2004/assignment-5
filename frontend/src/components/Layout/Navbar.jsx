import React, { useState } from 'react'
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Chip,
  useTheme,
  alpha,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Divider
} from '@mui/material'
import { 
  Dashboard,
  Store,
  People,
  Lock,
  Logout,
  ExpandMore,
  AdminPanelSettings,
  Business,
  Person,
  Menu as MenuIcon,
  Close
} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext.jsx'

const Navbar = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const [anchorEl, setAnchorEl] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
    setMobileMenuOpen(false)
  }

  const handleNavigation = (path) => {
    navigate(path)
    setAnchorEl(null)
    setMobileMenuOpen(false)
  }

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const getRoleIcon = () => {
    switch (user?.role) {
      case 'ADMIN':
        return <AdminPanelSettings sx={{ color: '#e91e63' }} />
      case 'OWNER':
        return <Business sx={{ color: '#2196f3' }} />
      case 'USER':
        return <Person sx={{ color: '#4caf50' }} />
      default:
        return <Person />
    }
  }

  const getRoleColor = () => {
    switch (user?.role) {
      case 'ADMIN':
        return '#e91e63'
      case 'OWNER':
        return '#2196f3'
      case 'USER':
        return '#4caf50'
      default:
        return theme.palette.primary.main
    }
  }

  const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: <Dashboard /> },
    { label: 'Stores', path: '/stores', icon: <Store /> },
    ...(user?.role === 'ADMIN' ? [{ label: 'Users', path: '/users', icon: <People /> }] : [])
  ]

  return (
    <>
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(10px)',
          borderBottom: `1px solid ${alpha('#ffffff', 0.2)}`
        }}
      >
        <Toolbar sx={{ py: 1 }}>
          <Box display="flex" alignItems="center" sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 2,
                background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mr: 2,
                boxShadow: '0 4px 16px rgba(0,0,0,0.2)'
              }}
            >
              <Store sx={{ color: 'white', fontSize: 24 }} />
            </Box>
            <Typography 
              variant={isMobile ? "h6" : "h5"} 
              component="div" 
              sx={{ 
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #ffffff 30%, #f0f0f0 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: { xs: 'none', sm: 'block' }
              }}
            >
              Store Rating System
            </Typography>
          </Box>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* User Info */}
              <Box 
                sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  background: alpha('#ffffff', 0.1),
                  borderRadius: 2,
                  px: 2,
                  py: 0.5,
                  mr: 2
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 32, 
                    height: 32,
                    bgcolor: getRoleColor(),
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}
                >
                  {user?.name?.charAt(0)?.toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 'medium' }}>
                    {user?.name}
                  </Typography>
                  <Chip
                    icon={getRoleIcon()}
                    label={user?.role}
                    size="small"
                    sx={{
                      backgroundColor: alpha(getRoleColor(), 0.2),
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.75rem',
                      height: 20
                    }}
                  />
                </Box>
              </Box>
              
              {/* Navigation Buttons */}
              {navItems.map((item) => (
                <Button 
                  key={item.path}
                  color="inherit" 
                  startIcon={item.icon}
                  onClick={() => handleNavigation(item.path)}
                  sx={{ 
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 'medium',
                    '&:hover': {
                      backgroundColor: alpha('#ffffff', 0.1)
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
              
              {/* Profile Menu */}
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                sx={{
                  borderRadius: 2,
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.1)
                  }
                }}
              >
                <ExpandMore />
              </IconButton>
            </Box>
          )}

          {/* Mobile Navigation */}
          {isMobile && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Avatar 
                sx={{ 
                  width: 32, 
                  height: 32,
                  bgcolor: getRoleColor(),
                  fontSize: '0.875rem',
                  fontWeight: 'bold'
                }}
              >
                {user?.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <IconButton
                color="inherit"
                onClick={toggleMobileMenu}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha('#ffffff', 0.1)
                  }
                }}
              >
                {mobileMenuOpen ? <Close /> : <MenuIcon />}
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Desktop Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        PaperProps={{
          sx: {
            mt: 1,
            borderRadius: 2,
            minWidth: 200,
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)'
          }
        }}
      >
        <MenuItem 
          onClick={() => handleNavigation('/update-password')}
          sx={{ py: 1.5 }}
        >
          <Lock sx={{ mr: 2, fontSize: 20 }} />
          Update Password
        </MenuItem>
        <MenuItem 
          onClick={handleLogout}
          sx={{ 
            py: 1.5,
            color: 'error.main',
            '&:hover': {
              backgroundColor: alpha(theme.palette.error.main, 0.1)
            }
          }}
        >
          <Logout sx={{ mr: 2, fontSize: 20 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            width: 280,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48,
                bgcolor: getRoleColor(),
                fontSize: '1.25rem',
                fontWeight: 'bold',
                mr: 2
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {user?.name}
              </Typography>
              <Chip
                icon={getRoleIcon()}
                label={user?.role}
                size="small"
                sx={{
                  backgroundColor: alpha(getRoleColor(), 0.2),
                  color: 'white',
                  fontWeight: 'bold'
                }}
              />
            </Box>
          </Box>
          <Divider sx={{ borderColor: alpha('#ffffff', 0.2), mb: 2 }} />
        </Box>

        <List>
          {navItems.map((item) => (
            <ListItem 
              key={item.path}
              button 
              onClick={() => handleNavigation(item.path)}
              sx={{
                '&:hover': {
                  backgroundColor: alpha('#ffffff', 0.1)
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
          <Divider sx={{ borderColor: alpha('#ffffff', 0.2), my: 1 }} />
          <ListItem 
            button 
            onClick={() => handleNavigation('/update-password')}
            sx={{
              '&:hover': {
                backgroundColor: alpha('#ffffff', 0.1)
              }
            }}
          >
            <ListItemIcon sx={{ color: 'white' }}>
              <Lock />
            </ListItemIcon>
            <ListItemText primary="Update Password" />
          </ListItem>
          <ListItem 
            button 
            onClick={handleLogout}
            sx={{
              '&:hover': {
                backgroundColor: alpha('#ffffff', 0.1)
              }
            }}
          >
            <ListItemIcon sx={{ color: '#ff6b6b' }}>
              <Logout />
            </ListItemIcon>
            <ListItemText primary="Logout" sx={{ color: '#ff6b6b' }} />
          </ListItem>
        </List>
      </Drawer>
    </>
  )
}

export default Navbar
