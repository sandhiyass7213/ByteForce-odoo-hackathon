'use client';

import React from 'react';
import { 
  LayoutDashboard, 
  Clock, 
  CalendarDays, 
  UserCircle, 
  CreditCard, 
  ShieldCheck, 
  Sparkles,
  ChevronLeft,
  ChevronRight,
  LogOut,
  X
} from 'lucide-react';
import { NavTab, Role } from '../types/hrms';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  role: Role;
  pendingLeavesCount: number;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  role,
  pendingLeavesCount,
  isOpenMobile,
  setIsOpenMobile,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'attendance' as NavTab, label: 'Attendance', icon: Clock },
    { id: 'leaves' as NavTab, label: 'Leave Requests', icon: CalendarDays, badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined },
    { id: 'profile' as NavTab, label: 'Profile', icon: UserCircle },
    { id: 'payroll' as NavTab, label: 'Payroll', icon: CreditCard },
  ];

  if (role === 'admin') {
    navItems.push({ 
      id: 'admin' as NavTab, 
      label: 'Admin Panel', 
      icon: ShieldCheck, 
      badge: pendingLeavesCount 
    });
  }

  return (
    <>
      {/* Mobile Overlay */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 shadow-sm transition-all duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-sky-400 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 shrink-0">
              <Sparkles className="w-5.5 h-5.5" />
            </div>
            {(!isCollapsed || isOpenMobile) && (
              <div className="flex flex-col">
                <span className="font-bold text-lg leading-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:to-slate-300 bg-clip-text text-transparent tracking-tight">
                  Dayflow
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  HR Management
                </span>
              </div>
            )}
          </div>

          {/* Close button mobile */}
          <button 
            onClick={() => setIsOpenMobile(false)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Role Banner Badge */}
        {(!isCollapsed || isOpenMobile) && (
          <div className="px-4 py-3 bg-indigo-50/60 dark:bg-indigo-950/40 border-b border-indigo-100/50 dark:border-indigo-900/30 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${role === 'admin' ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span className="text-xs font-semibold text-indigo-950 dark:text-indigo-200">
                Mode: <span className="capitalize font-bold">{role} View</span>
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-white dark:bg-slate-800 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300">
              v2.4
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setIsOpenMobile(false);
                }}
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-medium transition-all group relative ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                } ${isCollapsed && !isOpenMobile ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`} />
                
                {(!isCollapsed || isOpenMobile) && (
                  <span className="truncate">{item.label}</span>
                )}

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-auto text-xs px-2 py-0.5 rounded-full font-bold transition-all ${
                      isActive
                        ? 'bg-white text-indigo-700'
                        : 'bg-amber-500 text-white dark:bg-amber-600'
                    } ${isCollapsed && !isOpenMobile ? 'absolute top-1 right-2 text-[10px] px-1 py-0' : ''}`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Actions & Collapse Toggle */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center justify-center p-2.5 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!isCollapsed && <span className="ml-2 text-xs font-medium">Collapse Menu</span>}
          </button>

          <button
            onClick={() => alert('Demo Session: Logged out successfully')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ${
              isCollapsed && !isOpenMobile ? 'justify-center' : ''
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {(!isCollapsed || isOpenMobile) && <span>Sign Out</span>}
          </button>
        </div>
      </aside>
    </>
  );
}
