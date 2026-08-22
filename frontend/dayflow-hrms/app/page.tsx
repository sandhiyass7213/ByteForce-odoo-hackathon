'use client';

import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardOverview from './components/DashboardOverview';
import AttendanceWidget from './components/AttendanceWidget';
import LeaveTable from './components/LeaveTable';
import LeaveRequestModal from './components/LeaveRequestModal';
import AdminApprovalPanel from './components/AdminApprovalPanel';
import ProfileCard from './components/ProfileCard';
import PayrollCard from './components/PayrollCard';

import { 
  initialProfile, 
  initialPayroll, 
  initialLeaveRequests, 
  mockDashboardStats 
} from './data/mockData';
import { NavTab, Role, LeaveRequest, EmployeeProfile } from './types/hrms';

export default function Home() {
  const [role, setRole] = useState<Role>('employee');
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [userProfile, setUserProfile] = useState<EmployeeProfile>(initialProfile);
  const [payrollData, setPayrollData] = useState(initialPayroll);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialLeaveRequests);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);

  // Sidebar responsive state
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  const pendingLeavesCount = leaveRequests.filter((r) => r.status === 'Pending').length;

  // Handlers for leave operations
  const handleApplyLeave = (
    newReqData: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>
  ) => {
    const newReq: LeaveRequest = {
      ...newReqData,
      id: `LV-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Pending',
      appliedOn: new Date().toISOString().split('T')[0],
    };
    setLeaveRequests([newReq, ...leaveRequests]);
  };

  const handleApproveLeave = (id: string, comment: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: 'Approved',
              adminComment: comment,
              reviewedBy: 'Elena Rostova (HR Admin)',
              reviewedOn: new Date().toISOString().split('T')[0],
            }
          : req
      )
    );
  };

  const handleRejectLeave = (id: string, comment: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) =>
        req.id === id
          ? {
              ...req,
              status: 'Rejected',
              adminComment: comment,
              reviewedBy: 'Elena Rostova (HR Admin)',
              reviewedOn: new Date().toISOString().split('T')[0],
            }
          : req
      )
    );
  };

  const handleCancelLeave = (id: string) => {
    setLeaveRequests((prev) => prev.filter((r) => r.id !== id));
  };

  const handleUpdateProfile = (updatedProfile: EmployeeProfile) => {
    setUserProfile(updatedProfile);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        role={role}
        pendingLeavesCount={pendingLeavesCount}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Bar */}
        <Header
          user={userProfile}
          role={role}
          setRole={setRole}
          setIsOpenMobile={setIsOpenMobile}
          isCollapsed={isCollapsed}
        />

        {/* Dynamic Page Content */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
          isCollapsed ? 'lg:pl-24' : 'lg:pl-72'
        }`}>
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Dashboard View */}
            {activeTab === 'dashboard' && (
              <DashboardOverview
                stats={mockDashboardStats}
                role={role}
                onNavigateTab={setActiveTab}
                onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
              />
            )}

            {/* Attendance View */}
            {activeTab === 'attendance' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                      Daily Attendance Tracker
                    </h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Clock in/out, view shift hours & punch logs
                    </p>
                  </div>
                </div>
                <AttendanceWidget />
              </div>
            )}

            {/* Leave Requests View */}
            {activeTab === 'leaves' && (
              <div className="space-y-6">
                <LeaveTable
                  leaveRequests={leaveRequests.filter(
                    (r) => role === 'admin' || r.employeeId === userProfile.id
                  )}
                  onOpenModal={() => setIsLeaveModalOpen(true)}
                  onCancelRequest={handleCancelLeave}
                />
              </div>
            )}

            {/* Profile View */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <ProfileCard
                  user={userProfile}
                  onUpdateProfile={handleUpdateProfile}
                />
              </div>
            )}

            {/* Payroll View */}
            {activeTab === 'payroll' && (
              <div className="space-y-6">
                <PayrollCard payroll={payrollData} />
              </div>
            )}

            {/* Admin Panel View */}
            {activeTab === 'admin' && (
              <div className="space-y-6">
                <AdminApprovalPanel
                  leaveRequests={leaveRequests}
                  onApprove={handleApproveLeave}
                  onReject={handleRejectLeave}
                />
              </div>
            )}

          </div>
        </main>

        {/* Global Footer */}
        <footer className={`py-4 px-6 text-center text-xs text-slate-400 border-t border-slate-200/60 dark:border-slate-800 transition-all ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}>
          <span>© 2026 Dayflow HRMS. Built with Next.js (App Router), TypeScript & Tailwind CSS.</span>
        </footer>

      </div>

      {/* Global Leave Application Modal */}
      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmit={handleApplyLeave}
        userAvatar={userProfile.avatar}
        userName={userProfile.fullName}
      />

    </div>
  );
}