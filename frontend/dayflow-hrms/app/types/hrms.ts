export type Role = 'employee' | 'admin';

export type NavTab = 'dashboard' | 'attendance' | 'leaves' | 'payroll' | 'profile' | 'admin';

export type LeaveType = 'Paid Leave' | 'Sick Leave' | 'Casual Leave' | 'Maternity/Paternity' | 'Unpaid Leave';

export type LeaveStatus = 'Pending' | 'Approved' | 'Rejected';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  employeeAvatar: string;
  department: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  durationDays: number;
  reason: string;
  status: LeaveStatus;
  appliedOn: string;
  adminComment?: string;
  reviewedBy?: string;
  reviewedOn?: string;
}

export interface AttendanceRecord {
  id: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: 'PRESENT' | 'NOT CHECKED IN' | 'CHECKED OUT' | 'ON LEAVE';
  totalHours: string;
  notes?: string;
}

export interface PayrollBreakdown {
  employeeId: string;
  payPeriod: string;
  payDate: string;
  baseSalary: number;
  hra: number; // House Rent Allowance
  specialAllowance: number;
  performanceBonus: number;
  grossEarnings: number;
  providentFund: number;
  professionalTax: number;
  incomeTax: number;
  totalDeductions: number;
  netPay: number;
  currency: string;
  bankAccount: string;
  panNumber: string;
}

export interface EmployeeProfile {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  designation: string;
  avatar: string;
  joinDate: string;
  employeeCode: string;
  location: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
  skills: string[];
}

export interface DashboardStats {
  totalAttendanceDays: number;
  presentDaysCount: number;
  leaveBalanceRemaining: number;
  totalLeavesTaken: number;
  pendingApprovalsCount: number;
  nextUpcomingHoliday: {
    title: string;
    date: string;
    daysLeft: number;
  };
}
