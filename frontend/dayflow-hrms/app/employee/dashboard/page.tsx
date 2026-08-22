'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import DashboardOverview from '../../components/DashboardOverview';
import AttendanceWidget from '../../components/AttendanceWidget';
import LeaveTable from '../../components/LeaveTable';
import LeaveRequestModal from '../../components/LeaveRequestModal';
import ProfileCard from '../../components/ProfileCard';
import PayrollCard from '../../components/PayrollCard';

import { useAuth } from '../../context/AuthContext';
import { initialPayroll, mockDashboardStats } from '../../data/mockData';
import { NavTab, EmployeeProfile } from '../../types/hrms';
import { ShieldAlert, ArrowRight, Lock } from 'lucide-react';

export default function EmployeeDashboardPage() {
  const router = useRouter();
  const { 
    user, 
    role, 
    isAuthenticated, 
    isLoading, 
    leaveRequests, 
    handleApplyLeave, 
    handleCancelLeave 
  } = useAuth();

  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState<boolean>(false);
  const [userProfile, setUserProfile] = useState<EmployeeProfile | null>(user);
  const [payrollData, setPayrollData] = useState(initialPayroll);

  // Sidebar responsive states
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setUserProfile(user);
    }
  }, [user]);

  // Auth protection check
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !userProfile) {
    return (
      <div className="min-h-screen bg-[#0b1120] text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-[#6366f1] border-t-transparent rounded-full animate-spin glow-purple" />
          <p className="text-xs font-semibold text-slate-400">Loading Employee Portal...</p>
        </div>
      </div>
    );
  }

  // Filter leave requests belonging to this logged-in employee
  const employeeLeaveRequests = leaveRequests.filter(
    (req) => req.employeeId === userProfile.id || req.employeeName.toLowerCase() === userProfile.fullName.toLowerCase()
  );

  const handleUpdateProfile = (updated: EmployeeProfile) => {
    setUserProfile(updated);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'admin') {
            setActiveTab('dashboard');
          } else {
            setActiveTab(tab);
          }
        }}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Bar with Live Role Switcher */}
        <Header
          setIsOpenMobile={setIsOpenMobile}
          isCollapsed={isCollapsed}
        />

        {/* Dynamic Employee Content Area */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
          isCollapsed ? 'lg:pl-24' : 'lg:pl-72'
        }`}>
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* Top Employee Role Banner */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
                <div>
                  <h2 className="text-sm font-extrabold text-white flex items-center gap-2">
                    Employee Access Portal
                    <span className="text-[10px] bg-indigo-950 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-800">
                      Standard Permissions
                    </span>
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Logged in as: <strong className="text-white">{userProfile.fullName}</strong> ({userProfile.designation})
                  </p>
                </div>
              </div>

              {/* Navigation Tabs Bar */}
              <div className="flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800 text-xs font-bold">
                {[
                  { id: 'dashboard', label: 'Overview' },
                  { id: 'attendance', label: 'Attendance' },
                  { id: 'leaves', label: 'Leave History' },
                  { id: 'profile', label: 'Profile' },
                  { id: 'payroll', label: 'Salary' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as NavTab)}
                    className={`px-3 py-1.5 rounded-lg transition-all ${
                      activeTab === tab.id
                        ? 'bg-[#6366f1] text-white glow-purple'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* View 1: Dashboard Overview */}
            {activeTab === 'dashboard' && (
              <DashboardOverview
                stats={{
                  ...mockDashboardStats,
                  pendingApprovalsCount: employeeLeaveRequests.filter((r) => r.status === 'Pending').length,
                }}
                role="employee"
                onNavigateTab={setActiveTab}
                onOpenLeaveModal={() => setIsLeaveModalOpen(true)}
              />
            )}

            {/* View 2: Attendance Tracker */}
            {activeTab === 'attendance' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold text-white">
                      Daily Attendance Tracker
                    </h1>
                    <p className="text-xs text-slate-400">
                      Clock in/out, view shift hours & punch logs in real time
                    </p>
                  </div>
                </div>
                <AttendanceWidget />
              </div>
            )}

            {/* View 3: Leave Application & History Table */}
            {activeTab === 'leaves' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold text-white">
                      My Leave Applications
                    </h1>
                    <p className="text-xs text-slate-400">
                      Apply for leave and track HR review status and remarks
                    </p>
                  </div>
                </div>
                <LeaveTable
                  leaveRequests={employeeLeaveRequests}
                  onOpenModal={() => setIsLeaveModalOpen(true)}
                  onCancelRequest={handleCancelLeave}
                />
              </div>
            )}

            {/* View 4: Profile View */}
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold text-white">
                      Employee Profile Card
                    </h1>
                    <p className="text-xs text-slate-400">
                      View and manage your personal employment record
                    </p>
                  </div>
                </div>
                <ProfileCard
                  user={userProfile}
                  onUpdateProfile={handleUpdateProfile}
                />
              </div>
            )}

            {/* View 5: Salary / Payroll Card */}
            {activeTab === 'payroll' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold text-white">
                      Salary & Payroll Breakdown
                    </h1>
                    <p className="text-xs text-slate-400">
                      Monthly earnings, allowances, deductions and pay slips
                    </p>
                  </div>
                </div>
                <PayrollCard payroll={payrollData} />
              </div>
            )}

            {/* Restricted Banner Info */}
            <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-900/50 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-indigo-400 shrink-0" />
                <div>
                  <p className="font-bold text-indigo-200">Role Notice: Employee Access Level</p>
                  <p className="text-slate-400 text-[11px]">
                    Employee account is restricted from accessing HR Approval workflows or altering other staff records. Switch role to HR Admin via top header to review requests.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </main>

        {/* Global Footer */}
        <footer className={`py-4 px-6 text-center text-xs text-slate-500 border-t border-slate-800 transition-all ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}>
          <span>© 2026 Dayflow HRMS. Built with Next.js (App Router), TypeScript & Tailwind CSS.</span>
        </footer>

      </div>

      {/* Global Leave Application Modal */}
      <LeaveRequestModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSubmit={(reqData) => {
          handleApplyLeave({
            ...reqData,
            employeeId: userProfile.id,
            employeeName: userProfile.fullName,
            employeeAvatar: userProfile.avatar,
            department: userProfile.department,
          });
          setIsLeaveModalOpen(false);
        }}
        userAvatar={userProfile.avatar}
        userName={userProfile.fullName}
      />

    </div>
  );
}
