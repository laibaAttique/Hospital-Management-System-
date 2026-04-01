-- Update existing users with correct password hashes
USE hospital_db;

-- Update admin password (admin123)
UPDATE users 
SET password = '$2b$10$ShZGGvwKqZsNoIg8xzz1..rULv8sXrDokNE2LJQ5B0ZaA9W/98CV6' 
WHERE username = 'admin';

-- Update user password (user123)
UPDATE users 
SET password = '$2b$10$YBImZOtcpHREtAVxkXEImuY2lzIsoByjQON4jJAYPUehUbaE.iESy' 
WHERE username = 'user';

-- Verify the update
SELECT username, role FROM users;
