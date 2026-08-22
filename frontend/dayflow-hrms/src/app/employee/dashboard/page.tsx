'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Clock, 
  Play, 
  Square, 
  Calendar, 
  FileText, 
  User, 
  Wallet, 
  CheckCircle2, 
  AlertCircle, 
  Plus, 
  X, 
  Building,
  Phone,
  Mail,
  MapPin,
  History,
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import LeaveManagementModal from '../../../components/LeaveManagementModal';
import AttendanceHistoryModal from '../../../components/AttendanceHistoryModal';
import ProfilePayrollModal from '../../../components/ProfilePayrollModal';

function EmployeeDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTabParam = searchParams.get('tab') || 'attendance';

  const { 
    user, 
    role, 
    isAuthenticated, 
    isLoading, 
    attendanceLogs, 
    leaveRequests, 
    isClockedIn, 
    clockInTime, 
    clockIn, 
    clockOut 
  } = useAuth();

  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Active section tab control (Attendance Tracker, Leave Applications, My Profile, Salary & Payroll)
  const [activeSection, setActiveSection] = useState<string>(activeTabParam);

  useEffect(() => {
    if (activeTabParam) {
      setActiveSection(activeTabParam);
    }
  }, [activeTabParam]);

  // Interactive Modals State
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Live Timer
  const [currentTime, setCurrentTime] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Auth Protection Guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b1120] text-slate-100 flex items-center justify-center p-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading Employee Workspace...</span>
        </div>
      </div>
    );
  }

  // Handle Clock In / Out Toggle with dynamic feedback
  const handleClockToggle = () => {
    if (isClockedIn) {
      clockOut();
    } else {
      clockIn();
    }
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Sidebar Navigation (Role Isolated for Employee) */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
      />

      {/* Main Content View */}
      <div className={`flex-1 flex flex-col transition-all duration-300 ${
        isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        
        {/* Header */}
        <Header
          setIsOpenMobile={setIsOpenMobile}
          isCollapsed={isCollapsed}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl w-full mx-auto">
          
          {/* Welcome Banner */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-purple-950/80 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Employee Portal Active
                </span>
                <span className="text-xs text-slate-400 font-mono">ID: {user?.employeeCode || 'DF-8902'}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Welcome back, {user?.fullName || 'Sarah Jenkins'}!
              </h1>
              <p className="text-xs text-slate-400">
                {user?.designation || 'Senior UX Designer'} • {user?.department || 'Product & Design'}
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setShowLeaveModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#6366f1] hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg glow-purple shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Apply New Leave</span>
              </button>

              <button
                onClick={() => setShowProfileModal(true)}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all shrink-0"
              >
                <User className="w-4 h-4 text-indigo-400" />
                <span>Profile & Payroll</span>
              </button>
            </div>
          </div>

          {/* TAB SECTION SWITCHER BAR */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-1 overflow-x-auto">
            <button
              onClick={() => setActiveSection('attendance')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSection === 'attendance'
                  ? 'bg-indigo-600 text-white shadow-md glow-purple'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Attendance Tracker</span>
            </button>

            <button
              onClick={() => setActiveSection('leaves')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSection === 'leaves'
                  ? 'bg-indigo-600 text-white shadow-md glow-purple'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Leave Applications</span>
            </button>

            <button
              onClick={() => setActiveSection('profile')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSection === 'profile'
                  ? 'bg-indigo-600 text-white shadow-md glow-purple'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => {
                setActiveSection('payroll');
                setShowProfileModal(true);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeSection === 'payroll'
                  ? 'bg-indigo-600 text-white shadow-md glow-purple'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Salary & Payroll</span>
            </button>
          </div>

          {/* GRID LAYOUT: ATTENDANCE CLOCK WIDGET & PROFILE CARD */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ATTENDANCE CLOCK IN / OUT WIDGET */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Attendance Tracker</h2>
                    <p className="text-xs text-slate-400">Log daily work hours & break sessions</p>
                  </div>
                </div>
                
                <span className="text-xs font-mono font-bold text-indigo-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  {currentTime || '01:29:00 PM'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Punch In Time</span>
                  <p className="text-lg font-mono font-bold text-emerald-400">
                    {isClockedIn ? (clockInTime || '09:00 AM') : 'NOT CHECKED IN'}
                  </p>
                  <span className="text-[10px] text-slate-500">Shift Schedule: 09:00 AM</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Current Shift Status</span>
                  <p className="text-sm font-bold text-indigo-300 flex items-center gap-1.5 pt-1">
                    <span className={`w-2.5 h-2.5 rounded-full ${isClockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`} />
                    {isClockedIn ? 'ON SHIFT (CLOCKED IN)' : 'NOT CHECKED IN'}
                  </p>
                  <span className="text-[10px] text-slate-500">Standard 8h Shift</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Work Duration</span>
                  <p className="text-lg font-mono font-bold text-white">
                    {isClockedIn ? '5h 30m' : '0h 00m'}
                  </p>
                  <span className="text-[10px] text-emerald-400">Target: 8h 00m</span>
                </div>
              </div>

              {/* Clock Action Toggle Button */}
              <div className="pt-2">
                <button
                  onClick={handleClockToggle}
                  className={`w-full py-4 px-6 rounded-2xl text-white font-extrabold text-sm flex items-center justify-center gap-2.5 transition-all shadow-xl ${
                    isClockedIn
                      ? 'bg-rose-600 hover:bg-rose-700 glow-rose'
                      : 'bg-[#6366f1] hover:bg-indigo-600 glow-purple'
                  }`}
                >
                  {isClockedIn ? (
                    <>
                      <Square className="w-4 h-4 fill-white" />
                      <span>Clock Out & End Break Session</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-white" />
                      <span>Clock In Now</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* PROFILE CARD VIEW */}
            <div 
              onClick={() => {
                setActiveSection('payroll');
                setShowProfileModal(true);
              }}
              className="bg-slate-900/80 border border-slate-800 hover:border-indigo-500/50 rounded-3xl p-6 shadow-xl space-y-4 cursor-pointer transition-all group"
            >
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Profile Details</h3>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.fullName || 'Sarah'}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-indigo-500/40"
                />
                <div>
                  <h4 className="text-sm font-bold text-white">{user?.fullName || 'Sarah Jenkins'}</h4>
                  <p className="text-xs text-slate-400">{user?.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-bold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded-md border border-indigo-800">
                    {user?.department || 'Product & Design'}
                  </span>
                </div>
              </div>

              <div className="space-y-2 text-xs divide-y divide-slate-800/60 pt-1">
                <div className="py-1.5 flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-500" /> Phone</span>
                  <span className="text-slate-200 font-semibold">{user?.phone || '+1 (555) 234-5678'}</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-500" /> Location</span>
                  <span className="text-slate-200 font-semibold">{user?.location || 'San Francisco, CA'}</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5 text-slate-500" /> Joined</span>
                  <span className="text-slate-200 font-semibold">{user?.joinDate || '15 Jan 2022'}</span>
                </div>
              </div>

              {/* Inline trigger requested by user */}
              <div 
                onClick={(e) => {
                  e.stopPropagation();
                  setShowProfileModal(true);
                }}
                className="pt-2 text-center text-[11px] text-indigo-400 hover:text-indigo-300 font-bold transition-colors underline"
              >
                Click to view Salary & Payroll statement →
              </div>
            </div>

          </div>

          {/* TABLES SECTION: ATTENDANCE HISTORY & LEAVE HISTORY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* ATTENDANCE HISTORY TABLE */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Attendance History</h3>
                </div>
                <button
                  onClick={() => setShowAttendanceModal(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Open Calendar Picker</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Clock In</th>
                      <th className="pb-2">Clock Out</th>
                      <th className="pb-2">Hours</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {attendanceLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 font-mono text-slate-300">{log.date}</td>
                        <td className="py-2.5 font-mono text-emerald-400">{log.clockIn}</td>
                        <td className="py-2.5 font-mono text-slate-400">{log.clockOut || 'Shift Active'}</td>
                        <td className="py-2.5 font-mono text-slate-200">{log.workHours}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.status === 'PRESENT'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800'
                          }`}>
                            {log.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MY LEAVE REQUESTS TABLE */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-bold text-white">Leave Application Form & Logs</h3>
                </div>
                <button
                  onClick={() => setShowLeaveModal(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 hover:underline"
                >
                  <span>Open Leave Modal</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-2">Leave Type</th>
                      <th className="pb-2">Dates</th>
                      <th className="pb-2">Days</th>
                      <th className="pb-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {leaveRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-800/40">
                        <td className="py-2.5 font-bold text-slate-200">{req.leaveType}</td>
                        <td className="py-2.5 text-slate-400 text-[11px] font-mono">{req.startDate} to {req.endDate}</td>
                        <td className="py-2.5 font-mono text-indigo-300">{req.totalDays}d</td>
                        <td className="py-2.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            req.status === 'APPROVED' || req.status === 'Approved'
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                              : req.status === 'REJECTED' || req.status === 'Rejected'
                              ? 'bg-rose-950 text-rose-300 border border-rose-800'
                              : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                          }`}>
                            {req.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

        </main>
      </div>

      {/* INTERACTIVE WORKFLOW OVERLAY MODALS */}
      <LeaveManagementModal
        isOpen={showLeaveModal}
        onClose={() => setShowLeaveModal(false)}
      />

      <AttendanceHistoryModal
        isOpen={showAttendanceModal}
        onClose={() => setShowAttendanceModal(false)}
      />

      <ProfilePayrollModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />

    </div>
  );
}

export default function EmployeeDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0b1120] text-slate-100 flex items-center justify-center p-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading Employee Workspace...</span>
        </div>
      </div>
    }>
      <EmployeeDashboardContent />
    </Suspense>
  );
}
