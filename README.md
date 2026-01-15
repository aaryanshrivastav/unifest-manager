# Unifest Manager

A comprehensive college event management system that empowers campuses with real-time analytics, intelligent volunteer coordination, and data-driven decision making.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [User Roles](#user-roles)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Project Structure](#project-structure)
- [API Routes](#api-routes)
- [Contributing](#contributing)

## 🎯 Overview

Unifest Manager is a next-generation event management platform designed specifically for college campuses. It streamlines the entire event lifecycle from creation to execution, providing role-based access control, volunteer management, registration tracking, and administrative oversight.

## ✨ Features

- **Multi-Role System**: Support for Admin, Faculty, Coordinator, Volunteer, and Student roles
- **Event Management**: Create, update, and manage events with approval workflows
- **Registration System**: User-friendly event registration with capacity management
- **Volunteer Management**: Application and assignment system for event volunteers
- **Shift Management**: Coordinate volunteer shifts and assignments
- **Approval Workflows**: Multi-level approval system for events and registrations
- **Analytics Dashboard**: Real-time insights and statistics
- **Venue Management**: Track and assign venues to events
- **Authentication & Authorization**: Secure JWT-based authentication with role-based access control

## 👥 User Roles

1. **Admin**: Full system access, user management, event approvals
2. **Faculty**: Create events, approve registrations, view analytics
3. **Coordinator**: Manage event operations, assign volunteers, track shifts
4. **Volunteer**: Apply for volunteer positions, view assigned shifts
5. **User/Student**: Browse events, register for events, view registered events

## 🛠 Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **Oracle Database** - Relational database management system
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variable management
- **CORS** - Cross-origin resource sharing

### Frontend
- **HTML5** - Markup
- **CSS3** - Styling
- **JavaScript** - Client-side scripting

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v14 or higher)
- **npm** (v6 or higher) or **yarn**
- **Oracle Database** (11g or higher)
- **Oracle Instant Client** (for Oracle DB connectivity)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd unifest-manager
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

## ⚙️ Configuration

1. **Create a `.env` file** in the root directory:
   ```env
   # Server Configuration
   PORT=5000

   # Oracle Database Configuration
   DB_USER=your_db_username
   DB_PASS=your_db_password
   DB_HOST=localhost
   DB_PORT=1521
   DB_NAME=XE

   # JWT Secret (use a strong, random string in production)
   JWT_SECRET=your_jwt_secret_key
   ```

2. **Configure Oracle Database**
   - Ensure Oracle Database is running
   - Update the `.env` file with your database credentials
   - Make sure Oracle Instant Client is properly installed and configured

## 🗄 Database Setup

1. **Create database tables**
   ```bash
   npm run db
   ```

   This will create all necessary tables:
   - `users` - User accounts and authentication
   - `event` - Event information
   - `venues` - Venue details
   - `registration` - Event registrations
   - `volunteer_application` - Volunteer applications
   - `volunteer_assignment` - Volunteer assignments and shifts
   - `log_history` - System activity logs

## ▶️ Running the Application

1. **Start the server**
   ```bash
   npm start
   ```

2. **Access the application**
   - Frontend: `http://localhost:5000`
   - Landing page: `http://localhost:5000/html/landingpage.html`
   - Login: `http://localhost:5000/html/login.html`

## 📁 Project Structure

```
unifest-manager/
├── public/                    # Static files (HTML, CSS)
│   ├── css/                  # Stylesheets
│   └── html/                 # HTML pages
├── src/
│   ├── config/               # Configuration files
│   │   └── db.js            # Database connection
│   ├── controllers/          # Request handlers
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── coordinatorController.js
│   │   ├── eventController.js
│   │   ├── facultyController.js
│   │   ├── userController.js
│   │   └── volunteerController.js
│   ├── middlewares/          # Middleware functions
│   │   └── authMiddleware.js # Authentication middleware
│   ├── models/               # Database models
│   │   ├── event.js
│   │   ├── loghistory.js
│   │   ├── registration.js
│   │   ├── user.js
│   │   ├── venueNRoles.js
│   │   ├── volunteerApplication.js
│   │   └── volunteerAssignment.js
│   ├── routes/               # API routes
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── coordinatorRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── facultyRoutes.js
│   │   ├── userRoutes.js
│   │   └── volunteerRoutes.js
│   ├── setup/                # Setup scripts
│   │   └── createTables.js  # Database table creation
│   ├── utils/                # Utility functions
│   │   └── jwt.js           # JWT utilities
│   └── server.js             # Main server file
├── .env                      # Environment variables (create this)
├── package.json              # Project dependencies
└── README.md                 # This file
```

## 🔌 API Routes

### Authentication (`/auth`)
- User registration and login
- JWT token generation

### User Routes (`/user`)
- Browse events
- Register for events
- View registered events
- Update profile

### Event Routes (`/event`)
- Get all events
- Get event details
- Event creation (Faculty/Admin)
- Event updates

### Volunteer Routes (`/volunteer`)
- Apply for volunteer positions
- View volunteer applications
- View assigned shifts

### Coordinator Routes (`/coordinator`)
- Manage volunteer assignments
- Assign shifts
- View coordinator dashboard

### Faculty Routes (`/faculty`)
- Create events
- Approve registrations
- View faculty dashboard
- Event management

### Admin Routes (`/admin`)
- User management
- System approvals
- Analytics and reports
- Event approvals

## 🔒 Security Features

- Password hashing using bcryptjs
- JWT-based authentication
- Role-based access control (RBAC)
- CORS protection
- SQL injection prevention through parameterized queries

## 📝 Available Scripts

- `npm start` - Start the development server
- `npm run db` - Create database tables
- `npm test` - Run tests (if configured)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

ISC

## 👤 Author

Unifest Manager Development Team

## 🙏 Acknowledgments

- Oracle Database community
- Express.js contributors
- All open-source libraries used in this project

---

**Note**: Make sure to keep your `.env` file secure and never commit it to version control. Use environment variables for sensitive information in production environments.
