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
    Button,
    CircularProgress,
    Alert,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { appointmentsAPI } from '../services/api';

const AdminDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [newAppointment, setNewAppointment] = useState({
        patient_name: '',
        doctor_name: '',
        department: '',
        date: '',
        time: ''
    });

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

    const handleStatusUpdate = async (id, status) => {
        try {
            await appointmentsAPI.updateStatus(id, status);
            setSnackbar({
                open: true,
                message: `Appointment ${status} successfully`,
                severity: 'success'
            });
            fetchAppointments(); // Refresh the list
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Failed to update appointment',
                severity: 'error'
            });
        }
    };

    const handleCreateAppointment = async () => {
        // Validation
        if (!newAppointment.patient_name || !newAppointment.doctor_name || !newAppointment.department ||
            !newAppointment.date || !newAppointment.time) {
            setSnackbar({
                open: true,
                message: 'Please fill in all fields',
                severity: 'error'
            });
            return;
        }

        try {
            await appointmentsAPI.create(newAppointment);
            setSnackbar({
                open: true,
                message: 'Appointment created successfully',
                severity: 'success'
            });
            setOpenDialog(false);
            setNewAppointment({ patient_name: '', doctor_name: '', department: '', date: '', time: '' });
            fetchAppointments();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Failed to create appointment',
                severity: 'error'
            });
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
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4">
                    Admin Dashboard
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                >
                    New Appointment
                </Button>
            </Box>

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
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>ID</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Patient Name</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Department</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Doctor</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Date</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Time</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                                <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointments.map((appointment) => (
                                <TableRow
                                    key={appointment.id}
                                    sx={{ '&:hover': { bgcolor: 'action.hover' } }}
                                >
                                    <TableCell>{appointment.id}</TableCell>
                                    <TableCell>{appointment.patient_name}</TableCell>
                                    <TableCell>{appointment.department}</TableCell>
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
                                    <TableCell>
                                        <Box sx={{ display: 'flex', gap: 1 }}>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="success"
                                                startIcon={<CheckCircleIcon />}
                                                onClick={() => handleStatusUpdate(appointment.id, 'approved')}
                                                disabled={appointment.status === 'approved'}
                                            >
                                                Approve
                                            </Button>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                color="error"
                                                startIcon={<CancelIcon />}
                                                onClick={() => handleStatusUpdate(appointment.id, 'rejected')}
                                                disabled={appointment.status === 'rejected'}
                                            >
                                                Reject
                                            </Button>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Create Appointment Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Appointment</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Patient Name"
                        fullWidth
                        variant="outlined"
                        value={newAppointment.patient_name}
                        onChange={(e) => setNewAppointment({ ...newAppointment, patient_name: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Department"
                        fullWidth
                        variant="outlined"
                        value={newAppointment.department}
                        onChange={(e) => setNewAppointment({ ...newAppointment, department: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Doctor Name"
                        fullWidth
                        variant="outlined"
                        value={newAppointment.doctor_name}
                        onChange={(e) => setNewAppointment({ ...newAppointment, doctor_name: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Date"
                        type="date"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={newAppointment.date}
                        onChange={(e) => setNewAppointment({ ...newAppointment, date: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Time"
                        type="time"
                        fullWidth
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                        value={newAppointment.time}
                        onChange={(e) => setNewAppointment({ ...newAppointment, time: e.target.value })}
                        sx={{ mt: 2 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateAppointment} variant="contained">Create</Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminDashboard;
