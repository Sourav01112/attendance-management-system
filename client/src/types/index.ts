

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'employee' | 'admin';
  created_at: string;
}

export interface LocationCoords {
  latitude: number;
  longitude: number;
}

export interface Attendance {
  id: string;
  user_id: string;
  date: string;
  check_in: string | null;
  check_out: string | null;
  check_in_location: LocationCoords | null;
  check_out_location: LocationCoords | null;
  total_hours: number;
  status: 'valid' | 'invalid' | 'pending';
  created_at: string;
  updated_at: string;
}



export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface CheckInRequest {
  location: LocationCoords;
}

export interface CheckOutRequest {
  location: LocationCoords;
}

export interface CorrectionRequest {
  attendance_id: string;
  requested_check_in: string | null;
  requested_check_out: string | null;
  reason: string;
}

export interface RegisterEmployeeRequest {
  email: string;
  password: string;
  name: string;
  role: 'employee' | 'admin';
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}


export interface CorrectionFormProps {
  attendanceId: string;
  currentCheckIn?: string;
  currentCheckOut?: string;
  onClose: () => void;
}

export interface AttendanceTableProps {
  attendances: Attendance[];
  showUserColumn?: boolean;
}


export interface Correction {
  id: string;
  attendance_id: string;
  user_id: string;
  requested_check_in: string | null;
  requested_check_out: string | null;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  comments: string; 
  created_at: string;
  expires_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
}

export interface RejectionModalProps {
  correction: Correction;
  onClose: () => void;
  onReject: (correctionId: string, comments: string) => void;
  isLoading: boolean;
}



export interface UseLocationReturn {
  location: LocationCoords | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<LocationCoords>;
}