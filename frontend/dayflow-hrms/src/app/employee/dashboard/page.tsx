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
  Download,
  DollarSign,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';
import LeaveManagementModal from '../../../components/LeaveManagementModal';
import AttendanceHistoryModal from '../../../components/AttendanceHistoryModal';
import ProfilePayrollModal from '../../../components/ProfilePayrollModal';

type TabType = 'attendance' | 'leaves' | 'profile' | 'payroll';

function EmployeeDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as TabType) || 'attendance';

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
    clockOut,
    submitLeaveRequest 
  } = useAuth();

  // Tab State
  const [activeTab, setActiveTab] = useState<TabType>(initialTab);

  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Modals state
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState<boolean>(false);
  const [showProfileModal, setShowProfileModal] = useState<boolean>(false);

  // Inline Leave Form State (for 'leaves' tab view)
  const [leaveTypeInline, setLeaveTypeInline] = useState('Annual Leave');
  const [startDateInline, setStartDateInline] = useState('');
  const [endDateInline, setEndDateInline] = useState('');
  const [reasonInline, setReasonInline] = useState('');
  const [formMsgInline, setFormMsgInline] = useState('');

  // Live Clock
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

  // Handle Clock Toggle
  const handleClockToggle = () => {
    if (isClockedIn) {
      clockOut();
    } else {
      clockIn();
    }
  };

  // Handle Inline Leave Form Submit
  const handleInlineLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDateInline || !endDateInline || !reasonInline) {
      setFormMsgInline('Please complete all required fields.');
      return;
    }
    submitLeaveRequest({
      leaveType: leaveTypeInline,
      startDate: startDateInline,
      endDate: endDateInline,
      reason: reasonInline
    });
    setFormMsgInline('Leave request submitted successfully!');
    setStartDateInline('');
    setEndDateInline('');
    setReasonInline('');
    setTimeout(() => setFormMsgInline(''), 3000);
  };

  // Mock Payslips data for Payroll view
  const payslips = [
    { month: 'July 2026', gross: '$5,000.00', tax: '$300.00', net: '$4,700.00', status: 'Paid' },
    { month: 'June 2026', gross: '$5,000.00', tax: '$300.00', net: '$4,700.00', status: 'Paid' },
    { month: 'May 2026', gross: '$5,000.00', tax: '$300.00', net: '$4,700.00', status: 'Paid' },
    { month: 'April 2026', gross: '$5,000.00', tax: '$300.00', net: '$4,700.00', status: 'Paid' },
  ];

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Sidebar Navigation */}
      <Sidebar
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        activeTab={activeTab}
        onTabChange={(tabId: TabType) => setActiveTab(tabId)}
      />

      {/* Main Content Area */}
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
                  Employee Workspace
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

            {/* Quick Action Switches */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowLeaveModal(true)}
                className="px-4 py-2.5 rounded-xl bg-[#6366f1] hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg glow-purple shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Apply New Leave</span>
              </button>

              <button
                onClick={() => setActiveTab('payroll')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all shrink-0"
              >
                <Wallet className="w-4 h-4 text-indigo-400" />
                <span>View Payslips</span>
              </button>
            </div>
          </div>

          {/* TAB NAVIGATION SWITCHER BAR */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'attendance'
                  ? 'bg-[#6366f1] text-white shadow-lg glow-purple'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Clock className="w-4 h-4" />
              <span>Attendance Tracker</span>
            </button>

            <button
              onClick={() => setActiveTab('leaves')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'leaves'
                  ? 'bg-[#6366f1] text-white shadow-lg glow-purple'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Leave Applications</span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'profile'
                  ? 'bg-[#6366f1] text-white shadow-lg glow-purple'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>My Profile</span>
            </button>

            <button
              onClick={() => setActiveTab('payroll')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'payroll'
                  ? 'bg-[#6366f1] text-white shadow-lg glow-purple'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Wallet className="w-4 h-4" />
              <span>Salary & Payroll</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: ATTENDANCE TRACKER VIEW */}
          {/* ========================================================================= */}
          {activeTab === 'attendance' && (
            <div className="space-y-6 animate-in fade-in">
              {/* ATTENDANCE CLOCK IN / OUT WIDGET */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Daily Shift Attendance Tracker</h2>
                      <p className="text-xs text-slate-400">Log daily shift punch times & break sessions</p>
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
                    <span className="text-[10px] text-slate-500">Scheduled: 09:00 AM</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                    <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Shift Status</span>
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

                {/* Clock Toggle Button */}
                <div>
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

              {/* ATTENDANCE HISTORY TABLE */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <History className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">Attendance Logs & Roster</h3>
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
                          <td className="py-3 font-mono text-slate-300">{log.date}</td>
                          <td className="py-3 font-mono text-emerald-400">{log.clockIn}</td>
                          <td className="py-3 font-mono text-slate-400">{log.clockOut || 'Shift Active'}</td>
                          <td className="py-3 font-mono text-slate-200">{log.workHours}</td>
                          <td className="py-3">
                            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
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
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: LEAVE APPLICATIONS VIEW */}
          {/* ========================================================================= */}
          {activeTab === 'leaves' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-in fade-in">
              
              {/* LEAVE APPLICATION FORM CARD */}
              <div className="lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <Calendar className="w-5 h-5 text-indigo-400" />
                  <div>
                    <h3 className="text-sm font-bold text-white">Leave Application Form</h3>
                    <p className="text-[11px] text-slate-400">Request formal leave approval</p>
                  </div>
                </div>

                {formMsgInline && (
                  <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-emerald-300 text-xs font-semibold">
                    {formMsgInline}
                  </div>
                )}

                <form onSubmit={handleInlineLeaveSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="block font-bold text-slate-300 uppercase text-[10px] mb-1">Leave Type</label>
                    <select
                      value={leaveTypeInline}
                      onChange={(e) => setLeaveTypeInline(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:ring-2 focus:ring-[#6366f1]"
                    >
                      <option value="Annual Leave">Annual Leave</option>
                      <option value="Sick Leave">Sick Leave</option>
                      <option value="Casual Leave">Casual Leave</option>
                      <option value="Maternity Leave">Maternity Leave</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase text-[10px] mb-1">Start Date</label>
                    <input
                      type="date"
                      required
                      value={startDateInline}
                      onChange={(e) => setStartDateInline(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:ring-2 focus:ring-[#6366f1]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase text-[10px] mb-1">End Date</label>
                    <input
                      type="date"
                      required
                      value={endDateInline}
                      onChange={(e) => setEndDateInline(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:ring-2 focus:ring-[#6366f1]"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-300 uppercase text-[10px] mb-1">Reason for Leave</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Add reason or justification..."
                      value={reasonInline}
                      onChange={(e) => setReasonInline(e.target.value)}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:ring-2 focus:ring-[#6366f1]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-[#6366f1] hover:bg-indigo-600 text-white font-extrabold rounded-xl shadow-lg glow-purple transition-all"
                  >
                    Submit Application
                  </button>
                </form>
              </div>

              {/* LEAVE HISTORY TABLE CARD */}
              <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <h3 className="text-sm font-bold text-white">Leave Status & Application Logs</h3>
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
                        <th className="pb-2">Date Range</th>
                        <th className="pb-2">Days</th>
                        <th className="pb-2">Reason</th>
                        <th className="pb-2">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {leaveRequests.map((req) => (
                        <tr key={req.id} className="hover:bg-slate-800/40">
                          <td className="py-3 font-bold text-white">{req.leaveType}</td>
                          <td className="py-3 text-slate-400 text-[11px] font-mono">{req.startDate} to {req.endDate}</td>
                          <td className="py-3 font-mono text-indigo-300">{req.totalDays}d</td>
                          <td className="py-3 text-slate-300 max-w-xs truncate">{req.reason}</td>
                          <td className="py-3">
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
          )}

          {/* ========================================================================= */}
          {/* TAB 3: MY PROFILE VIEW */}
          {/* ========================================================================= */}
          {activeTab === 'profile' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400">
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Employee Profile Details</h2>
                    <p className="text-xs text-slate-400">Personal information, designation, & employment credentials</p>
                  </div>
                </div>

                <button
                  onClick={() => setActiveTab('payroll')}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold underline"
                >
                  Click to view Salary & Payroll statement →
                </button>
              </div>

              {/* Profile Card Header */}
              <div className="flex flex-col md:flex-row items-center gap-6 p-6 rounded-2xl bg-slate-950/70 border border-slate-800">
                <img
                  src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                  alt={user?.fullName || 'Sarah'}
                  className="w-24 h-24 rounded-3xl object-cover ring-4 ring-indigo-500/40 shadow-xl"
                />
                <div className="space-y-1 text-center md:text-left">
                  <h3 className="text-xl font-black text-white">{user?.fullName || 'Sarah Jenkins'}</h3>
                  <p className="text-sm text-indigo-300 font-medium">{user?.designation || 'Senior UX Designer'}</p>
                  <p className="text-xs text-slate-400">{user?.department || 'Product & Design'} • ID: {user?.employeeCode || 'DF-8902'}</p>
                  
                  <div className="pt-2 flex items-center justify-center md:justify-start gap-2">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      Full-Time Employee
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-950 text-indigo-300 border border-indigo-800">
                      Product Design Team
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Specs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-xs">
                <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-indigo-400" /> Email Address
                  </span>
                  <p className="text-slate-100 font-bold text-sm truncate">{user?.email}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-indigo-400" /> Phone Contact
                  </span>
                  <p className="text-slate-100 font-bold text-sm">{user?.phone || '+1 (555) 234-5678'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-indigo-400" /> Office Location
                  </span>
                  <p className="text-slate-100 font-bold text-sm">{user?.location || 'San Francisco, CA'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-indigo-400" /> Date Joined
                  </span>
                  <p className="text-slate-100 font-bold text-sm">{user?.joinDate || '06/15/2023'}</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-indigo-400" /> Role & Rank
                  </span>
                  <p className="text-slate-100 font-bold text-sm">Level 4 UX Specialist</p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/50 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> Emergency Contact
                  </span>
                  <p className="text-slate-100 font-bold text-sm">+1 (555) 987-6543 (Spouse)</p>
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: SALARY & PAYROLL VIEW */}
          {/* ========================================================================= */}
          {activeTab === 'payroll' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* SALARY SUMMARY CARD */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-indigo-950/90 via-slate-900 to-purple-950/90 border border-indigo-800/60 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-indigo-800/40 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-400">
                      <Wallet className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-white">Monthly Salary Breakdown Statement</h2>
                      <p className="text-xs text-slate-400">Active monthly earnings and payroll deductions</p>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-950 text-emerald-300 border border-emerald-800">
                    Active Payroll
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Gross Basic Salary</span>
                    <p className="text-xl font-mono font-bold text-white">$5,000.00</p>
                    <span className="text-[10px] text-slate-500">Monthly Compensation</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Salary Tax & Deductions</span>
                    <p className="text-xl font-mono font-bold text-rose-400">-$300.00</p>
                    <span className="text-[10px] text-slate-500">Federal Tax & Benefits</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Net Total Monthly Salary</span>
                    <p className="text-xl font-mono font-black text-emerald-400">$4,700.00</p>
                    <span className="text-[10px] text-emerald-400">Direct Deposit Active</span>
                  </div>
                </div>
              </div>

              {/* PAYSLIP DOWNLOAD & PAYROLL HISTORY TABLE */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-sm font-bold text-white">Payslip History & Downloads</h3>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono">2026 Tax Year</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="pb-3">Month Period</th>
                        <th className="pb-3">Gross Salary</th>
                        <th className="pb-3">Deductions</th>
                        <th className="pb-3">Net Salary</th>
                        <th className="pb-3">Status</th>
                        <th className="pb-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      {payslips.map((pay, idx) => (
                        <tr key={idx} className="hover:bg-slate-800/40">
                          <td className="py-3 font-bold text-white">{pay.month}</td>
                          <td className="py-3 font-mono text-slate-300">{pay.gross}</td>
                          <td className="py-3 font-mono text-rose-400">{pay.tax}</td>
                          <td className="py-3 font-mono text-emerald-400 font-bold">{pay.net}</td>
                          <td className="py-3">
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                              {pay.status}
                            </span>
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => alert(`Downloading Payslip PDF for ${pay.month}...`)}
                              className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 text-indigo-300 border border-slate-800 font-bold text-[11px] inline-flex items-center gap-1.5 transition-all"
                            >
                              <Download className="w-3.5 h-3.5" />
                              <span>Download PDF</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* OVERLAY MODALS */}
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
