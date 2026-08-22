'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  UserCheck,
  LayoutDashboard,
  Shield,
  Lock,
  Activity,
  UserPlus,
  Sliders,
  Filter
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import Header from '../../../components/Header';
import Sidebar from '../../../components/Sidebar';

type AdminTabType = 'analytics' | 'approvals' | 'directory' | 'governance';

function AdminDashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get('tab') as AdminTabType) || 'analytics';

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

  // Active Tab State
  const [activeTab, setActiveTab] = useState<AdminTabType>(initialTab);

  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);
  
  // Search & Filter States
  const [searchDirectory, setSearchDirectory] = useState<string>('');
  const [approvalFilter, setApprovalFilter] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');

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

  // Mock Expanded Staff Roster
  const staffDirectory = [
    { id: 'EMP-001', name: 'Sarah Jenkins', role: 'Employee', designation: 'Senior UX Designer', dept: 'Product & Design', email: 'sarah.j@dayflow.io', phone: '+1 (555) 234-5678', joined: '06/15/2023', status: 'Active', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80' },
    { id: 'EMP-002', name: 'Alex Mercer', role: 'Employee', designation: 'Lead Frontend Engineer', dept: 'Engineering', email: 'alex.m@dayflow.io', phone: '+1 (555) 345-6789', joined: '01/10/2022', status: 'Active', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
    { id: 'EMP-003', name: 'David Chen', role: 'Trainee', designation: 'QA Engineering Intern', dept: 'Quality Assurance', email: 'david.c@dayflow.io', phone: '+1 (555) 456-7890', joined: '04/01/2024', status: 'On Shift', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
    { id: 'ADM-101', name: 'Elena Rostova', role: 'HR Admin', designation: 'Director of Human Resources', dept: 'People Operations', email: 'elena.rostova@dayflow.io', phone: '+1 (555) 890-1234', joined: '03/10/2021', status: 'Director', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
    { id: 'EMP-005', name: 'Marcus Vance', role: 'Employee', designation: 'Product Operations Manager', dept: 'Product Operations', email: 'marcus.v@dayflow.io', phone: '+1 (555) 567-8901', joined: '09/20/2022', status: 'Active', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
  ];

  const filteredDirectory = staffDirectory.filter((s) =>
    s.name.toLowerCase().includes(searchDirectory.toLowerCase()) ||
    s.role.toLowerCase().includes(searchDirectory.toLowerCase()) ||
    s.dept.toLowerCase().includes(searchDirectory.toLowerCase()) ||
    s.designation.toLowerCase().includes(searchDirectory.toLowerCase())
  );

  // Filter Leave Requests
  const filteredLeaveRequests = leaveRequests.filter((req) => {
    if (approvalFilter === 'PENDING') return req.status === 'PENDING' || req.status === 'Pending';
    if (approvalFilter === 'APPROVED') return req.status === 'APPROVED' || req.status === 'Approved';
    if (approvalFilter === 'REJECTED') return req.status === 'REJECTED' || req.status === 'Rejected';
    return true;
  });

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
        activeTab={activeTab}
        onTabChange={(tabId: AdminTabType) => setActiveTab(tabId)}
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
          <div className="p-6 rounded-3xl bg-gradient-to-r from-amber-950/70 via-slate-900 to-purple-950/70 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  HR Admin Governance Suite
                </span>
                <span className="text-xs text-slate-400 font-mono">HR-1001</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                HR Executive Portal - {user?.fullName || 'Elena Rostova'}
              </h1>
              <p className="text-xs text-slate-400">
                Company-wide leave workflow management, roster analytics, and attendance control
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <button
                onClick={() => setActiveTab('approvals')}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-lg glow-amber shrink-0"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Review Pending ({pendingRequests.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('directory')}
                className="px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all shrink-0"
              >
                <UserCheck className="w-4 h-4 text-amber-400" />
                <span>Staff Roster</span>
              </button>
            </div>
          </div>

          {/* TAB NAVIGATION SWITCHER BAR */}
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'analytics'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg glow-amber'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>HR Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('approvals')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'approvals'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg glow-amber'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Leave Approvals</span>
              {pendingRequests.length > 0 && (
                <span className="px-1.5 py-0.5 rounded-full text-[9px] font-extrabold bg-amber-950 text-amber-300 border border-amber-800">
                  {pendingRequests.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('directory')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'directory'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg glow-amber'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Employee Directory</span>
            </button>

            <button
              onClick={() => setActiveTab('governance')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTab === 'governance'
                  ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg glow-amber'
                  : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Admin Governance</span>
            </button>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: HR ANALYTICS VIEW */}
          {/* ========================================================================= */}
          {activeTab === 'analytics' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* METRICS OVERVIEW CARDS */}
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

              {/* DETAILED CHARTS & DEPARTMENT ATTENDANCE RATIOS */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-bold text-white">Department Attendance Ratios</h3>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Live Sync</span>
                  </div>

                  <div className="space-y-3 text-xs">
                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span className="text-slate-300">Engineering & Technology</span>
                        <span className="text-emerald-400 font-bold">94%</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2">
                        <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '94%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span className="text-slate-300">Product & Design</span>
                        <span className="text-indigo-400 font-bold">96%</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2">
                        <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '96%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span className="text-slate-300">Operations & Logistics</span>
                        <span className="text-amber-400 font-bold">90%</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2">
                        <div className="bg-amber-500 h-2 rounded-full" style={{ width: '90%' }} />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between font-semibold mb-1">
                        <span className="text-slate-300">Sales & Marketing</span>
                        <span className="text-purple-400 font-bold">88%</span>
                      </div>
                      <div className="w-full bg-slate-950 rounded-full h-2">
                        <div className="bg-purple-500 h-2 rounded-full" style={{ width: '88%' }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 text-purple-400" />
                      <h3 className="text-sm font-bold text-white">Workforce Health Metrics</h3>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono">Q3 2026</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Shift Compliance</span>
                      <p className="text-xl font-bold text-emerald-400">97.4%</p>
                      <span className="text-[10px] text-slate-500">Punctual Punch In</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Avg Monthly Absence</span>
                      <p className="text-xl font-bold text-indigo-300">2.1 Days</p>
                      <span className="text-[10px] text-slate-500">Within Policy Limits</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Employee CSAT</span>
                      <p className="text-xl font-bold text-amber-400">4.8 / 5.0</p>
                      <span className="text-[10px] text-slate-500">Workplace Rating</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-1">
                      <span className="text-[10px] text-slate-400 uppercase font-bold">Retention Rate</span>
                      <p className="text-xl font-bold text-purple-300">96.8%</p>
                      <span className="text-[10px] text-slate-500">Annual Retention</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: LEAVE APPROVALS VIEW */}
          {/* ========================================================================= */}
          {activeTab === 'approvals' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-amber-950/60 border border-amber-800/60 text-amber-400">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Leave Requests Approval Suite</h2>
                    <p className="text-xs text-slate-400">Review, approve, or reject employee leave applications in real time</p>
                  </div>
                </div>

                {/* Filter Buttons */}
                <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-2xl border border-slate-800 text-xs">
                  <button
                    onClick={() => setApprovalFilter('ALL')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      approvalFilter === 'ALL' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    All ({leaveRequests.length})
                  </button>
                  <button
                    onClick={() => setApprovalFilter('PENDING')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      approvalFilter === 'PENDING' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Pending ({pendingRequests.length})
                  </button>
                  <button
                    onClick={() => setApprovalFilter('APPROVED')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      approvalFilter === 'APPROVED' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setApprovalFilter('REJECTED')}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      approvalFilter === 'REJECTED' ? 'bg-amber-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    Rejected
                  </button>
                </div>
              </div>

              {/* TABLE VIEW */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-3">Applicant Name</th>
                      <th className="pb-3">Leave Type</th>
                      <th className="pb-3">Date Range</th>
                      <th className="pb-3">Duration</th>
                      <th className="pb-3">Reason</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">HR Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredLeaveRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-slate-800/40">
                        <td className="py-3 font-bold text-white">
                          <p className="text-slate-100">{req.userName}</p>
                          <p className="text-[10px] text-slate-400 font-normal">{req.userRole || 'Staff Member'}</p>
                        </td>
                        <td className="py-3 text-indigo-300 font-semibold">{req.leaveType}</td>
                        <td className="py-3 font-mono text-slate-400 text-[11px]">{req.startDate} to {req.endDate}</td>
                        <td className="py-3 font-mono text-slate-300">{req.totalDays} days</td>
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
                        <td className="py-3 text-right">
                          {(req.status === 'PENDING' || req.status === 'Pending') ? (
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => {
                                  setActiveReqId(req.id);
                                  setActionType('APPROVE');
                                }}
                                className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-md glow-emerald"
                              >
                                <Check className="w-3.5 h-3.5" />
                                <span>Approve</span>
                              </button>

                              <button
                                onClick={() => {
                                  setActiveReqId(req.id);
                                  setActionType('REJECT');
                                }}
                                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] flex items-center gap-1 transition-all shadow-md"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>Reject</span>
                              </button>
                            </div>
                          ) : (
                            <span className="text-[11px] text-slate-500 font-mono italic">
                              Reviewed by HR
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: EMPLOYEE DIRECTORY VIEW */}
          {/* ========================================================================= */}
          {activeTab === 'directory' && (
            <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-white">Company Staff Roster & Directory</h2>
                    <p className="text-xs text-slate-400">Manage employee accounts, roles, & contact information</p>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative w-full sm:w-72">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search name, role, department..."
                    value={searchDirectory}
                    onChange={(e) => setSearchDirectory(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* FULL DIRECTORY TABLE */}
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                      <th className="pb-3">Employee Details</th>
                      <th className="pb-3">System Role</th>
                      <th className="pb-3">Department</th>
                      <th className="pb-3">Email Address</th>
                      <th className="pb-3">Phone</th>
                      <th className="pb-3">Date Joined</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredDirectory.map((staff) => (
                      <tr key={staff.id} className="hover:bg-slate-800/40">
                        <td className="py-3 font-bold text-white">
                          <div className="flex items-center gap-3">
                            <img src={staff.avatar} alt={staff.name} className="w-9 h-9 rounded-xl object-cover ring-1 ring-slate-700 shrink-0" />
                            <div>
                              <p className="text-slate-100 font-bold">{staff.name}</p>
                              <p className="text-[10px] text-slate-400 font-mono">{staff.id} • {staff.designation}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                            staff.role === 'HR Admin'
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                          }`}>
                            {staff.role}
                          </span>
                        </td>
                        <td className="py-3 text-slate-300">{staff.dept}</td>
                        <td className="py-3 text-indigo-300 font-mono">{staff.email}</td>
                        <td className="py-3 text-slate-400 font-mono">{staff.phone}</td>
                        <td className="py-3 text-slate-400 font-mono">{staff.joined}</td>
                        <td className="py-3">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                            {staff.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: ADMIN GOVERNANCE VIEW */}
          {/* ========================================================================= */}
          {activeTab === 'governance' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* PRIVILEGES & ACCESS CONTROL */}
              <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 shadow-xl space-y-4">
                <div className="flex items-center gap-3 border-b border-slate-800 pb-3">
                  <Shield className="w-5 h-5 text-amber-400" />
                  <div>
                    <h2 className="text-base font-bold text-white">System Role Permissions & Access Control</h2>
                    <p className="text-xs text-slate-400">Governance policies and role-based access restrictions</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-800/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-300 uppercase text-[10px]">HR Admin Role Rights</span>
                      <Lock className="w-4 h-4 text-amber-400" />
                    </div>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside text-[11px]">
                      <li>Approve / Reject Leave Applications</li>
                      <li>Access full Employee Roster & Profiles</li>
                      <li>Review Attendance & Shift Logs</li>
                      <li>Modify Governance & Audit Controls</li>
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-indigo-950/20 border border-indigo-800/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-indigo-300 uppercase text-[10px]">Standard Employee Role Rights</span>
                      <Lock className="w-4 h-4 text-indigo-400" />
                    </div>
                    <ul className="space-y-1 text-slate-300 list-disc list-inside text-[11px]">
                      <li>Clock In / Out daily shift punch</li>
                      <li>Submit personal Leave Requests</li>
                      <li>View own profile & payroll statements</li>
                      <li>Admin Panel options completely hidden</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* AUDIT LOGS TABLE */}
              <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-sm font-bold text-white">System Security & Audit Trail Logs</h3>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400">Security Active</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                        <th className="pb-3">Timestamp</th>
                        <th className="pb-3">User Account</th>
                        <th className="pb-3">Action Event</th>
                        <th className="pb-3">IP Address</th>
                        <th className="pb-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60">
                      <tr className="hover:bg-slate-800/40">
                        <td className="py-2.5 font-mono text-slate-400">2026-08-22 16:40:12</td>
                        <td className="py-2.5 font-bold text-amber-300">Elena Rostova (HR Admin)</td>
                        <td className="py-2.5 text-slate-300">Approved LV-9801 Annual Leave</td>
                        <td className="py-2.5 font-mono text-slate-400">192.168.1.104</td>
                        <td className="py-2.5"><span className="text-emerald-400 font-bold">SUCCESS</span></td>
                      </tr>
                      <tr className="hover:bg-slate-800/40">
                        <td className="py-2.5 font-mono text-slate-400">2026-08-22 14:15:00</td>
                        <td className="py-2.5 font-bold text-indigo-300">Sarah Jenkins (Employee)</td>
                        <td className="py-2.5 text-slate-300">Clocked In (Shift Active)</td>
                        <td className="py-2.5 font-mono text-slate-400">192.168.1.182</td>
                        <td className="py-2.5"><span className="text-emerald-400 font-bold">SUCCESS</span></td>
                      </tr>
                      <tr className="hover:bg-slate-800/40">
                        <td className="py-2.5 font-mono text-slate-400">2026-08-22 09:00:00</td>
                        <td className="py-2.5 font-bold text-indigo-300">Alex Mercer (Employee)</td>
                        <td className="py-2.5 text-slate-300">Email OTP Authentication Verified</td>
                        <td className="py-2.5 font-mono text-slate-400">192.168.1.199</td>
                        <td className="py-2.5"><span className="text-emerald-400 font-bold">SUCCESS</span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

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

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0b1120] text-slate-100 flex items-center justify-center p-6">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading HR Admin Governance Suite...</span>
        </div>
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  );
}
