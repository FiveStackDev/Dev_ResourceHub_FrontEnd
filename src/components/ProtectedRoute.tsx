import React, { useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

interface ProtectedRouteProps {
  requiredRole: 'Admin' | 'User' | 'SuperAdmin';
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  requiredRole,
  children,
}) => {
  const { userData, refreshUserData, loading } = useUser();
  const location = useLocation();


  // Refresh user data on mount to ensure we have the latest
  useEffect(() => {
    refreshUserData();
    // eslint-disable-next-line
  }, []);




  // Check if user is authenticated by presence of userData and token
  const token = localStorage.getItem('token');
  const isAuthenticated = !!token && !!userData && !!userData.role;

  if (loading) {
    // Optionally, show a spinner or null while loading
    return <div style={{textAlign: 'center', marginTop: '2rem'}}>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  // Normalize roles for case-insensitive comparison
  const userRole = userData.role?.toLowerCase?.() || '';
  const requiredRoleLower = requiredRole.toLowerCase();

  // SuperAdmins can access all routes (Admin, User, and SuperAdmin)
  if (userRole === 'superadmin') {
    return <>{children}</>;
  }

  // Admins can access both admin and user routes
  if (userRole === 'admin') {
    return <>{children}</>;
  }

  // Users can only access user routes
  if (userRole === requiredRoleLower) {
    return <>{children}</>;
  }

  // Redirect unauthorized access
  return (
    <Navigate
      to={userRole === 'user' ? '/user-dashboarduser' : '/admin-dashboardadmin'}
      state={{ from: location }}
      replace
    />
  );
}

export default ProtectedRoute;
