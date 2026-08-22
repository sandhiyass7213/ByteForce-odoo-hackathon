'use client';

import React, { useState } from 'react';
import { 
  CalendarDays, 
  Plus, 
  Search, 
  Clock, 
  CheckCircle, 
  XCircle, 
  MessageSquare, 
  Filter
} from 'lucide-react';
import { LeaveRequest, LeaveStatus } from '../types/hrms';

interface LeaveTableProps {
  leaveRequests: LeaveRequest[];
  onOpenModal: () => void;
  onCancelRequest?: (id: string) => void;
}

export default function LeaveTable({
  leaveRequests,
  onOpenModal,
  onCancelRequest,
}: LeaveTableProps) {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Filter requests
  const filteredRequests = leaveRequests.filter((req) => {
    const matchesStatus =
      filterStatus === 'ALL' || req.status.toUpperCase() === filterStatus;
    const matchesQuery =
      req.leaveType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesQuery;
  });

  const getStatusBadge = (status: LeaveStatus) => {
    switch (status) {
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'Rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800 animate-pulse">
            <Clock className="w-3.5 h-3.5" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6">
      
      {/* Header & Apply Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarDays className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
              My Leave Applications
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Track leave balances, approval status & HR feedback
          </p>
        </div>

        <button
          onClick={onOpenModal}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Apply For Leave</span>
        </button>
      </div>

      {/* Controls & Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        {/* Filter Tabs */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize ${
                filterStatus === st
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-300 shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {st.toLowerCase()}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leave history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Leave Requests Table */}
      <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <th className="py-3.5 px-4">Leave Type</th>
              <th className="py-3.5 px-4">Date Range</th>
              <th className="py-3.5 px-4">Duration</th>
              <th className="py-3.5 px-4">Reason / Notes</th>
              <th className="py-3.5 px-4">Status</th>
              <th className="py-3.5 px-4 text-right">Action / Remarks</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
            {filteredRequests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-slate-400">
                  No leave requests found matching your filter criteria.
                </td>
              </tr>
            ) : (
              filteredRequests.map((req) => (
                <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-4 px-4 font-bold text-slate-900 dark:text-slate-100">
                    <div className="flex flex-col">
                      <span>{req.leaveType}</span>
                      <span className="text-[10px] text-slate-400 font-normal">ID: {req.id}</span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-slate-700 dark:text-slate-300 font-mono">
                    {req.startDate} to {req.endDate}
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-bold">
                      {req.durationDays} {req.durationDays === 1 ? 'day' : 'days'}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-slate-600 dark:text-slate-300 max-w-xs truncate" title={req.reason}>
                    {req.reason}
                  </td>
                  <td className="py-4 px-4">
                    {getStatusBadge(req.status)}
                  </td>
                  <td className="py-4 px-4 text-right">
                    {req.adminComment ? (
                      <div className="inline-flex items-center gap-1 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg" title={req.adminComment}>
                        <MessageSquare className="w-3 h-3 text-indigo-500" />
                        <span className="max-w-[120px] truncate">{req.adminComment}</span>
                      </div>
                    ) : req.status === 'Pending' && onCancelRequest ? (
                      <button
                        onClick={() => onCancelRequest(req.id)}
                        className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline"
                      >
                        Cancel
                      </button>
                    ) : (
                      <span className="text-slate-400">--</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
