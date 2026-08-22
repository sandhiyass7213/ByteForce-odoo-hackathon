'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Award,
  Phone,
  Mail,
  MapPin,
  TrendingUp,
  History
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';

export default function EmployeeDashboardPage() {
  const router = useRouter();
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

  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Leave Form State
  const [showLeaveModal, setShowLeaveModal] = useState<boolean>(false);
  const [leaveType, setLeaveType] = useState<string>('Annual Leave');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [formMsg, setFormMsg] = useState<string>('');

  // Clock Timer Simulation
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

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      setFormMsg('Please fill in all required leave details.');
      return;
    }

    submitLeaveRequest({ leaveType, startDate, endDate, reason });
    setFormMsg('');
    setShowLeaveModal(false);
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      
      {/* Sidebar Navigation (HR/Admin menus completely HIDDEN) */}
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
                Welcome back, {user?.fullName || 'Sarah'}!
              </h1>
              <p className="text-xs text-slate-400">
                {user?.designation || 'Senior UX Designer'} • {user?.department || 'Product & Design'}
              </p>
            </div>

            <button
              onClick={() => setShowLeaveModal(true)}
              className="px-4 py-2.5 rounded-xl bg-[#6366f1] hover:bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg glow-purple shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Apply New Leave</span>
            </button>
          </div>

          {/* Grid Layout: Attendance Clock Widget & Profile Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* ATTENDANCE CLOCK IN / OUT WIDGET */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Daily Attendance Tracker</h2>
                    <p className="text-xs text-slate-400">Log shifts, track work hours, and punch status</p>
                  </div>
                </div>
                
                <span className="text-xs font-mono font-bold text-indigo-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800">
                  {currentTime || '09:30:00 AM'}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Punch In Time</span>
                  <p className="text-lg font-mono font-bold text-emerald-400">{isClockedIn ? (clockInTime || '09:00 AM') : '--:--'}</p>
                  <span className="text-[10px] text-slate-500">Scheduled: 09:00 AM</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Current Shift Status</span>
                  <p className="text-sm font-bold text-indigo-300 flex items-center gap-1.5 pt-1">
                    <span className={`w-2 h-2 rounded-full ${isClockedIn ? 'bg-emerald-500 animate-pulse' : 'bg-slate-500'}`} />
                    {isClockedIn ? 'ON SHIFT (CLOCKED IN)' : 'CLOCKED OUT'}
                  </p>
                  <span className="text-[10px] text-slate-500">Standard 8h Shift</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-1">
                  <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">Work Hours Today</span>
                  <p className="text-lg font-mono font-bold text-white">{isClockedIn ? '5h 30m' : '0h 00m'}</p>
                  <span className="text-[10px] text-emerald-400">Target: 8h 00m</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2">
                {isClockedIn ? (
                  <button
                    onClick={clockOut}
                    className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg glow-rose"
                  >
                    <Square className="w-4 h-4 fill-white" />
                    <span>Clock Out & End Shift</span>
                  </button>
                ) : (
                  <button
                    onClick={clockIn}
                    className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-lg glow-emerald"
                  >
                    <Play className="w-4 h-4 fill-white" />
                    <span>Clock In & Start Shift</span>
                  </button>
                )}
              </div>
            </div>

            {/* PROFILE CARD VIEW */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-3 border-b border-slate-800/80 pb-3">
                <User className="w-5 h-5 text-indigo-400" />
                <h3 className="text-sm font-bold text-white">Employee Profile Card</h3>
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
                    {user?.department}
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
            </div>

          </div>

          {/* TABLES SECTION: ATTENDANCE HISTORY & LEAVE HISTORY */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* ATTENDANCE HISTORY TABLE */}
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <History className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">My Attendance Logs</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Recent 30 Days</span>
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
                        <td className="py-2.5 font-mono text-slate-400">{log.clockOut || 'Active'}</td>
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
                  <h3 className="text-sm font-bold text-white">My Leave Applications</h3>
                </div>
                <button
                  onClick={() => setShowLeaveModal(true)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-bold underline"
                >
                  + Apply
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
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
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

      {/* APPLY LEAVE MODAL */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                Submit Leave Application
              </h3>
              <button onClick={() => setShowLeaveModal(false)} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formMsg && (
              <p className="text-xs text-rose-400 bg-rose-950/50 p-2 rounded-xl border border-rose-800">{formMsg}</p>
            )}

            <form onSubmit={handleLeaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase text-[10px] mb-1">Leave Type</label>
                <select
                  value={leaveType}
                  onChange={(e) => setLeaveType(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:ring-2 focus:ring-[#6366f1]"
                >
                  <option value="Annual Leave">Annual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Maternity Leave">Maternity Leave</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-300 uppercase text-[10px] mb-1">Start Date</label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:ring-2 focus:ring-[#6366f1]"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-300 uppercase text-[10px] mb-1">End Date</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:ring-2 focus:ring-[#6366f1]"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase text-[10px] mb-1">Reason for Leave</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide reason for request..."
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
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
        </div>
      )}

    </div>
  );
}
