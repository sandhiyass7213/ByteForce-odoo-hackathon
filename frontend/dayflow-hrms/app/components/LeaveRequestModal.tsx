'use client';

import React, { useState } from 'react';
import { X, Calendar, FileText, Send, Sparkles } from 'lucide-react';
import { LeaveRequest, LeaveType } from '../types/hrms';

interface LeaveRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (newRequest: Omit<LeaveRequest, 'id' | 'status' | 'appliedOn'>) => void;
  userAvatar: string;
  userName: string;
}

export default function LeaveRequestModal({
  isOpen,
  onClose,
  onSubmit,
  userAvatar,
  userName,
}: LeaveRequestModalProps) {
  const [leaveType, setLeaveType] = useState<LeaveType>('Paid Leave');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');

  if (!isOpen) return null;

  // Calculate days duration
  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = end.getTime() - start.getTime();
    if (diffTime < 0) return 0;
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const durationDays = calculateDays();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate) {
      setErrorMsg('Please select both start and end dates.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setErrorMsg('End date cannot be prior to start date.');
      return;
    }
    if (!reason.trim()) {
      setErrorMsg('Please provide a brief reason for your leave request.');
      return;
    }

    setErrorMsg('');
    onSubmit({
      employeeId: 'EMP-2026-089',
      employeeName: userName,
      employeeAvatar: userAvatar,
      department: 'Product & Design',
      leaveType,
      startDate,
      endDate,
      durationDays,
      reason,
    });

    // Reset form
    setStartDate('');
    setEndDate('');
    setReason('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-lg shadow-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden relative">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md shadow-indigo-600/20">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Apply for Leave
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Submit leave request for admin review
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-700 dark:text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Leave Type Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Leave Category
            </label>
            <select
              value={leaveType}
              onChange={(e) => setLeaveType(e.target.value as LeaveType)}
              className="w-full px-4 py-3 rounded-xl bg-slate-100/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Paid Leave">Paid Leave (Casual / Vacation)</option>
              <option value="Sick Leave">Sick Leave (Medical)</option>
              <option value="Casual Leave">Casual Leave</option>
              <option value="Maternity/Paternity">Maternity / Paternity</option>
              <option value="Unpaid Leave">Unpaid Leave</option>
            </select>
          </div>

          {/* Date Range Picker */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                End Date
              </label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Duration Summary Badge */}
          {durationDays > 0 && (
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 rounded-2xl border border-indigo-100 dark:border-indigo-900 flex items-center justify-between">
              <span className="text-xs font-medium text-indigo-900 dark:text-indigo-200">Calculated Leave Duration:</span>
              <span className="text-xs font-bold bg-indigo-600 text-white px-3 py-1 rounded-full">
                {durationDays} {durationDays === 1 ? 'Day' : 'Days'}
              </span>
            </div>
          )}

          {/* Reason / Remarks */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Reason / Remarks
            </label>
            <textarea
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="State the purpose of your leave request..."
              className="w-full px-4 py-3 rounded-xl bg-slate-100/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-md shadow-indigo-600/25 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>Submit Request</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
