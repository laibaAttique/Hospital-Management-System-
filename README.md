# Hospital Appointment Management System

A complete full-stack web application for managing hospital appointments, built with React, Node.js/Express, and MySQL. This project demonstrates JWT-based authentication, role-based access control, and Material-UI components.

## 🎯 Features

- **User Authentication**: Secure login with JWT tokens and bcrypt password hashing
- **Role-Based Access Control**: Separate interfaces for regular users and administrators
- **Appointment Management**: View, create, and manage hospital appointments
- **Admin Dashboard**: Approve or reject appointments with real-time updates
- **Responsive Design**: Modern UI built with Material-UI components
- **Protected Routes**: Client-side route protection based on authentication and user roles

## 📋 Prerequisites

Before running this application, ensure you have the following installed:

- **Node.js** (v14 or higher) - [Download](https://nodejs.org/)
- **MySQL** (v5.7 or higher) - [Download](https://dev.mysql.com/downloads/)
- **npm** (comes with Node.js)

## 🚀 Installation & Setup

### 1. Clone or Download the Project

Navigate to the HMS directory:
```bash
cd HMS
```

### 2. Database Setup

**Step 2.1: Start MySQL Server**

Make sure your MySQL server is running. You can start it from:
- Windows: Services → MySQL → Start
- Or use MySQL Workbench

**Step 2.2: Create Database and Tables**

Open MySQL command line or MySQL Workbench and run:

```bash
mysql -u root -p < backend/database/schema.sql
```

Or manually execute the SQL commands in `backend/database/schema.sql`

**Step 2.3: Seed Sample Data**

Run the seed script to populate the database:

```bash
mysql -u root -p hospital_db < backend/database/seed.sql
```

This will create:
- Admin user: `admin` / `admin123`
- Regular user: `user` / `user123`
- 7 sample appointments

**Step 2.4: Configure Database Connection**

Edit `backend/.env` file and update your MySQL credentials:

```env
PORT=5000
JWT_SECRET=your_jwt_secret_key_change_this_in_production
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password_here
DB_NAME=hospital_db
```

### 3. Backend Setup

**Step 3.1: Install Dependencies**

```bash
cd backend
npm install
```

This will install:
- express
- mysql2
- jsonwebtoken
- bcrypt
- cors
- dotenv
- nodemon (dev dependency)

**Step 3.2: Start Backend Server**

```bash
npm run dev
```

(Or `npm start` for production mode without auto-reload)

You should see:
```
✓ MySQL database connected successfully
🚀 Server running on http://localhost:5000
📋 API endpoints available at http://localhost:5000/api
```

### 4. Frontend Setup

**Step 4.1: Install Dependencies**

Open a new terminal window and navigate to the frontend directory:

```bash
cd frontend
npm install
```

This will install:
- react
- react-router-dom
- @mui/material
- axios
- jwt-decode
- and other dependencies

**Step 4.2: Start Frontend Development Server**

```bash
npm start
```

The application will automatically open in your browser at `http://localhost:3000`

## 🎮 Usage

### Login Credentials

**Admin Account:**
- Username: `admin`
- Password: `admin123`
- Access: Can view all appointments, approve/reject them, and create new appointments

**Regular User Account:**
- Username: `user`
- Password: `user123`
- Access: Can only view appointments

### Application Flow

1. **Login Page** (`/login`)
   - Enter credentials
   - JWT token is generated and stored in localStorage
   - Redirects to appointments page

2. **Appointments Page** (`/appointments`)
   - Protected route (requires authentication)
   - Displays all appointments in a Material-UI table
   - Shows patient name, doctor, date, time, and status

3. **Admin Dashboard** (`/admin`)
   - Admin-only protected route
   - Non-admin users are redirected to `/appointments`
   - Features:
     - View all appointments
     - Approve/Reject appointments with buttons
     - Create new appointments via dialog form
     - Real-time status updates with Snackbar notifications

## 📁 Project Structure

```
HMS/
├── backend/
│   ├── config/
│   │   └── db.js                 # MySQL connection configuration
│   ├── database/
│   │   ├── schema.sql            # Database schema
│   │   ├── seed.sql              # Sample data
│   │   └── hash_passwords.js     # Utility to generate password hashes
│   ├── middleware/
│   │   └── auth.js               # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js               # Authentication routes
│   │   └── appointments.js       # Appointment CRUD routes
│   ├── .env                      # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                 # Express server entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AdminDashboard.jsx    # Admin management interface
│   │   │   ├── AppointmentsList.jsx  # User appointments view
│   │   │   ├── LoginForm.jsx         # Login component
│   │   │   ├── Navbar.jsx            # Navigation bar
│   │   │   └── ProtectedRoute.jsx    # Route protection wrapper
│   │   ├── services/
│   │   │   └── api.js                # Axios API configuration
│   │   ├── App.js                    # Main app with routing
│   │   ├── index.js                  # React entry point
│   │   └── index.css                 # Global styles
│   ├── .gitignore
│   └── package.json
│
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - User login (returns JWT token)

### Appointments
- `GET /api/appointments` - Get all appointments (protected)
- `POST /api/appointments` - Create new appointment (protected)
- `PUT /api/appointments/:id` - Update appointment status (admin only)

## 🎨 Technologies Used

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Material-UI (MUI)** - Component library
- **Axios** - HTTP client
- **jwt-decode** - JWT token decoding

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MySQL** - Database
- **mysql2** - MySQL client
- **jsonwebtoken** - JWT authentication
- **bcrypt** - Password hashing
- **cors** - Cross-origin resource sharing
- **dotenv** - Environment variables

## 🔒 Security Features

- Passwords hashed with bcrypt (10 salt rounds)
- JWT tokens with 24-hour expiration
- Protected API routes with middleware
- Role-based access control
- Token validation on both client and server
- Automatic token refresh handling

## 🐛 Troubleshooting

### Database Connection Error
- Verify MySQL is running
- Check credentials in `backend/.env`
- Ensure `hospital_db` database exists

### Port Already in Use
- Backend: Change `PORT` in `backend/.env`
- Frontend: React will prompt to use a different port

### CORS Errors
- Ensure backend is running on port 5000
- Check `api.js` baseURL matches backend port

### Login Not Working
- Verify database has seeded users
- Check browser console for errors
- Ensure backend server is running

## 📝 Teacher Requirements Checklist

✅ React Router for routing (`/login`, `/appointments`, `/admin`)  
✅ Material-UI for all UI components (forms, tables, buttons)  
✅ Appointments displayed using `map()` function in MUI Table  
✅ JWT-based authentication with localStorage  
✅ Admin-protected route with role checking from JWT payload  
✅ MySQL database with users and appointments tables  
✅ Node.js/Express backend with proper routes  
✅ Password hashing with bcrypt  
✅ Protected routes with middleware  
✅ Complete project structure with setup instructions  
✅ Presentable UI with proper styling and validation  

## 📄 License

This is a semester project for educational purposes.

## 👨‍💻 Development

To run in development mode with auto-reload:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm start
```

---

**Note:** Make sure both backend and frontend servers are running simultaneously for the application to work properly.
