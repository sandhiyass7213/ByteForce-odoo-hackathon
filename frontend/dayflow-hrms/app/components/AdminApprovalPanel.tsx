'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  X, 
  MessageSquare, 
  Clock, 
  Users, 
  CheckCircle2, 
  AlertCircle, 
  Search,
  Filter
} from 'lucide-react';
import { LeaveRequest, LeaveStatus } from '../types/hrms';

interface AdminApprovalPanelProps {
  leaveRequests: LeaveRequest[];
  onApprove: (id: string, comment: string) => void;
  onReject: (id: string, comment: string) => void;
}

export default function AdminApprovalPanel({
  leaveRequests,
  onApprove,
  onReject,
}: AdminApprovalPanelProps) {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [feedbackComment, setFeedbackComment] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('PENDING');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const pendingCount = leaveRequests.filter((r) => r.status === 'Pending').length;
  const approvedCount = leaveRequests.filter((r) => r.status === 'Approved').length;
  const rejectedCount = leaveRequests.filter((r) => r.status === 'Rejected').length;

  const filteredRequests = leaveRequests.filter((req) => {
    const matchesTab =
      activeTab === 'ALL' || req.status.toUpperCase() === activeTab;
    const matchesQuery =
      req.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.leaveType.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesQuery;
  });

  const handleOpenActionModal = (req: LeaveRequest, type: 'approve' | 'reject') => {
    setSelectedRequest(req);
    setActionType(type);
    setFeedbackComment(
      type === 'approve'
        ? 'Approved. Have a good break!'
        : 'Unfortunately rejected due to project schedule constraints.'
    );
  };

  const handleConfirmAction = () => {
    if (!selectedRequest || !actionType) return;
    if (actionType === 'approve') {
      onApprove(selectedRequest.id, feedbackComment);
    } else {
      onReject(selectedRequest.id, feedbackComment);
    }
    setSelectedRequest(null);
    setActionType(null);
    setFeedbackComment('');
  };

  return (
    <div className="space-y-6">
      
      {/* Top HR Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pending Approvals</p>
            <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{pendingCount}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Approved Leaves</p>
            <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{approvedCount}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-2xl">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Rejected Requests</p>
            <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">{rejectedCount}</h4>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Total Staff Managed</p>
            <h4 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-0.5">48</h4>
          </div>
        </div>

      </div>

      {/* Main Admin Action Panel */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-500" />
              <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
                Admin Leave Review Suite
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review, approve, or decline employee leave applications with feedback
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
            {['PENDING', 'APPROVED', 'REJECTED', 'ALL'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all capitalize ${
                  activeTab === tab
                    ? 'bg-amber-500 text-white shadow-sm font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                {tab.toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by employee name, department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs bg-slate-100/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>

        {/* Action Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/80 dark:bg-slate-800/60 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <th className="py-3.5 px-4">Employee</th>
                <th className="py-3.5 px-4">Leave Details</th>
                <th className="py-3.5 px-4">Dates & Duration</th>
                <th className="py-3.5 px-4">Reason / Notes</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">HR Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
              {filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-10 text-center text-slate-400 font-medium">
                    No employee leave requests currently pending or matching this filter.
                  </td>
                </tr>
              ) : (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    {/* Employee Profile */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={req.employeeAvatar}
                          alt={req.employeeName}
                          className="w-9 h-9 rounded-xl object-cover ring-2 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <p className="font-bold text-slate-900 dark:text-slate-100">{req.employeeName}</p>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">{req.department}</p>
                        </div>
                      </div>
                    </td>

                    {/* Leave Type */}
                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{req.leaveType}</span>
                      <p className="text-[10px] text-slate-400">Applied: {req.appliedOn}</p>
                    </td>

                    {/* Dates */}
                    <td className="py-4 px-4 font-mono">
                      <div>{req.startDate} to {req.endDate}</div>
                      <span className="inline-block mt-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                        {req.durationDays} Days
                      </span>
                    </td>

                    {/* Reason */}
                    <td className="py-4 px-4 max-w-xs text-slate-600 dark:text-slate-300 truncate" title={req.reason}>
                      {req.reason}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        req.status === 'Approved'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : req.status === 'Rejected'
                          ? 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 animate-pulse'
                      }`}>
                        {req.status}
                      </span>
                    </td>

                    {/* Admin Action Buttons */}
                    <td className="py-4 px-4 text-right">
                      {req.status === 'Pending' ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenActionModal(req, 'approve')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] shadow-sm transition-all"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleOpenActionModal(req, 'reject')}
                            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-[11px] shadow-sm transition-all"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Reject</span>
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-400 italic">
                          {req.adminComment || 'Reviewed'}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Confirmation Feedback Modal */}
      {selectedRequest && actionType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-md shadow-2xl border border-slate-200/80 dark:border-slate-800 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl text-white ${
                actionType === 'approve' ? 'bg-emerald-600' : 'bg-rose-600'
              }`}>
                {actionType === 'approve' ? <Check className="w-6 h-6" /> : <X className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-base capitalize">
                  {actionType} Leave Request
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Employee: {selectedRequest.employeeName}
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                HR Admin Feedback / Comment (Optional)
              </label>
              <textarea
                rows={3}
                value={feedbackComment}
                onChange={(e) => setFeedbackComment(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div className="flex justify-end gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                onClick={() => {
                  setSelectedRequest(null);
                  setActionType(null);
                }}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmAction}
                className={`px-5 py-2 rounded-xl text-xs font-bold text-white shadow-md ${
                  actionType === 'approve' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                }`}
              >
                Confirm {actionType}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
