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
  Building
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface HeaderProps {
  setIsOpenMobile: (open: boolean) => void;
  isCollapsed: boolean;
}

export default function Header({
  setIsOpenMobile,
  isCollapsed,
}: HeaderProps) {
  const router = useRouter();
  const { user, role, logout, leaveRequests } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const pendingCount = leaveRequests.filter((r) => r.status === 'PENDING' || r.status === 'Pending').length;

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className={`sticky top-0 z-30 h-16 bg-[#0b1120]/90 backdrop-blur-xl border-b border-slate-800 transition-all duration-300 ${
      isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
    }`}>
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left: Mobile Menu & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={() => setIsOpenMobile(true)}
            className="p-2 rounded-xl text-slate-300 hover:bg-slate-800 lg:hidden"
            aria-label="Toggle mobile menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative w-full hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search employee directory, attendance, leave logs..."
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-900/80 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition-all"
            />
          </div>
        </div>

        {/* Right: Role Badge & Notifications */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Active Mode Badge (Strict Role Isolation - Admin toggle removed for employees) */}
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold">
            {role === 'HR_ADMIN' ? (
              <div className="flex items-center gap-2 text-amber-400">
                <Shield className="w-4 h-4 text-amber-400" />
                <span className="hidden sm:inline">HR / Admin Mode</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-indigo-300">
                <User className="w-4 h-4 text-indigo-400" />
                <span className="hidden sm:inline">Employee Mode</span>
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
              {pendingCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-amber-500 ring-2 ring-[#0b1120] animate-ping" />
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-800">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Live Alerts
                  </h4>
                  <span className="text-[10px] bg-indigo-950 text-indigo-300 font-bold px-2 py-0.5 rounded-full border border-indigo-800">
                    {pendingCount} Pending
                  </span>
                </div>

                <div className="divide-y divide-slate-800/60 my-1">
                  <div className="py-2.5 px-2 flex items-start gap-3 hover:bg-slate-800/50 rounded-xl transition-colors cursor-pointer">
                    <div className="p-2 rounded-xl text-amber-400 bg-amber-950/60 shrink-0">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-slate-200 truncate">
                        {pendingCount} Leave Applications Pending Review
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">Updated just now</p>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setShowNotifications(false)}
                  className="w-full mt-2 py-1.5 text-center text-xs font-semibold text-indigo-400 hover:text-indigo-300"
                >
                  Dismiss Alerts
                </button>
              </div>
            )}
          </div>

          {/* User Avatar Menu */}
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
                  {role === 'HR_ADMIN' ? 'HR Director' : (user?.designation || 'Specialist')}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-60 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-800">
                  <p className="text-xs font-bold text-white">{user?.fullName}</p>
                  <p className="text-[11px] text-slate-400 truncate">{user?.email}</p>
                </div>

                <div className="py-1 space-y-1 text-xs">
                  <button 
                    onClick={() => {
                      setShowUserDropdown(false);
                      if (role === 'HR_ADMIN') router.push('/admin/dashboard');
                      else router.push('/employee/dashboard');
                    }}
                    className="w-full text-left px-3 py-2 text-slate-300 hover:bg-slate-800 rounded-xl flex items-center gap-2"
                  >
                    <Building className="w-4 h-4 text-indigo-400" />
                    <span>My Dashboard</span>
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
