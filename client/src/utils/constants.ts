export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8010/api';

export const ROUTES = {
  LOGIN: '/login',
  EMPLOYEE_DASHBOARD: '/employee',
  ADMIN_DASHBOARD: '/admin',
} as const;

export const API_ENDPOINTS = {
  LOGIN: '/auth/login',
  CHECKIN: '/checkin',
  CHECKOUT: '/checkout',
  MY_ATTENDANCE: '/attendance',
  CORRECTION: '/correction',
  TEAM_ATTENDANCE: '/team-attendance',
  PENDING_CORRECTIONS: '/pending-corrections',
  REGISTER_EMPLOYEE: '/register-employee',
} as const;

export const STATUS_COLORS = {
  valid: 'status-valid',
  invalid: 'status-invalid',
  pending: 'status-pending',
} as const;
