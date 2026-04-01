USE hospital_db;

-- Insert users (passwords are hashed with bcrypt)
-- Admin user: username='admin', password='admin123'
-- Regular user: username='user', password='user123'
INSERT INTO users (username, full_name, email, phone, password, role) VALUES
('admin', 'System Administrator', 'admin@hospital.com', '555-0100', '$2b$10$ShZGGvwKqZsNoIg8xzz1..rULv8sXrDokNE2LJQ5B0ZaA9W/98CV6', 'admin'),
('user', 'John Patient', 'john@example.com', '555-0101', '$2b$10$YBImZOtcpHREtAVxkXEImuY2lzIsoByjQON4jJAYPUehUbaE.iESy', 'user');

-- Insert sample appointments (all assigned to user with id=2)
INSERT INTO appointments (user_id, patient_name, doctor_name, department, date, time, status) VALUES
(2, 'John Patient', 'Dr. Sarah Smith', 'Cardiology', '2025-12-15', '09:00:00', 'pending'),
(2, 'John Patient', 'Dr. Michael Brown', 'General Medicine', '2025-12-15', '10:30:00', 'approved'),
(2, 'John Patient', 'Dr. Sarah Smith', 'Cardiology', '2025-12-16', '14:00:00', 'pending'),
(2, 'John Patient', 'Dr. James Lee', 'Pediatrics', '2025-12-17', '11:00:00', 'rejected'),
(2, 'John Patient', 'Dr. Sarah Smith', 'Cardiology', '2025-12-18', '15:30:00', 'approved'),
(2, 'John Patient', 'Dr. Michael Brown', 'Orthopedics', '2025-12-19', '09:30:00', 'pending'),
(2, 'John Patient', 'Dr. James Lee', 'Neurology', '2025-12-20', '13:00:00', 'pending');
