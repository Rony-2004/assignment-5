import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Container } from '@mui/material';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Layout/Navbar';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import AdminDashboard from './pages/Admin/AdminDashboard';
import UserDashboard from './pages/User/UserDashboard';
import OwnerDashboard from './pages/Owner/OwnerDashboard';
import StoreList from './pages/Stores/StoreList';
import UserList from './pages/Admin/UserList';
import UpdatePassword from './pages/Auth/UpdatePassword';
import ProtectedRoute from './components/Auth/ProtectedRoute';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="App">
      {user && <Navbar />}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {user?.role === 'ADMIN' && <AdminDashboard />}
              {user?.role === 'USER' && <UserDashboard />}
              {user?.role === 'OWNER' && <OwnerDashboard />}
            </ProtectedRoute>
          } />
          
          <Route path="/stores" element={
            <ProtectedRoute>
              <StoreList />
            </ProtectedRoute>
          } />
          
          <Route path="/users" element={
            <ProtectedRoute allowedRoles={['ADMIN']}>
              <UserList />
            </ProtectedRoute>
          } />
          
          <Route path="/update-password" element={
            <ProtectedRoute>
              <UpdatePassword />
            </ProtectedRoute>
          } />
          
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
