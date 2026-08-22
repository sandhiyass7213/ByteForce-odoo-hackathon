'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
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
  X,
  Users
} from 'lucide-react';
import { NavTab, Role } from '../types/hrms';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  isOpenMobile,
  setIsOpenMobile,
  isCollapsed,
  setIsCollapsed,
}: SidebarProps) {
  const router = useRouter();
  const { role, leaveRequests, logout } = useAuth();

  const pendingLeavesCount = leaveRequests.filter((r) => r.status === 'Pending').length;

  const navItems = [
    { id: 'dashboard' as NavTab, label: 'Dashboard Overview', icon: LayoutDashboard },
    { id: 'attendance' as NavTab, label: 'Attendance Tracker', icon: Clock },
    { id: 'leaves' as NavTab, label: 'Leave Requests', icon: CalendarDays, badge: pendingLeavesCount > 0 ? pendingLeavesCount : undefined },
    { id: 'profile' as NavTab, label: 'Profile Card', icon: UserCircle },
    { id: 'payroll' as NavTab, label: 'Payroll & Salary', icon: CreditCard },
  ];

  if (role === 'admin') {
    navItems.push({ 
      id: 'admin' as NavTab, 
      label: 'HR Approval Suite', 
      icon: ShieldCheck, 
      badge: pendingLeavesCount 
    });
  }

  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 left-0 bottom-0 z-50 flex flex-col bg-slate-900 border-r border-slate-800 shadow-2xl transition-all duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0 w-64' : '-translate-x-full lg:translate-x-0'
        } ${isCollapsed ? 'lg:w-20' : 'lg:w-64'}`}
      >
        {/* Header Branding */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-slate-800">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white glow-purple shadow-lg shrink-0">
              <Sparkles className="w-5.5 h-5.5" />
            </div>
            {(!isCollapsed || isOpenMobile) && (
              <div className="flex flex-col">
                <span className="font-extrabold text-lg leading-tight text-white tracking-tight">
                  Dayflow
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                  HRMS Enterprise
                </span>
              </div>
            )}
          </div>

          {/* Close button mobile */}
          <button 
            onClick={() => setIsOpenMobile(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 lg:hidden"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Role Banner Badge */}
        {(!isCollapsed || isOpenMobile) && (
          <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${role === 'admin' ? 'bg-amber-400 animate-pulse' : 'bg-indigo-400'}`} />
              <span className="text-xs font-bold text-slate-300">
                Mode: <span className={`capitalize ${role === 'admin' ? 'text-amber-400' : 'text-indigo-400'}`}>{role === 'admin' ? 'HR Director' : 'Employee'}</span>
              </span>
            </div>
            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-slate-900 border border-slate-700 text-slate-300">
              v2.5
            </span>
          </div>
        )}

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
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
                className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-xs font-bold transition-all group relative ${
                  isActive
                    ? 'bg-[#6366f1] text-white glow-purple font-extrabold'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-100'
                } ${isCollapsed && !isOpenMobile ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'}`} />
                
                {(!isCollapsed || isOpenMobile) && (
                  <span className="truncate">{item.label}</span>
                )}

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`ml-auto text-[11px] px-2 py-0.5 rounded-full font-extrabold transition-all ${
                      isActive
                        ? 'bg-white text-indigo-900'
                        : 'bg-amber-500 text-slate-950 font-black'
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
        <div className="p-3 border-t border-slate-800 space-y-2">
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex w-full items-center justify-center p-2.5 rounded-xl text-slate-400 hover:bg-slate-800 hover:text-slate-200 transition-colors"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
            {!isCollapsed && <span className="ml-2 text-xs font-bold">Collapse Sidebar</span>}
          </button>

          <button
            onClick={handleSignOut}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-950/40 transition-colors ${
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
