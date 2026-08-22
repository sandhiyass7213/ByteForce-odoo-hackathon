'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle, 
  ShieldCheck, 
  Search, 
  TrendingUp, 
  Building2, 
  FileText, 
  Check, 
  X,
  MessageSquare,
  UserCheck
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { 
    user, 
    role, 
    isAuthenticated, 
    isLoading, 
    leaveRequests, 
    attendanceLogs, 
    approveLeaveRequest, 
    rejectLeaveRequest 
  } = useAuth();

  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  const [searchDirectory, setSearchDirectory] = useState<string>('');

  // Review Comment Modal State
  const [activeReqId, setActiveReqId] = useState<string | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT' | null>(null);
  const [comment, setComment] = useState<string>('');

  // Strict RBAC Route Protection Guard
  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (role !== 'HR_ADMIN') {
        router.push('/employee/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, role, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b1120] text-slate-100 flex items-center justify-center p-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading HR Admin Governance Suite...</span>
        </div>
      </div>
    );
  }

  // HR Analytics Metrics
  const totalStaff = 48;
  const presentToday = attendanceLogs.filter((a) => a.status === 'PRESENT').length + 38;
  const pendingRequests = leaveRequests.filter((r) => r.status === 'PENDING' || r.status === 'Pending');
  const approvedRequestsCount = leaveRequests.filter((r) => r.status === 'APPROVED' || r.status === 'Approved').length;

  // Mock Staff Roster matching diagram
  const staffDirectory = [
    { name: 'Sarah Jenkins', role: 'Employee', joined: '06/15/2023', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { name: 'Alex Mercer', role: 'Employee', joined: '01/10/2022', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { name: 'David Chen', role: 'Trainee', joined: '04/01/2024', status: 'On Shift', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { name: 'Elena Rostova', role: 'HR Admin', joined: '03/10/2021', status: 'Director', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  ];

  const filteredDirectory = staffDirectory.filter((s) =>
    s.name.toLowerCase().includes(searchDirectory.toLowerCase()) ||
    s.role.toLowerCase().includes(searchDirectory.toLowerCase())
  );

  const handleActionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeReqId || !actionType) return;

    if (actionType === 'APPROVE') {
      approveLeaveRequest(activeReqId, comment || 'Approved by HR Director');
    } else {
      rejectLeaveRequest(activeReqId, comment || 'Rejected by HR Director');
    }

    setActiveReqId(null);
    setActionType(null);
    setComment('');
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col selection:bg-amber-500 selection:text-slate-950">
      
      {/* Sidebar Navigation */}
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
          
          {/* Welcome Header */}
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/60 via-slate-900 to-purple-950/60 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  HR Admin Governance Active
                </span>
                <span className="text-xs text-slate-400 font-mono">HR-1001</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                HR Executive Suite - {user?.fullName || 'Elena Rostova'}
              </h1>
              <p className="text-xs text-slate-400">
                Company-wide leave workflow management, roster analytics, and attendance control
              </p>
            </div>

            <div className="flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold shrink-0">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>HR Admin Privilege Granted</span>
            </div>
          </div>

          {/* HR ANALYTICS OVERVIEW CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Staff</span>
                <div className="p-2 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-white">{totalStaff}</p>
              <p className="text-[11px] text-emerald-400 font-medium">98% Active Employment</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Present Today</span>
                <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-emerald-400">{presentToday}</p>
              <p className="text-[11px] text-slate-400 font-medium">Punch Ratio: 91.6%</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Pending Requests</span>
                <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800">
                  <AlertCircle className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-amber-400">{pendingRequests.length}</p>
              <p className="text-[11px] text-amber-300 font-medium">Requires Immediate Action</p>
            </div>

            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-2">
              <div className="flex items-center justify-between text-slate-400">
                <span className="text-xs font-bold uppercase tracking-wider">Approved Logs</span>
                <div className="p-2 rounded-xl bg-purple-950 text-purple-400 border border-purple-800">
                  <FileText className="w-4 h-4" />
                </div>
              </div>
              <p className="text-3xl font-black text-purple-300">{approvedRequestsCount}</p>
              <p className="text-[11px] text-slate-400 font-medium">Processed Leave Log</p>
            </div>

          </div>

          {/* GRID: EMPLOYEE DIRECTORY & LEAVE REQUESTS APPROVAL */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* EMPLOYEE DIRECTORY CARD (Diagram Middle Right) */}
            <div className="lg:col-span-1 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-sm font-bold text-white">Employee Directory</h3>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">4 Members</span>
              </div>

              {/* Search Field */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search staff, role..."
                  value={searchDirectory}
                  onChange={(e) => setSearchDirectory(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="divide-y divide-slate-800/60">
                {filteredDirectory.map((staff, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between hover:bg-slate-800/40 px-1 rounded-xl transition-colors">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={staff.avatar} alt={staff.name} className="w-8 h-8 rounded-xl object-cover ring-1 ring-slate-700" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-100 truncate">{staff.name}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{staff.joined}</p>
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                      staff.role === 'HR Admin'
                        ? 'bg-amber-950 text-amber-300 border border-amber-800'
                        : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                    }`}>
                      {staff.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* LEAVE APPROVAL TABLE */}
            <div className="lg:col-span-2 bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800/80 pb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-950/60 border border-amber-800/60 text-amber-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Leave Requests Approval</h2>
                    <p className="text-xs text-slate-400">Review, approve, or reject employee applications</p>
                  </div>
                </div>

                <span className="text-xs font-bold bg-slate-950 text-amber-300 px-3 py-1.5 rounded-xl border border-slate-800">
                  {pendingRequests.length} Pending
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-3">Applicant</th>
                      <th className="pb-3">Leave Type</th>
                      <th className="pb-3">Dates</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Quick Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {leaveRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-800/40">
                        <td className="py-3 font-bold text-white">
                          <p className="text-slate-100">{req.userName}</p>
                          <p className="text-[10px] text-slate-400 font-normal">{req.userRole || 'Staff Member'}</p>
                        </td>
                        <td className="py-3 text-indigo-300 font-semibold">{req.leaveType}</td>
                        <td className="py-3 font-mono text-slate-400 text-[11px]">{req.startDate} to {req.endDate}</td>
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
                        <td className="py-3 text-right">
                          {(req.status === 'PENDING' || req.status === 'Pending') ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setActiveReqId(req.id);
                                  setActionType('APPROVE');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-md glow-emerald"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveReqId(req.id);
                                  setActionType('REJECT');
                                }}
                                className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-md"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-mono italic">
                              Reviewed
                            </span>
                          )}
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

      {/* HR ACTION COMMENT MODAL */}
      {activeReqId && actionType && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-amber-400" />
                {actionType === 'APPROVE' ? 'Approve Leave Request' : 'Reject Leave Request'}
              </h3>
              <button onClick={() => { setActiveReqId(null); setActionType(null); }} className="p-1 rounded-lg text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleActionSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-300 uppercase text-[10px] mb-1">
                  HR Admin Remark / Feedback
                </label>
                <textarea
                  rows={3}
                  placeholder={actionType === 'APPROVE' ? 'e.g. Approved. Please ensure handoff before leave.' : 'e.g. Rejected due to critical project release dates.'}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <button
                type="submit"
                className={`w-full py-3 font-extrabold rounded-xl text-white shadow-lg transition-all ${
                  actionType === 'APPROVE'
                    ? 'bg-emerald-600 hover:bg-emerald-700 glow-emerald'
                    : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {actionType === 'APPROVE' ? 'Approval' : 'Rejection'}
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
