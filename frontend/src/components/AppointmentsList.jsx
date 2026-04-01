import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography,
    Box,
    CircularProgress,
    Alert,
    Chip
} from '@mui/material';
import { appointmentsAPI } from '../services/api';

const AppointmentsList = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            const response = await appointmentsAPI.getAll();
            setAppointments(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch appointments');
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'success';
            case 'rejected':
                return 'error';
            case 'pending':
                return 'warning';
            default:
                return 'default';
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (timeString) => {
        // Convert 24-hour time to 12-hour format
        const [hours, minutes] = timeString.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                My Appointments
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {appointments.length === 0 ? (
                <Paper sx={{ p: 4, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No appointments found
                    </Typography>
                </Paper>
            ) : (
                <TableContainer component={Paper} elevation={2}>
                    <Table>
                        <TableHead>
                            <TableRow sx={{ bgcolor: 'primary.main' }}>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Patient Name</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Doctor</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Time</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointments.map((appointment) => (
                                <TableRow
                                    key={appointment.id}
                                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                                >
                                    <TableCell>{appointment.patient_name}</TableCell>
                                    <TableCell>{appointment.doctor_name}</TableCell>
                                    <TableCell>{formatDate(appointment.date)}</TableCell>
                                    <TableCell>{formatTime(appointment.time)}</TableCell>
                                    <TableCell>
                                        <Chip
                                            label={appointment.status.toUpperCase()}
                                            color={getStatusColor(appointment.status)}
                                            size="small"
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Container>
    );
};

export default AppointmentsList;
