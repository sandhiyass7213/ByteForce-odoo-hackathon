'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { 
  LayoutDashboard, 
  Clock, 
  CalendarDays, 
  UserCircle, 
  Wallet, 
  CheckSquare, 
  Users, 
  Shield, 
  LogOut,
  Sparkles,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  activeTab?: string;
  onTabChange?: (tabId: any) => void;
}

export default function Sidebar({
  isCollapsed,
  setIsCollapsed,
  isOpenMobile,
  setIsOpenMobile,
  activeTab,
  onTabChange,
}: SidebarProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentTab = activeTab || searchParams.get('tab') || 'attendance';
  const { role, logout, user } = useAuth();

  // Navigation Items for EMPLOYEE Role (HR Admin options completely HIDDEN)
  const employeeNavItems = [
    {
      id: 'attendance',
      name: 'Attendance Tracker',
      icon: Clock,
      href: '/employee/dashboard?tab=attendance',
      badge: 'Live',
      badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    },
    {
      id: 'leaves',
      name: 'Leave Applications',
      icon: CalendarDays,
      href: '/employee/dashboard?tab=leaves',
    },
    {
      id: 'profile',
      name: 'My Profile',
      icon: UserCircle,
      href: '/employee/dashboard?tab=profile',
    },
    {
      id: 'payroll',
      name: 'Salary & Payroll',
      icon: Wallet,
      href: '/employee/dashboard?tab=payroll',
    },
  ];

  // Navigation Items for HR_ADMIN Role
  const adminNavItems = [
    {
      id: 'overview',
      name: 'HR Analytics',
      icon: LayoutDashboard,
      href: '/admin/dashboard?tab=overview',
    },
    {
      id: 'leaves',
      name: 'Leave Approval Suite',
      icon: CheckSquare,
      href: '/admin/dashboard?tab=leaves',
      badge: 'Action Needed',
      badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    {
      id: 'directory',
      name: 'Employee Directory',
      icon: Users,
      href: '/admin/dashboard?tab=directory',
    },
    {
      id: 'governance',
      name: 'Admin Governance',
      icon: Shield,
      href: '/admin/dashboard?tab=governance',
    },
  ];

  // Render navigation based on strict role
  const navItems = role === 'HR_ADMIN' ? adminNavItems : employeeNavItems;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={() => setIsOpenMobile(false)}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-[#0b1120] border-r border-slate-800 transition-all duration-300 flex flex-col justify-between ${
          isCollapsed ? 'w-20' : 'w-64'
        } ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Branding Section */}
        <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
          <Link href={role === 'HR_ADMIN' ? '/admin/dashboard' : '/employee/dashboard'} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white glow-purple shrink-0 shadow-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div className="flex flex-col">
                <span className="font-black text-base tracking-tight text-white flex items-center gap-1.5">
                  Dayflow <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">HRMS</span>
                </span>
                <span className="text-[10px] text-slate-400 font-medium">
                  {role === 'HR_ADMIN' ? 'HR Admin Governance' : 'Employee Workspace'}
                </span>
              </div>
            )}
          </Link>

          {/* Desktop Collapse Toggle */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
            aria-label="Toggle sidebar"
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role Badge Indicator */}
        <div className="p-4">
          <div className={`p-3 rounded-2xl border flex items-center gap-3 transition-all ${
            role === 'HR_ADMIN'
              ? 'bg-amber-950/30 border-amber-800/40 text-amber-300'
              : 'bg-indigo-950/30 border-indigo-800/40 text-indigo-300'
          }`}>
            <Shield className="w-5 h-5 shrink-0" />
            {!isCollapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-black uppercase tracking-wider truncate">
                  {role === 'HR_ADMIN' ? 'HR / Admin Portal' : 'Employee Portal'}
                </span>
                <span className="text-[10px] opacity-80 truncate">
                  {role === 'HR_ADMIN' ? 'Full Access Granted' : 'Restricted Role View'}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            
            const isItemActive = currentTab === item.id || 
              (currentTab === 'overview' && item.id === 'overview') ||
              (currentTab === 'attendance' && item.id === 'attendance');

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (onTabChange) {
                    onTabChange(item.id);
                  }
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-2xl text-xs font-bold transition-all duration-200 group relative text-left ${
                  isItemActive
                    ? 'bg-[#6366f1] text-white shadow-lg glow-purple'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${
                  isItemActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`} />

                {!isCollapsed && (
                  <div className="flex items-center justify-between w-full min-w-0">
                    <span className="truncate pr-1">{item.name}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border whitespace-nowrap shrink-0 ml-1 ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Profile & Sign Out Footer */}
        <div className="p-3 border-t border-slate-800/80">
          <div className="p-2 bg-slate-900/80 border border-slate-800 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
                alt={user?.fullName || 'User Avatar'}
                className="w-8 h-8 rounded-xl object-cover ring-2 ring-indigo-500/40 shrink-0"
              />
              {!isCollapsed && (
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-bold text-slate-100 truncate">
                    {user?.fullName || 'Sarah Jenkins'}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {user?.designation || 'Specialist'}
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={logout}
              className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
