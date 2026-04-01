import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Snackbar,
    Alert,
    CircularProgress,
    Grid,
    Card,
    CardContent,
    Chip,
    Tabs,
    Tab,
    MenuItem,
    Divider
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EventIcon from '@mui/icons-material/Event';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PersonIcon from '@mui/icons-material/Person';
import { appointmentsAPI } from '../services/api';

const DEPARTMENTS = [
    'Cardiology',
    'General Medicine',
    'Pediatrics',
    'Orthopedics',
    'Neurology',
    'Dermatology',
    'ENT',
    'Ophthalmology'
];

const PatientDashboard = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [openDialog, setOpenDialog] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [currentTab, setCurrentTab] = useState(0); // 0=All, 1=Pending, 2=Approved, 3=Rejected
    const [newAppointment, setNewAppointment] = useState({
        patient_name: '',
        doctor_name: '',
        department: '',
        date: '',
        time: ''
    });

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

    useEffect(() => {
        fetchAppointments();
    }, []);

    const filterAppointments = React.useCallback(() => {
        let filtered = [...appointments];

        switch (currentTab) {
            case 1: // Pending
                filtered = appointments.filter(apt => apt.status === 'pending');
                break;
            case 2: // Approved
                filtered = appointments.filter(apt => apt.status === 'approved');
                break;
            case 3: // Rejected
                filtered = appointments.filter(apt => apt.status === 'rejected');
                break;
            default: // All
                filtered = appointments;
        }

        setFilteredAppointments(filtered);
    }, [currentTab, appointments]);

    useEffect(() => {
        filterAppointments();
    }, [filterAppointments]);

    const handleTabChange = (event, newValue) => {
        setCurrentTab(newValue);
    };

    const handleCreateAppointment = async () => {
        // Validation
        if (!newAppointment.patient_name || !newAppointment.doctor_name ||
            !newAppointment.department || !newAppointment.date || !newAppointment.time) {
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
                message: 'Appointment booked successfully!',
                severity: 'success'
            });
            setOpenDialog(false);
            setNewAppointment({ patient_name: '', doctor_name: '', department: '', date: '', time: '' });
            fetchAppointments();
        } catch (err) {
            setSnackbar({
                open: true,
                message: err.response?.data?.message || 'Failed to book appointment',
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
            weekday: 'short',
            year: 'numeric',
            month: 'short',
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

    const getTabCounts = () => {
        return {
            all: appointments.length,
            pending: appointments.filter(a => a.status === 'pending').length,
            approved: appointments.filter(a => a.status === 'approved').length,
            rejected: appointments.filter(a => a.status === 'rejected').length
        };
    };

    const counts = getTabCounts();

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <CircularProgress size={60} />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Box>
                    <Typography variant="h4" gutterBottom>
                        My Appointments
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage and track your hospital appointments
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    size="large"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ px: 3 }}
                >
                    Book Appointment
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            {/* Filter Tabs */}
            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={currentTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label={`All (${counts.all})`} />
                    <Tab label={`Pending (${counts.pending})`} />
                    <Tab label={`Approved (${counts.approved})`} />
                    <Tab label={`Rejected (${counts.rejected})`} />
                </Tabs>
            </Paper>

            {/* Appointments Grid */}
            {filteredAppointments.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                    <LocalHospitalIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No appointments found
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                        {currentTab === 0
                            ? "You haven't booked any appointments yet"
                            : `No ${['all', 'pending', 'approved', 'rejected'][currentTab]} appointments`
                        }
                    </Typography>
                    <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
                        Book Your First Appointment
                    </Button>
                </Paper>
            ) : (
                <Grid container spacing={3}>
                    {filteredAppointments.map((appointment) => (
                        <Grid item xs={12} md={6} key={appointment.id}>
                            <Card
                                elevation={2}
                                sx={{
                                    height: '100%',
                                    border: '1px solid',
                                    borderColor: appointment.status === 'approved' ? 'success.light' :
                                        appointment.status === 'rejected' ? 'error.light' : 'warning.light',
                                    '&:hover': {
                                        boxShadow: 6,
                                        transform: 'translateY(-2px)',
                                        transition: 'all 0.3s'
                                    }
                                }}
                            >
                                <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                        <Chip
                                            label={appointment.department}
                                            color="primary"
                                            size="small"
                                            icon={<LocalHospitalIcon />}
                                        />
                                        <Chip
                                            label={appointment.status.toUpperCase()}
                                            color={getStatusColor(appointment.status)}
                                            size="small"
                                        />
                                    </Box>

                                    <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <PersonIcon color="action" />
                                        {appointment.doctor_name}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <EventIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {formatDate(appointment.date)}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <AccessTimeIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                {formatTime(appointment.time)}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <PersonIcon fontSize="small" color="action" />
                                            <Typography variant="body2" color="text.secondary">
                                                Patient: {appointment.patient_name}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Create Appointment Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AddIcon />
                        Book New Appointment
                    </Box>
                </DialogTitle>
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
                        select
                        margin="dense"
                        label="Department"
                        fullWidth
                        variant="outlined"
                        value={newAppointment.department}
                        onChange={(e) => setNewAppointment({ ...newAppointment, department: e.target.value })}
                        sx={{ mt: 2 }}
                    >
                        {DEPARTMENTS.map((dept) => (
                            <MenuItem key={dept} value={dept}>
                                {dept}
                            </MenuItem>
                        ))}
                    </TextField>
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
                        inputProps={{ min: new Date().toISOString().split('T')[0] }}
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
                <DialogActions sx={{ px: 3, pb: 2 }}>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleCreateAppointment} variant="contained" startIcon={<AddIcon />}>
                        Book Appointment
                    </Button>
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

export default PatientDashboard;
