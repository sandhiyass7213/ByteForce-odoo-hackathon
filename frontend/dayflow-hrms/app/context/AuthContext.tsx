'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { EmployeeProfile, LeaveRequest, Role } from '../types/hrms';
import { initialProfile, initialLeaveRequests } from '../data/mockData';

// Pre-seeded Admin Profile
export const adminProfile: EmployeeProfile = {
  id: 'HR-2026-001',
  fullName: 'Elena Rostova',
  email: 'elena.rostova@dayflow.io',
  phone: '+1 (555) 840-2219',
  role: 'Head of Human Resources',
  department: 'People & HR Admin',
  designation: 'HR Director',
  avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
  joinDate: '10 Mar 2021',
  employeeCode: 'HR-1001',
  location: 'San Francisco, CA (Headquarters)',
  emergencyContact: {
    name: 'Viktor Rostova',
    relationship: 'Brother',
    phone: '+1 (555) 773-1029',
  },
  skills: ['Talent Acquisition', 'HR Strategy', 'Conflict Resolution', 'Employment Law', 'Payroll Management'],
};

// Initial Employees List
export const mockEmployeesList: EmployeeProfile[] = [
  initialProfile,
  adminProfile,
  {
    id: 'EMP-2026-012',
    fullName: 'Alex Mercer',
    email: 'alex.mercer@dayflow.io',
    phone: '+1 (555) 204-9981',
    role: 'Senior Frontend Engineer',
    department: 'Engineering',
    designation: 'Tech Lead',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    joinDate: '01 Feb 2022',
    employeeCode: 'DF-0124',
    location: 'Austin, TX (Remote)',
    emergencyContact: { name: 'Sarah Mercer', relationship: 'Spouse', phone: '+1 (555) 303-1122' },
    skills: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'System Architecture'],
  },
  {
    id: 'EMP-2026-045',
    fullName: 'David Chen',
    email: 'david.chen@dayflow.io',
    phone: '+1 (555) 609-1234',
    role: 'Growth Marketing Manager',
    department: 'Marketing',
    designation: 'Senior Manager',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    joinDate: '14 Jun 2023',
    employeeCode: 'DF-0451',
    location: 'New York, NY (Hybrid)',
    emergencyContact: { name: 'Lily Chen', relationship: 'Sister', phone: '+1 (555) 909-3322' },
    skills: ['SEO', 'Performance Marketing', 'Google Analytics', 'Content Strategy'],
  },
  {
    id: 'EMP-2026-074',
    fullName: 'Priya Sharma',
    email: 'priya.sharma@dayflow.io',
    phone: '+1 (555) 778-4455',
    role: 'DevOps Engineer',
    department: 'Engineering',
    designation: 'Staff Engineer',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    joinDate: '03 Nov 2021',
    employeeCode: 'DF-0742',
    location: 'Seattle, WA (Remote)',
    emergencyContact: { name: 'Amit Sharma', relationship: 'Father', phone: '+1 (555) 112-9900' },
    skills: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
  },
];

interface AuthContextType {
  user: EmployeeProfile | null;
  role: Role;
  isAuthenticated: boolean;
  isLoading: boolean;
  leaveRequests: LeaveRequest[];
  employeesList: EmployeeProfile[];
  activeOtpCode: string | null;
  sendOtp: (email: string) => { success: boolean; code: string };
  verifyOtp: (email: string, code: string, targetRole: Role) => boolean;
  login: (email: string, pass: string, targetRole: Role) => boolean;
  signup: (formData: {
    fullName: string;
    email: string;
    role: Role;
    department: string;
    designation: string;
    employeeCode: string;
  }) => void;
  logout: () => void;
  switchRole: (newRole: Role) => void;
  handleApplyLeave: (newReq: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => void;
  handleApproveLeave: (id: string, comment: string) => void;
  handleRejectLeave: (id: string, comment: string) => void;
  handleCancelLeave: (id: string) => void;
  addEmployee: (empData: Partial<EmployeeProfile>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<EmployeeProfile | null>(null);
  const [role, setRole] = useState<Role>('employee');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [employeesList, setEmployeesList] = useState<EmployeeProfile[]>(mockEmployeesList);
  const [activeOtpCode, setActiveOtpCode] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('dayflow_user');
      const savedRole = localStorage.getItem('dayflow_role') as Role;
      const savedLeaves = localStorage.getItem('dayflow_leaves');
      const savedEmps = localStorage.getItem('dayflow_employees');

      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else {
        setUser(null);
      }

      if (savedRole) {
        setRole(savedRole);
      }

      if (savedLeaves) {
        setLeaveRequests(JSON.parse(savedLeaves));
      }

      if (savedEmps) {
        setEmployeesList(JSON.parse(savedEmps));
      }
    } catch (e) {
      console.error('Error restoring session from localStorage:', e);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const sendOtp = (email: string) => {
    // Generate 6-digit random code
    const generated = Math.floor(100000 + Math.random() * 900000).toString();
    setActiveOtpCode(generated);
    return { success: true, code: generated };
  };

  const verifyOtp = (email: string, code: string, targetRole: Role): boolean => {
    // Accept generated OTP or demo bypass "123456" or "892104"
    if (activeOtpCode && code.trim() !== activeOtpCode && code.trim() !== '123456' && code.trim() !== '892104') {
      return false;
    }

    let matchedUser: EmployeeProfile | undefined;
    if (targetRole === 'admin' || email.toLowerCase().includes('admin') || email.toLowerCase().includes('elena')) {
      matchedUser = adminProfile;
    } else {
      matchedUser = employeesList.find((e) => e.email.toLowerCase() === email.toLowerCase()) || initialProfile;
    }

    setUser(matchedUser);
    setRole(targetRole);
    localStorage.setItem('dayflow_user', JSON.stringify(matchedUser));
    localStorage.setItem('dayflow_role', targetRole);
    setActiveOtpCode(null);
    return true;
  };

  const login = (email: string, pass: string, targetRole: Role): boolean => {
    let matchedUser: EmployeeProfile | undefined;

    if (targetRole === 'admin' || email.toLowerCase().includes('admin') || email.toLowerCase().includes('elena')) {
      matchedUser = adminProfile;
    } else {
      matchedUser = employeesList.find((e) => e.email.toLowerCase() === email.toLowerCase()) || initialProfile;
    }

    setUser(matchedUser);
    setRole(targetRole);
    localStorage.setItem('dayflow_user', JSON.stringify(matchedUser));
    localStorage.setItem('dayflow_role', targetRole);
    return true;
  };

  const signup = (formData: {
    fullName: string;
    email: string;
    role: Role;
    department: string;
    designation: string;
    employeeCode: string;
  }) => {
    const newProfile: EmployeeProfile = {
      id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: formData.fullName,
      email: formData.email,
      phone: '+1 (555) 000-1122',
      role: formData.designation,
      department: formData.department,
      designation: formData.designation,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      joinDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      employeeCode: formData.employeeCode || `DF-${Math.floor(1000 + Math.random() * 9000)}`,
      location: 'Remote / Headquarters',
      emergencyContact: { name: 'Emergency Contact', relationship: 'Family', phone: '+1 (555) 000-0000' },
      skills: ['Teamwork', 'Communication', 'HRMS User'],
    };

    setUser(newProfile);
    setRole(formData.role);
    const updated = [newProfile, ...employeesList];
    setEmployeesList(updated);
    localStorage.setItem('dayflow_user', JSON.stringify(newProfile));
    localStorage.setItem('dayflow_role', formData.role);
    localStorage.setItem('dayflow_employees', JSON.stringify(updated));
  };

  const addEmployee = (empData: Partial<EmployeeProfile>) => {
    const newEmp: EmployeeProfile = {
      id: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: empData.fullName || 'New Team Member',
      email: empData.email || 'employee@dayflow.io',
      phone: empData.phone || '+1 (555) 000-1122',
      role: empData.role || empData.designation || 'Staff Member',
      department: empData.department || 'Engineering',
      designation: empData.designation || 'Specialist',
      avatar: empData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      joinDate: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' }),
      employeeCode: empData.employeeCode || `DF-${Math.floor(1000 + Math.random() * 9000)}`,
      location: empData.location || 'Headquarters',
      emergencyContact: empData.emergencyContact || { name: 'Emergency Contact', relationship: 'Family', phone: '+1 (555) 000-0000' },
      skills: empData.skills || ['Core Operations', 'Team Collaboration'],
    };

    const updated = [newEmp, ...employeesList];
    setEmployeesList(updated);
    localStorage.setItem('dayflow_employees', JSON.stringify(updated));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('dayflow_user');
    localStorage.removeItem('dayflow_role');
  };

  const switchRole = (newRole: Role) => {
    setRole(newRole);
    localStorage.setItem('dayflow_role', newRole);
  };

  const handleApplyLeave = (newReqData: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => {
    const newReq: LeaveRequest = {
      ...newReqData,
      id: `LV-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    const updated = [newReq, ...leaveRequests];
    setLeaveRequests(updated);
    localStorage.setItem('dayflow_leaves', JSON.stringify(updated));
  };

  const handleApproveLeave = (id: string, comment: string) => {
    const updated = leaveRequests.map((req) =>
      req.id === id
        ? {
            ...req,
            status: 'Approved' as const,
            adminComment: comment,
            reviewedBy: `${user?.fullName || 'HR Admin'} (HR Admin)`,
            reviewedOn: new Date().toISOString().split('T')[0],
          }
        : req
    );
    setLeaveRequests(updated);
    localStorage.setItem('dayflow_leaves', JSON.stringify(updated));
  };

  const handleRejectLeave = (id: string, comment: string) => {
    const updated = leaveRequests.map((req) =>
      req.id === id
        ? {
            ...req,
            status: 'Rejected' as const,
            adminComment: comment,
            reviewedBy: `${user?.fullName || 'HR Admin'} (HR Admin)`,
            reviewedOn: new Date().toISOString().split('T')[0],
          }
        : req
    );
    setLeaveRequests(updated);
    localStorage.setItem('dayflow_leaves', JSON.stringify(updated));
  };

  const handleCancelLeave = (id: string) => {
    const updated = leaveRequests.filter((r) => r.id !== id);
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
        leaveRequests,
        employeesList,
        activeOtpCode,
        sendOtp,
        verifyOtp,
        login,
        signup,
        logout,
        switchRole,
        handleApplyLeave,
        handleApproveLeave,
        handleRejectLeave,
        handleCancelLeave,
        addEmployee,
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
