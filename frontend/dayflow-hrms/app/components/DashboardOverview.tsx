'use client';

import React from 'react';
import { 
  Users, 
  Calendar, 
  Clock, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  ArrowRight,
  Plane
} from 'lucide-react';
import { DashboardStats, Role } from '../types/hrms';
import AttendanceWidget from './AttendanceWidget';

interface DashboardOverviewProps {
  stats: DashboardStats;
  role: Role;
  onNavigateTab: (tab: any) => void;
  onOpenLeaveModal: () => void;
}

export default function DashboardOverview({
  stats,
  role,
  onNavigateTab,
  onOpenLeaveModal,
}: DashboardOverviewProps) {
  return (
    <div className="space-y-6">
      
      {/* Top Banner Greeting */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-indigo-500/20 to-transparent pointer-events-none" />
        <div className="relative z-10 max-w-xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome to Dayflow HRMS</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Good Morning, Sarah 👋
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200/90 leading-relaxed">
            You are checked in today. Your next leave request is pending HR approval. Track your daily attendance and pay details below.
          </p>

          <div className="pt-2 flex flex-wrap gap-3">
            <button
              onClick={onOpenLeaveModal}
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
            >
              <Plane className="w-4 h-4 text-indigo-600" />
              <span>Apply Leave</span>
            </button>
            <button
              onClick={() => onNavigateTab('payroll')}
              className="px-4 py-2.5 rounded-xl bg-indigo-800/60 hover:bg-indigo-800 text-indigo-100 font-bold text-xs border border-indigo-700/60 transition-all flex items-center gap-1.5"
            >
              <span>View Salary Details</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Days Present (This Month)</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white">{stats.presentDaysCount}</h4>
              <span className="text-[11px] font-semibold text-slate-400">/ {stats.totalAttendanceDays} Days</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Remaining Leave Balance</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h4 className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400">{stats.leaveBalanceRemaining}</h4>
              <span className="text-[11px] font-semibold text-slate-400">Days Available</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending HR Approvals</p>
            <div className="flex items-baseline gap-2 mt-0.5">
              <h4 className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">{stats.pendingApprovalsCount}</h4>
              <span className="text-[11px] font-semibold text-slate-400">Requests</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-sky-50 dark:bg-sky-950/50 text-sky-600 dark:text-sky-400 rounded-2xl">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Next Public Holiday</p>
            <h5 className="text-xs font-bold text-slate-900 dark:text-white mt-0.5 truncate">{stats.nextUpcomingHoliday.title}</h5>
            <p className="text-[10px] text-sky-600 dark:text-sky-400 font-semibold">{stats.nextUpcomingHoliday.daysLeft} days away ({stats.nextUpcomingHoliday.date})</p>
          </div>
        </div>

      </div>

      {/* Main Grid: Attendance Widget + Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <div className="lg:col-span-2">
          <AttendanceWidget />
        </div>

        {/* Quick Announcements & Shortcuts */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              Company Announcements
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 rounded-full">
                  HR Policy
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-100 mt-1">
                  Q3 Performance Appraisals Schedule
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  Self-evaluations open until Sep 15th. Check your profile.
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 rounded-full">
                  IT Support
                </span>
                <p className="font-bold text-slate-800 dark:text-slate-100 mt-1">
                  Scheduled Portal Maintenance
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] mt-0.5">
                  Brief maintenance window on Sunday at 02:00 AM UTC.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
