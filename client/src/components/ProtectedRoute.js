// src/components/ProtectedRoute.js
import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../AuthContext';

const ProtectedRoute = ({ element }) => {
  const { auth } = useContext(AuthContext);
  const location = useLocation();

  return auth.isAuthenticated ? (
    element
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default ProtectedRoute;
