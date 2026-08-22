'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, 
  Search, 
  Menu, 
  Shield, 
  User, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  Sparkles,
  LogOut,
  Building,
  KeyRound
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types/hrms';

interface HeaderProps {
  setIsOpenMobile: (open: boolean) => void;
  isCollapsed: boolean;
}

export default function Header({
  setIsOpenMobile,
  isCollapsed,
}: HeaderProps) {
  const router = useRouter();
  const { user, role, switchRole, logout, leaveRequests } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const pendingLeavesCount = leaveRequests.filter((r) => r.status === 'Pending').length;

  const handleRoleToggle = (targetRole: Role) => {
    switchRole(targetRole);
    if (targetRole === 'admin') {
      router.push('/admin/dashboard');
    } else {
      router.push('/employee/dashboard');
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const notifications = [
    {
      id: 1,
      title: 'Leave Request Status Updated',
      time: '10 mins ago',
      unread: true,
      icon: CheckCircle2,
      color: 'text-emerald-400 bg-emerald-950/60',
    },
    {
      id: 2,
      title: `${pendingLeavesCount} Pending Leave Requests`,
      time: '1 hour ago',
      unread: pendingLeavesCount > 0,
      icon: AlertCircle,
      color: 'text-amber-400 bg-amber-950/60',
    },
    {
      id: 3,
      title: 'August Payroll Statement Released',
      time: '1 day ago',
      unread: false,
      icon: Sparkles,
      color: 'text-indigo-400 bg-indigo-950/60',
    },
  ];

  return (
    <header className={`sticky top-0 z-30 h-16 bg-[#0b1120]/90 backdrop-blur-xl border-b border-slate-800 transition-all duration-300 ${
      isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
    }`}>
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left Side: Mobile Menu Button & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={() => setIsOpenMobile(true)}
            className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative w-full hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search employee records, leave history, payroll..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition-all"
            />
          </div>
        </div>

        {/* Right Side: Role Badge, Notifications & Profile Menu */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Active Mode Badge (Strict Role Isolation) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
            {role === 'admin' ? (
              <div className="flex items-center gap-2 text-amber-400">
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">HR / Admin Active</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-indigo-300">
                <User className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Employee Portal Active</span>
              </div>
            )}
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserDropdown(false);
              }}
              className="relative p-2 rounded-xl text-slate-300 hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              {pendingLeavesCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-[#0b1120] animate-ping" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Notifications
                  </h4>
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-800">
                    Live Updates
                  </span>
                </div>

                <div className="divide-y divide-slate-800/60 my-1">
                  {notifications.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="py-2.5 px-2 flex items-start gap-3 hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer">
                        <div className={`p-2 rounded-xl shrink-0 ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-200 truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.time}</p>
                        </div>
                        {item.unread && (
                          <span className="w-2 h-2 rounded-full bg-[#6366f1] mt-1.5 shrink-0" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <button 
                  onClick={() => setShowNotifications(false)}
                  className="w-full mt-2 py-1.5 text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Close Panel
                </button>
              </div>
            )}
          </div>

          {/* User Profile Menu */}
          <div className="relative">
            <button
              onClick={() => {
                setShowUserDropdown(!showUserDropdown);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2.5 p-1.5 rounded-xl hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-700"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                alt={user?.fullName || 'User'}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/40"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-100 leading-tight">
                  {user?.fullName || 'Sarah Jenkins'}
                </span>
                <span className="text-[10px] text-slate-400">
                  {role === 'admin' ? 'HR Director' : (user?.designation || 'Staff Member')}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white">{user?.fullName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800 rounded-full">
                      {user?.department || 'People & HR'}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {user?.employeeCode}
                    </span>
                  </div>
                </div>

                <div className="py-1 space-y-1 text-xs">
                  <button 
                    onClick={() => {
                      setShowUserDropdown(false);
                      if (role === 'admin') router.push('/admin/dashboard');
                      else router.push('/employee/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-xl flex items-center gap-2"
                  >
                    <Building className="w-4 h-4 text-indigo-400" />
                    <span>My Workspace</span>
                  </button>

                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-rose-400 hover:bg-rose-950/40 rounded-xl flex items-center gap-2 font-semibold"
                  >
                    <LogOut className="w-4 h-4 text-rose-400" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
