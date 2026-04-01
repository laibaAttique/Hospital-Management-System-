-- Migration script to enhance database schema for patient dashboard
USE hospital_db;

-- Add user profile fields
ALTER TABLE users 
ADD COLUMN full_name VARCHAR(100) AFTER username,
ADD COLUMN email VARCHAR(100) UNIQUE AFTER full_name,
ADD COLUMN phone VARCHAR(20) AFTER email;

-- Add appointment enhancements
ALTER TABLE appointments 
ADD COLUMN user_id INT AFTER id,
ADD COLUMN department VARCHAR(50) AFTER doctor_name;

-- Add foreign key constraint
ALTER TABLE appointments 
ADD CONSTRAINT fk_user_appointment 
FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- Create index for better performance
CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_department ON appointments(department);

-- Update existing admin and user with profile data
UPDATE users SET 
  full_name = 'System Administrator',
  email = 'admin@hospital.com',
  phone = '555-0100'
WHERE username = 'admin';

UPDATE users SET 
  full_name = 'Test User',
  email = 'user@hospital.com',
  phone = '555-0101'
WHERE username = 'user';

-- Update existing appointments with user_id and department
-- Assign all existing appointments to the test user (id=2)
UPDATE appointments SET 
  user_id = 2,
  department = CASE 
    WHEN doctor_name LIKE '%Smith%' THEN 'Cardiology'
    WHEN doctor_name LIKE '%Brown%' THEN 'General Medicine'
    WHEN doctor_name LIKE '%Lee%' THEN 'Pediatrics'
    ELSE 'General Medicine'
  END
WHERE user_id IS NULL;

-- Verify changes
SELECT 'Users Table Structure:' as Info;
DESCRIBE users;

SELECT 'Appointments Table Structure:' as Info;
DESCRIBE appointments;

SELECT 'Sample Data:' as Info;
SELECT u.username, u.full_name, u.email, COUNT(a.id) as appointment_count
FROM users u
LEFT JOIN appointments a ON u.id = a.user_id
GROUP BY u.id;
