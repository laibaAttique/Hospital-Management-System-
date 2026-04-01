import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
    Container,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import { authAPI } from '../services/api';

const LoginForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Clear error on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.username || !formData.password) {
            setError('Please enter both username and password');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await authAPI.login(formData);

            // Store token and user info in localStorage
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));

            // Navigate to appointments page
            navigate('/appointments');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <LoginIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
                    <Typography component="h1" variant="h4" gutterBottom>
                        Login
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        Hospital Appointment Management System
                    </Typography>

                    {error && (
                        <Alert severity="error" sx={{ width: '100%', mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Username"
                            name="username"
                            autoComplete="username"
                            autoFocus
                            value={formData.username}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            name="password"
                            label="Password"
                            type="password"
                            id="password"
                            autoComplete="current-password"
                            value={formData.password}
                            onChange={handleChange}
                            disabled={loading}
                        />
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 3, mb: 2, py: 1.5 }}
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={20} /> : <LoginIcon />}
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </Button>

                        <Box sx={{ textAlign: 'center', mb: 2 }}>
                            <Typography variant="body2">
                                Don't have an account?{' '}
                                <Link to="/signup" style={{ color: '#1976d2', textDecoration: 'none', fontWeight: 'bold' }}>
                                    Sign Up
                                </Link>
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
                            <Typography variant="caption" display="block" gutterBottom>
                                <strong>Test Credentials:</strong>
                            </Typography>
                            <Typography variant="caption" display="block">
                                Admin: username: <strong>admin</strong>, password: <strong>admin123</strong>
                            </Typography>
                            <Typography variant="caption" display="block">
                                User: username: <strong>user</strong>, password: <strong>user123</strong>
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginForm;
