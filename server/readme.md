# Attendance Management System - Backend

A robust Go-based REST API server for attendance tracking with automated validation and role-based access control.

## Quick Start

```bash
# Clone and setup
git clone < https://github.com/Sourav01112/attendance-management-system.git >
cd server

# Install dependencies
go mod tidy

# Run the server
go run main.go # or use air for reload
```

Server starts at `http://localhost:8010`

## 🛠 Tech Stack

- **Go 1.24+** with Gin framework
- **MongoDB** for data persistence
- **JWT** authentication
- **Cron jobs** for automated tasks
- **bcrypt** for password hashing

## Project Structure

```
|
├── cmd/
│   └── server/
│        └── main.go          # Application entry point
├── internal/
|   ├── config/
|   ├── config/
|   │   └── database.go       # MongoDB connection
|   ├── models/
|   │   ├── user.go           # User data models
|   │   ├── attendance.go     # Attendance records
|   │   └── correction.go     # Correction requests
|   ├── handlers/
|   │   ├── auth.go           # Authentication endpoints
|   │   ├── attendance.go     # Employee attendance APIs
|   │   └── admin.go          # Approver-specific APIs
|   ├── middleware/
|   │   └── auth.go           # JWT validation middleware
|   ├── services/
|   │   └── scheduler.go      # Background job scheduler
|   └── utils/
|       └── response.go       # API response helpers
| 
├── Dockerfile
├── go.mod
|
```

## API Endpoints

### Authentication
```
POST /api/auth/login                    # Employee and Admin login [common]
```

### Employee APIs
```
POST /api/checkin                       # Record check-in
POST /api/checkout                      # Record check-out
GET  /api/attendance                    # Get personal attendance
POST /api/correction                    # Request correction
```

### Admin APIs
```
GET  /api/team-attendance              # View all employee attendance
GET  /api/pending-corrections          # Get pending correction requests
PUT  /api/correction/:id/approve       # Approve correction
PUT  /api/correction/:id/reject        # Reject correction
POST /api/register-employee            # Register new employee
```

