'use client';

import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Menu, 
  Shield, 
  User, 
  CheckCircle2, 
  AlertCircle,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { EmployeeProfile, Role } from '../types/hrms';

interface HeaderProps {
  user: EmployeeProfile;
  role: Role;
  setRole: (role: Role) => void;
  setIsOpenMobile: (open: boolean) => void;
  isCollapsed: boolean;
}

export default function Header({
  user,
  role,
  setRole,
  setIsOpenMobile,
  isCollapsed,
}: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  const notifications = [
    {
      id: 1,
      title: 'Leave Request Approved',
      time: '2 hours ago',
      unread: true,
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-50 dark:bg-emerald-950/40',
    },
    {
      id: 2,
      title: 'August Payroll Processed',
      time: '1 day ago',
      unread: true,
      icon: Sparkles,
      color: 'text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40',
    },
    {
      id: 3,
      title: 'Pending Leave Approval (Alex Mercer)',
      time: '2 days ago',
      unread: false,
      icon: AlertCircle,
      color: 'text-amber-500 bg-amber-50 dark:bg-amber-950/40',
    },
  ];

  return (
    <header className={`sticky top-0 z-30 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-all duration-300 ${
      isCollapsed ? 'lg:pl-20' : 'lg:pl-64'
    }`}>
      <div className="h-full px-4 sm:px-6 flex items-center justify-between gap-4">
        
        {/* Left Side: Mobile Menu Button & Search */}
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <button
            onClick={() => setIsOpenMobile(true)}
            className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="relative w-full hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search employees, requests, docs..."
              className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Right Side: Role Switcher & User Profile */}
        <div className="flex items-center gap-3 sm:gap-4">
          
          {/* Role Switcher Toggle */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setRole('employee')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'employee'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Employee</span>
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Shield className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">HR Admin</span>
            </button>
          </div>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowUserDropdown(false);
              }}
              className="relative p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700/80 p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center justify-between px-2 pb-2 border-b border-slate-100 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100 uppercase tracking-wider">
                    Notifications
                  </h4>
                  <span className="text-[10px] bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 font-bold px-2 py-0.5 rounded-full">
                    2 New
                  </span>
                </div>

                <div className="divide-y divide-slate-100 dark:divide-slate-700/50 my-1">
                  {notifications.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="py-2.5 px-2 flex items-start gap-3 hover:bg-slate-50 dark:hover:bg-slate-700/40 rounded-xl transition-colors cursor-pointer">
                        <div className={`p-2 rounded-xl shrink-0 ${item.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-400 mt-0.5">{item.time}</p>
                        </div>
                        {item.unread && (
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5" />
                        )}
                      </div>
                    );
                  })}
                </div>

                <button 
                  onClick={() => setShowNotifications(false)}
                  className="w-full mt-2 py-1.5 text-center text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  Mark all as read
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
              className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {/* Avatar image */}
              <img
                src={user.avatar}
                alt={user.fullName}
                className="w-9 h-9 rounded-xl object-cover ring-2 ring-indigo-500/20"
              />
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-100 leading-tight">
                  {user.fullName}
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">
                  {user.role}
                </span>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400 hidden md:block" />
            </button>

            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700/80 p-2 z-50">
                <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700">
                  <p className="text-xs font-bold text-slate-900 dark:text-slate-100">{user.fullName}</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  <span className="mt-1.5 inline-block text-[10px] font-semibold px-2 py-0.5 bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300 rounded-full">
                    {user.department}
                  </span>
                </div>
                <div className="py-1">
                  <button 
                    onClick={() => setShowUserDropdown(false)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    View Full Profile
                  </button>
                  <button 
                    onClick={() => setShowUserDropdown(false)}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
                  >
                    Account Settings
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
