export type UserRole = 'EMPLOYEE' | 'HR_ADMIN';

// Backward compatibility type alias
export type Role = 'employee' | 'admin' | UserRole;

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  department: string;
  designation: string;
  employeeCode: string;
  avatar?: string;
  phone?: string;
  joinDate?: string;
  location?: string;
}

export interface EmployeeProfile extends User {
  emergencyContact?: {
    name: string;
    relationship: string;
    phone: string;
  };
  skills?: string[];
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  userName: string;
  date: string;
  clockIn: string;
  clockOut: string | null;
  workHours: string;
  status: 'PRESENT' | 'LATE' | 'HALF_DAY' | 'ON_LEAVE';
  notes?: string;
}

export interface LeaveRequest {
  id: string;
  userId: string;
  userName: string;
  userRole?: string;
  leaveType: 'Casual Leave' | 'Sick Leave' | 'Annual Leave' | 'Maternity Leave' | string;
  startDate: string;
  endDate: string;
  totalDays: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'Pending' | 'Approved' | 'Rejected';
  appliedOn: string;
  adminComment?: string;
  reviewedBy?: string;
  reviewedOn?: string;
}
