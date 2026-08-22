'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../components/Sidebar';
import Header from '../../components/Header';
import AdminApprovalPanel from '../../components/AdminApprovalPanel';

import { useAuth } from '../../context/AuthContext';
import { NavTab, EmployeeProfile } from '../../types/hrms';
import { 
  Users, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  ShieldAlert,
  UserPlus, 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Building2, 
  Briefcase, 
  Lock,
  Sparkles,
  ChevronRight,
  Shield,
  X,
  MapPin,
  Calendar
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const { 
    user, 
    role, 
    switchRole,
    isAuthenticated, 
    isLoading, 
    leaveRequests, 
    employeesList,
    handleApproveLeave, 
    handleRejectLeave,
    addEmployee
  } = useAuth();

  const [activeTab, setActiveTab] = useState<'analytics' | 'approvals' | 'directory'>('analytics');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('ALL');
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [selectedEmployeeView, setSelectedEmployeeView] = useState<EmployeeProfile | null>(null);

  // New Employee Form State
  const [newFullName, setNewFullName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newDepartment, setNewDepartment] = useState('Engineering');
  const [newDesignation, setNewDesignation] = useState('Software Engineer');
  const [newCode, setNewCode] = useState('');

  // Sidebar responsive states
  const [isOpenMobile, setIsOpenMobile] = useState<boolean>(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(false);

  // Auth protection check
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0b1120] text-slate-100 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin glow-amber" />
          <p className="text-xs font-semibold text-slate-400">Loading HR Admin Suite...</p>
        </div>
      </div>
    );
  }

  // Calculate HR Analytics Metrics
  const pendingLeaves = leaveRequests.filter((r) => r.status === 'Pending');
  const approvedLeaves = leaveRequests.filter((r) => r.status === 'Approved');
  const totalStaffCount = employeesList.length;
  const onTimeAttendanceCount = Math.floor(totalStaffCount * 0.92);
  const lateCount = totalStaffCount - onTimeAttendanceCount;

  // Filter Employees List
  const filteredEmployees = employeesList.filter((emp) => {
    const matchesDept = selectedDepartment === 'ALL' || emp.department === selectedDepartment;
    const matchesSearch = 
      emp.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.employeeCode.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDept && matchesSearch;
  });

  const handleCreateEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFullName || !newEmail) return;

    addEmployee({
      fullName: newFullName,
      email: newEmail,
      phone: newPhone || '+1 (555) 400-8800',
      department: newDepartment,
      designation: newDesignation,
      employeeCode: newCode || `DF-${Math.floor(1000 + Math.random() * 9000)}`,
      role: newDesignation,
    });

    setNewFullName('');
    setNewEmail('');
    setNewPhone('');
    setNewCode('');
    setIsAddEmployeeModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col font-sans transition-colors">
      
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab="admin"
        setActiveTab={(tab) => {
          if (tab === 'admin') {
            setActiveTab('approvals');
          } else {
            router.push('/employee/dashboard');
          }
        }}
        isOpenMobile={isOpenMobile}
        setIsOpenMobile={setIsOpenMobile}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
      />

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Header Bar */}
        <Header
          setIsOpenMobile={setIsOpenMobile}
          isCollapsed={isCollapsed}
        />

        {/* Dynamic Admin Content Area */}
        <main className={`flex-1 p-4 sm:p-6 lg:p-8 transition-all duration-300 ${
          isCollapsed ? 'lg:pl-24' : 'lg:pl-72'
        }`}>
          <div className="max-w-7xl mx-auto space-y-6">
            
            {/* RBAC Verification Banner: If role is not admin */}
            {role !== 'admin' && (
              <div className="p-5 rounded-3xl bg-amber-950/60 border border-amber-800/80 shadow-2xl flex flex-wrap items-center justify-between gap-4 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-amber-500 text-slate-950 font-bold shrink-0 glow-amber">
                    <ShieldAlert className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-amber-200">
                      HR / Admin Access Authorization Notice
                    </h3>
                    <p className="text-xs text-amber-300/80 mt-0.5">
                      Your current session is in <strong>Employee Mode</strong>. To review leave requests or manage staff, switch to <strong>HR Admin Role</strong>.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => switchRole('admin')}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-lg glow-amber transition-all flex items-center gap-2"
                >
                  <Shield className="w-4 h-4" />
                  <span>Switch to HR Admin Mode</span>
                </button>
              </div>
            )}

            {/* Top Admin Suite Banner & Nav Tabs */}
            <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/80 backdrop-blur-md p-4 sm:p-5 rounded-3xl border border-slate-800 shadow-xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                  <h1 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                    HR & Admin Operations Center
                  </h1>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Manage employee profiles, approve leave applications, and analyze workforce metrics
                </p>
              </div>

              {/* Sub-Navigation Tabs */}
              <div className="flex items-center gap-1.5 bg-slate-950/80 p-1.5 rounded-2xl border border-slate-800 text-xs font-bold">
                <button
                  onClick={() => setActiveTab('analytics')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    activeTab === 'analytics'
                      ? 'bg-amber-500 text-slate-950 font-black glow-amber'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>HR Analytics</span>
                </button>

                <button
                  onClick={() => setActiveTab('approvals')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    activeTab === 'approvals'
                      ? 'bg-amber-500 text-slate-950 font-black glow-amber'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Approval Workflows ({pendingLeaves.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('directory')}
                  className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 ${
                    activeTab === 'directory'
                      ? 'bg-amber-500 text-slate-950 font-black glow-amber'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Users className="w-4 h-4" />
                  <span>Employee Directory ({totalStaffCount})</span>
                </button>
              </div>
            </div>

            {/* TAB 1: HR Analytics Dashboard */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                
                {/* 4 Analytics Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-lg flex items-center gap-4">
                    <div className="p-3.5 bg-indigo-950 text-indigo-400 rounded-2xl border border-indigo-800">
                      <Users className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Total Active Employees</p>
                      <h3 className="text-2xl font-black text-white mt-0.5">{totalStaffCount}</h3>
                      <p className="text-[10px] text-emerald-400 font-bold mt-0.5">Across 4 Departments</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-lg flex items-center gap-4">
                    <div className="p-3.5 bg-amber-950 text-amber-400 rounded-2xl border border-amber-800">
                      <AlertCircle className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Pending Leave Requests</p>
                      <h3 className="text-2xl font-black text-amber-400 mt-0.5">{pendingLeaves.length}</h3>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">Requires HR Review</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-lg flex items-center gap-4">
                    <div className="p-3.5 bg-emerald-950 text-emerald-400 rounded-2xl border border-emerald-800">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">On-Time Punch Ratio</p>
                      <h3 className="text-2xl font-black text-emerald-400 mt-0.5">94.2%</h3>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{onTimeAttendanceCount} On-time / {lateCount} Late</p>
                    </div>
                  </div>

                  <div className="bg-slate-900 rounded-3xl p-5 border border-slate-800 shadow-lg flex items-center gap-4">
                    <div className="p-3.5 bg-purple-950 text-purple-400 rounded-2xl border border-purple-800">
                      <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-semibold">Approved Leaves (Month)</p>
                      <h3 className="text-2xl font-black text-white mt-0.5">{approvedLeaves.length}</h3>
                      <p className="text-[10px] text-purple-300 font-bold mt-0.5">Verified & Processed</p>
                    </div>
                  </div>

                </div>

                {/* Department Breakdown Cards */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  
                  <div className="lg:col-span-2 bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <div>
                        <h3 className="font-extrabold text-white text-base">
                          Department Headcount & Workload Breakdown
                        </h3>
                        <p className="text-xs text-slate-400">
                          Active headcount distribution and pending leave load by team
                        </p>
                      </div>
                      <span className="text-xs font-bold text-amber-400 bg-amber-950/60 px-3 py-1 rounded-full border border-amber-800">
                        Live Metrics
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                      {[
                        { name: 'Engineering', count: 18, pending: 2, color: 'from-indigo-500 to-blue-600' },
                        { name: 'Product & Design', count: 12, pending: 1, color: 'from-purple-500 to-indigo-600' },
                        { name: 'Marketing & Sales', count: 10, pending: 1, color: 'from-emerald-500 to-teal-600' },
                        { name: 'People & HR Admin', count: 8, pending: 0, color: 'from-amber-500 to-orange-600' },
                      ].map((dept) => (
                        <div key={dept.name} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-slate-200">{dept.name}</span>
                            <span className="text-xs font-mono font-bold text-indigo-400">{dept.count} Members</span>
                          </div>
                          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className={`h-full bg-gradient-to-r ${dept.color}`} 
                              style={{ width: `${(dept.count / 20) * 100}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                            <span>Pending Requests:</span>
                            <span className="font-bold text-amber-400">{dept.pending} Pending</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick Action Shortcuts */}
                  <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-4">
                    <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                      <ShieldCheck className="w-5 h-5 text-amber-400" />
                      HR Executive Controls
                    </h3>

                    <div className="space-y-3">
                      <button
                        onClick={() => setIsAddEmployeeModalOpen(true)}
                        className="w-full p-3.5 rounded-2xl bg-[#6366f1] hover:bg-indigo-600 text-white font-extrabold text-xs glow-purple transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <UserPlus className="w-4 h-4" />
                          <span>Add New Employee Profile</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setActiveTab('approvals')}
                        className="w-full p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-800 transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                          <span>Review Pending Leaves ({pendingLeaves.length})</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setActiveTab('directory')}
                        className="w-full p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 text-slate-200 font-bold text-xs border border-slate-800 transition-all flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2.5">
                          <Users className="w-4 h-4 text-indigo-400" />
                          <span>View Full Employee Roster</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB 2: Approval Workflows Table */}
            {activeTab === 'approvals' && (
              <div className="space-y-6">
                <AdminApprovalPanel
                  leaveRequests={leaveRequests}
                  onApprove={handleApproveLeave}
                  onReject={handleRejectLeave}
                />
              </div>
            )}

            {/* TAB 3: Full Employee Directory & Management */}
            {activeTab === 'directory' && (
              <div className="bg-slate-900 rounded-3xl p-6 border border-slate-800 shadow-xl space-y-6">
                
                {/* Directory Header */}
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-black text-white text-xl">
                      Enterprise Employee Directory
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Search, view profiles, and manage staff members across all departments
                    </p>
                  </div>

                  <button
                    onClick={() => setIsAddEmployeeModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs shadow-md glow-amber transition-all flex items-center gap-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add New Employee</span>
                  </button>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-slate-800">
                  <div className="relative w-full max-w-sm">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Search by name, email, employee code..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-slate-400" />
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="py-2 px-3 text-xs bg-slate-950 border border-slate-800 rounded-xl text-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                    >
                      <option value="ALL">All Departments</option>
                      <option value="Engineering">Engineering</option>
                      <option value="Product & Design">Product & Design</option>
                      <option value="Marketing">Marketing</option>
                      <option value="People & HR Admin">People & HR Admin</option>
                    </select>
                  </div>
                </div>

                {/* Directory Employee Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredEmployees.map((emp) => (
                    <div 
                      key={emp.id} 
                      className="bg-slate-950/80 rounded-2xl p-5 border border-slate-800/80 hover:border-indigo-500/50 transition-all space-y-4 group relative"
                    >
                      <div className="flex items-start gap-3.5">
                        <img
                          src={emp.avatar}
                          alt={emp.fullName}
                          className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-700 group-hover:ring-indigo-500 transition-all shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-extrabold text-white text-sm truncate">
                            {emp.fullName}
                          </h4>
                          <p className="text-xs text-indigo-400 font-semibold truncate">
                            {emp.designation}
                          </p>
                          <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 bg-slate-900 text-slate-300 border border-slate-800 rounded-full">
                            {emp.department}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-400 border-t border-slate-800/60 pt-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">Employee Code:</span>
                          <span className="font-mono text-white font-bold">{emp.employeeCode}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">Email:</span>
                          <span className="text-slate-300 truncate max-w-[150px]">{emp.email}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] text-slate-500">Location:</span>
                          <span className="text-slate-300 truncate">{emp.location.split(' ')[0]}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => setSelectedEmployeeView(emp)}
                        className="w-full py-2 rounded-xl bg-slate-900 hover:bg-indigo-950 text-indigo-300 font-bold text-xs border border-slate-800 hover:border-indigo-800 transition-all"
                      >
                        View Full Details
                      </button>
                    </div>
                  ))}
                </div>

              </div>
            )}

          </div>
        </main>

        {/* Global Footer */}
        <footer className={`py-4 px-6 text-center text-xs text-slate-500 border-t border-slate-800 transition-all ${
          isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
        }`}>
          <span>© 2026 Dayflow HRMS. Built with Next.js (App Router), TypeScript & Tailwind CSS.</span>
        </footer>

      </div>

      {/* Add New Employee Modal */}
      {isAddEmployeeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-lg shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-amber-400" />
                <h3 className="font-black text-white text-base">
                  Add New Team Member to Directory
                </h3>
              </div>
              <button 
                onClick={() => setIsAddEmployeeModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployeeSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-300 uppercase tracking-wider">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Jordan Lee"
                    value={newFullName}
                    onChange={(e) => setNewFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-300 uppercase tracking-wider">
                    Work Email *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="jordan@dayflow.io"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-300 uppercase tracking-wider">
                    Department
                  </label>
                  <select
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="People & HR Admin">People & HR Admin</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-300 uppercase tracking-wider">
                    Designation
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Staff DevOps Specialist"
                    value={newDesignation}
                    onChange={(e) => setNewDesignation(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block font-bold text-slate-300 uppercase tracking-wider">
                    Employee Code
                  </label>
                  <input
                    type="text"
                    placeholder="DF-8812"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block font-bold text-slate-300 uppercase tracking-wider">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    placeholder="+1 (555) 012-3456"
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddEmployeeModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black glow-amber shadow-md"
                >
                  Save Employee Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Single Employee Detail Modal */}
      {selectedEmployeeView && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="text-xs font-mono font-bold text-amber-400">
                {selectedEmployeeView.employeeCode}
              </span>
              <button 
                onClick={() => setSelectedEmployeeView(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img
                src={selectedEmployeeView.avatar}
                alt={selectedEmployeeView.fullName}
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-500"
              />
              <div>
                <h3 className="font-extrabold text-white text-lg">{selectedEmployeeView.fullName}</h3>
                <p className="text-xs text-indigo-400 font-semibold">{selectedEmployeeView.designation}</p>
                <span className="inline-block mt-1 text-[10px] font-bold px-2.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full">
                  {selectedEmployeeView.department}
                </span>
              </div>
            </div>

            <div className="space-y-2 text-xs text-slate-300 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-slate-500" />
                <span>{selectedEmployeeView.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-slate-500" />
                <span>{selectedEmployeeView.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>{selectedEmployeeView.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-slate-500" />
                <span>Joined: {selectedEmployeeView.joinDate}</span>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Key Skills:</p>
              <div className="flex flex-wrap gap-1.5">
                {selectedEmployeeView.skills.map((skill, idx) => (
                  <span key={idx} className="text-[10px] font-semibold px-2 py-0.5 bg-slate-800 text-slate-200 rounded-md">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={() => setSelectedEmployeeView(null)}
              className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs"
            >
              Close Record
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
