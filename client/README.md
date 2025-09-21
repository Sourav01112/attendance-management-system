# Attendance Management System - Client

A modern React-based web application for employee attendance tracking with real-time location capture and role-based dashboards.

##  Quick Start

```bash
# Clone and setup
git clone <https://github.com/Sourav01112/attendance-management-system.git>
cd client

# Install dependencies
npm install

# Run development server
npm run dev
```

Application runs at `http://localhost:3000`

## 🛠 Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for professional styling
- **TanStack Query** for server state management
- **Zustand** for client state management
- **React Router** for navigation

##  Project Structure

```
src/
├── components/
│   ├── auth/              # Login & authentication
│   ├── employee/          # Employee-specific components
│   ├── Admin/             # Admin dashboard components
│   └── shared/            # Reusable UI components
├── hooks/                 # Custom React hooks
├── pages/                 # Main page components
├── services/              # API integration layer
├── stores/                # Zustand state management
├── types/                 # TypeScript type definitions
└── utils/                 # Helper functions & constants
```

##  Core Features

### Employee Dashboard
- **Location-based Check-in/out**: Automatic GPS capture
- **Attendance History**: Personal records with status tracking
- **Correction Requests**: Submit corrections for invalid entries
- **Real-time Status**: Live updates on correction approval/rejection

### Admin Dashboard
- **Team Overview**: All employee attendance with filtering
- **Correction Management**: Approve/reject requests with comments
- **Employee Registration**: Add new users to the system
- **Analytics**: Attendance statistics and insights

##  User Roles & Access

```typescript

// ->  1. Employee Features

- Check-in/Check-out with location
- View personal attendance history
- Request attendance corrections
- Track correction status

// ->  2. Admin Features

- All employee features +
- View team attendance
- Manage correction requests
- Register new employees
```

##  UI Components

- **Professional Design**: IBM Plex Sans font for enterprise feel
- **Responsive Layout**: Mobile-first design approach
- **Accessibility**: WCAG compliant with keyboard navigation
- **Dark Mode Ready**: Professional color scheme
- **Loading States**: Smooth user experience with proper feedback

##  Demo Credentials

```bash
Employee Login:
Email: employee@test.com
Password: password123

Admin Login:
Email: Admin@test.com
Password: password123
```

##  Environment Variables

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

##  Build & Deploy

```bash
# Development
npm run dev

# Production build
npm run build

# Preview production build
npm run preview

# Type checking
npm run build
```

##  Key Features

- **Real-time Location**: GPS coordinates for attendance verification
- **Role-based UI**: Different interfaces for employees and Admins
- **Correction Workflow**: Complete approval process with comments
- **Professional Styling**: Enterprise-grade design patterns
- **Type Safety**: Full TypeScript implementation
- **Performance**: Optimized with React Query caching

##  Security Features

- **JWT Authentication**: Secure token-based auth
- **Role-based Access**: Component-level permission checks
- **Input Validation**: Client-side form validation
- **XSS Protection**: Sanitized user inputs
- **HTTPS Ready**: Secure communication with backend

##  Performance

- **Fast Loading**: Vite for instant HMR and optimized builds
- **Code Splitting**: Lazy loading for better performance
- **Caching**: Intelligent query caching with TanStack Query
- **Bundle Size**: Optimized production builds
- **Mobile Optimized**: Responsive design for all devices

Built with modern web technologies for scalable attendance management.