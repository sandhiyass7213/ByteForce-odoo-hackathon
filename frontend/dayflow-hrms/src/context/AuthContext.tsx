'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole, EmployeeProfile, AttendanceRecord, LeaveRequest } from '../types/hrms';
import { mockEmployeeUser, mockAdminUser, mockAttendanceRecords, mockLeaveRequests } from '../data/mockData';

interface AuthContextType {
  user: EmployeeProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  attendanceLogs: AttendanceRecord[];
  leaveRequests: LeaveRequest[];
  activeOtpCode: string | null;
  isClockedIn: boolean;
  clockInTime: string | null;
  sendOtp: (email: string) => { success: boolean; code: string };
  verifyOtp: (email: string, code: string, targetRole: UserRole) => boolean;
  login: (email: string, pass: string, targetRole: UserRole) => boolean;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  clockIn: () => void;
  clockOut: () => void;
  submitLeaveRequest: (data: { leaveType: string; startDate: string; endDate: string; reason: string }) => void;
  approveLeaveRequest: (id: string, comment?: string) => void;
  rejectLeaveRequest: (id: string, comment?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<EmployeeProfile | null>(null);
  const [role, setRole] = useState<UserRole>('EMPLOYEE');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceRecord[]>(mockAttendanceRecords);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(mockLeaveRequests);
  
  const [activeOtpCode, setActiveOtpCode] = useState<string | null>(null);
  const [isClockedIn, setIsClockedIn] = useState<boolean>(true);
  const [clockInTime, setClockInTime] = useState<string | null>('09:00 AM');

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('dayflow_user');
      const savedRole = localStorage.getItem('dayflow_role') as UserRole;
      const savedAttendance = localStorage.getItem('dayflow_attendance');
      const savedLeaves = localStorage.getItem('dayflow_leaves');

      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setUser(parsed);
      } else {
        setUser(null);
      }

      if (savedRole) {
        setRole(savedRole);
      }

      if (savedAttendance) {
        setAttendanceLogs(JSON.parse(savedAttendance));
      }

      if (savedLeaves) {
        setLeaveRequests(JSON.parse(savedLeaves));
      }
    } catch (e) {
      console.error('Error restoring session from localStorage:', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendOtp = (email: string) => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtpCode(code);
    return { success: true, code };
  };

  const verifyOtp = (email: string, code: string, targetRole: UserRole): boolean => {
    // Allow generated OTP, or demo codes '123456' / '892104'
    if (activeOtpCode && code.trim() !== activeOtpCode && code.trim() !== '123456' && code.trim() !== '892104') {
      return false;
    }

    let selectedProfile: EmployeeProfile;
    if (targetRole === 'HR_ADMIN' || email.toLowerCase().includes('elena') || email.toLowerCase().includes('admin')) {
      selectedProfile = mockAdminUser;
    } else {
      selectedProfile = mockEmployeeUser;
    }

    setUser(selectedProfile);
    setRole(targetRole);
    localStorage.setItem('dayflow_user', JSON.stringify(selectedProfile));
    localStorage.setItem('dayflow_role', targetRole);
    setActiveOtpCode(null);
    return true;
  };

  const login = (email: string, pass: string, targetRole: UserRole): boolean => {
    const selectedProfile = targetRole === 'HR_ADMIN' ? mockAdminUser : mockEmployeeUser;
    setUser(selectedProfile);
    setRole(targetRole);
    localStorage.setItem('dayflow_user', JSON.stringify(selectedProfile));
    localStorage.setItem('dayflow_role', targetRole);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dayflow_user');
    localStorage.removeItem('dayflow_role');
  };

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    localStorage.setItem('dayflow_role', newRole);
  };

  const clockIn = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayStr = now.toISOString().split('T')[0];

    setIsClockedIn(true);
    setClockInTime(timeStr);

    const newRecord: AttendanceRecord = {
      id: `ATT-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user?.id || 'EMP-2026-001',
      userName: user?.fullName || 'Sarah Jenkins',
      date: todayStr,
      clockIn: timeStr,
      clockOut: null,
      workHours: '0h 01m',
      status: 'PRESENT',
      notes: 'Punch In registered',
    };

    const updated = [newRecord, ...attendanceLogs];
    setAttendanceLogs(updated);
    localStorage.setItem('dayflow_attendance', JSON.stringify(updated));
  };

  const clockOut = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setIsClockedIn(false);

    const updated = attendanceLogs.map((item, index) => {
      if (index === 0 && !item.clockOut) {
        return {
          ...item,
          clockOut: timeStr,
          workHours: '8h 00m',
          notes: 'Shift completed',
        };
      }
      return item;
    });

    setAttendanceLogs(updated);
    localStorage.setItem('dayflow_attendance', JSON.stringify(updated));
  };

  const submitLeaveRequest = (data: { leaveType: string; startDate: string; endDate: string; reason: string }) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const totalDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 || 1;

    const newReq: LeaveRequest = {
      id: `LV-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: user?.id || 'EMP-2026-001',
      userName: user?.fullName || 'Sarah Jenkins',
      userRole: user?.designation || 'Specialist',
      leaveType: data.leaveType,
      startDate: data.startDate,
      endDate: data.endDate,
      totalDays,
      reason: data.reason,
      status: 'PENDING',
      appliedOn: new Date().toISOString().split('T')[0],
    };

    const updated = [newReq, ...leaveRequests];
    setLeaveRequests(updated);
    localStorage.setItem('dayflow_leaves', JSON.stringify(updated));
  };

  const approveLeaveRequest = (id: string, comment?: string) => {
    const updated = leaveRequests.map((req) =>
      req.id === id
        ? {
            ...req,
            status: 'APPROVED' as const,
            adminComment: comment || 'Approved by HR Admin',
            reviewedBy: `${user?.fullName || 'Elena Rostova'} (HR Admin)`,
            reviewedOn: new Date().toISOString().split('T')[0],
          }
        : req
    );
    setLeaveRequests(updated);
    localStorage.setItem('dayflow_leaves', JSON.stringify(updated));
  };

  const rejectLeaveRequest = (id: string, comment?: string) => {
    const updated = leaveRequests.map((req) =>
      req.id === id
        ? {
            ...req,
            status: 'REJECTED' as const,
            adminComment: comment || 'Rejected by HR Admin',
            reviewedBy: `${user?.fullName || 'Elena Rostova'} (HR Admin)`,
            reviewedOn: new Date().toISOString().split('T')[0],
          }
        : req
    );
    setLeaveRequests(updated);
    localStorage.setItem('dayflow_leaves', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isAuthenticated: !!user,
        isLoading,
        attendanceLogs,
        leaveRequests,
        activeOtpCode,
        isClockedIn,
        clockInTime,
        sendOtp,
        verifyOtp,
        login,
        logout,
        switchRole,
        clockIn,
        clockOut,
        submitLeaveRequest,
        approveLeaveRequest,
        rejectLeaveRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
