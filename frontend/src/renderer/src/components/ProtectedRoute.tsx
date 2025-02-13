import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Assuming you have an AuthContext

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth(); // Get the user from the AuthContext

  // If the user is not authenticated, redirect to the login page
  if (!user) {
    console.warn('Unauthorized access attempt. Redirecting to login.');
    return <Navigate to="/" replace />;
  }

  // If the user is authenticated, render the protected route
  return <>{children}</>;
};

export default ProtectedRoute;
