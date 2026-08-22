'use client';

import React, { useState } from 'react';
import { Calendar, FileText, History, Plus, X, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LeaveManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LeaveManagementModal({ isOpen, onClose }: LeaveManagementModalProps) {
  const { leaveRequests, submitLeaveRequest } = useAuth();
  const [activeTab, setActiveTab] = useState<'apply' | 'history'>('apply');

  // Form state
  const [leaveType, setLeaveType] = useState('Annual Leave');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    submitLeaveRequest({ leaveType, startDate, endDate, reason });
    setSuccessMsg('Leave application submitted successfully!');
    setErrorMsg('');
    setStartDate('');
    setEndDate('');
    setReason('');
    
    setTimeout(() => {
      setSuccessMsg('');
      setActiveTab('history');
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Leave Management Workflow</h2>
              <p className="text-xs text-slate-400">Submit requests and track leave status history</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs: Apply Form vs History */}
        <div className="flex border-b border-slate-800">
          <button
            onClick={() => setActiveTab('apply')}
            className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'apply'
                ? 'border-[#6366f1] text-[#6366f1]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Apply Form</span>
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`pb-3 px-4 font-bold text-xs flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'history'
                ? 'border-[#6366f1] text-[#6366f1]'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <History className="w-4 h-4" />
            <span>History Log</span>
            <span className="text-[10px] bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-800 font-mono">
              {leaveRequests.length}
            </span>
          </button>
        </div>

        {/* TAB 1: APPLY FORM */}
        {activeTab === 'apply' && (
          <form onSubmit={handleSubmit} className="space-y-4 text-xs animate-in fade-in">
            {errorMsg && (
              <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-center font-medium">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-center font-medium flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            <div>
              <label className="block font-bold text-slate-300 uppercase text-[10px] tracking-wider mb-1">
                Leave Type
              </label>
              <select
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
                className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
              >
                <option value="Annual Leave">Annual Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
                <option value="Maternity Leave">Maternity Leave</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-300 uppercase text-[10px] tracking-wider mb-1">
                  Start Date
                </label>
                <input
                  type="date"
                  required
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-300 uppercase text-[10px] tracking-wider mb-1">
                  End Date
                </label>
                <input
                  type="date"
                  required
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-300 uppercase text-[10px] tracking-wider mb-1">
                Reason & Details
              </label>
              <textarea
                rows={3}
                required
                placeholder="Add your comment or justification for this leave request..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-3 bg-slate-950/80 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl border border-slate-800 text-slate-300 hover:bg-slate-800 font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#6366f1] hover:bg-indigo-600 text-white font-extrabold shadow-lg glow-purple transition-all"
              >
                Submit Leave Application
              </button>
            </div>
          </form>
        )}

        {/* TAB 2: HISTORY LOG */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-in fade-in">
            <div className="overflow-x-auto max-h-80 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="pb-3">Type</th>
                    <th className="pb-3">Duration</th>
                    <th className="pb-3">Reason</th>
                    <th className="pb-3">Applied On</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {leaveRequests.map((req) => (
                    <tr key={req.id} className="hover:bg-slate-800/40">
                      <td className="py-3 font-bold text-white">{req.leaveType}</td>
                      <td className="py-3 font-mono text-indigo-300 text-[11px]">
                        {req.startDate} → {req.endDate} ({req.totalDays}d)
                      </td>
                      <td className="py-3 text-slate-300 max-w-xs truncate" title={req.reason}>
                        {req.reason}
                      </td>
                      <td className="py-3 text-slate-400 font-mono text-[11px]">{req.appliedOn}</td>
                      <td className="py-3">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          req.status === 'APPROVED' || req.status === 'Approved'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : req.status === 'REJECTED' || req.status === 'Rejected'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800 animate-pulse'
                        }`}>
                          {req.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
