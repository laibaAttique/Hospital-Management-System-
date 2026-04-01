import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const ProtectedRoute = ({ children, adminOnly = false }) => {
    const token = localStorage.getItem('token');

    // Check if user is authenticated
    if (!token) {
        return <Navigate to="/login" replace />;
    }

    try {
        // Decode JWT to get user info
        const decoded = jwtDecode(token);

        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return <Navigate to="/login" replace />;
        }

        // Check admin access if required
        if (adminOnly && decoded.role !== 'admin') {
            return <Navigate to="/appointments" replace />;
        }

        return children;
    } catch (error) {
        // Invalid token
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        return <Navigate to="/login" replace />;
    }
};

export default ProtectedRoute;
