import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import LogoutIcon from '@mui/icons-material/Logout';

const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const token = localStorage.getItem('token');

    let userRole = null;
    if (token) {
        try {
            const decoded = jwtDecode(token);
            userRole = decoded.role;
        } catch (error) {
            // Invalid token
        }
    }

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    return (
        <AppBar position="static" elevation={2}>
            <Toolbar>
                <LocalHospitalIcon sx={{ mr: 2 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Hospital Appointment System
                </Typography>

                {token && (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            color="inherit"
                            onClick={() => navigate('/appointments')}
                            sx={{
                                fontWeight: isActive('/appointments') ? 'bold' : 'normal',
                                textDecoration: isActive('/appointments') ? 'underline' : 'none'
                            }}
                        >
                            Appointments
                        </Button>

                        {userRole === 'admin' && (
                            <Button
                                color="inherit"
                                onClick={() => navigate('/admin')}
                                sx={{
                                    fontWeight: isActive('/admin') ? 'bold' : 'normal',
                                    textDecoration: isActive('/admin') ? 'underline' : 'none'
                                }}
                            >
                                Admin Dashboard
                            </Button>
                        )}

                        <Button
                            color="inherit"
                            onClick={handleLogout}
                            startIcon={<LogoutIcon />}
                        >
                            Logout
                        </Button>
                    </Box>
                )}
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
