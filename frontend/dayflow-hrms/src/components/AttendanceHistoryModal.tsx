'use client';

import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, X, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AttendanceHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AttendanceHistoryModal({ isOpen, onClose }: AttendanceHistoryModalProps) {
  const { attendanceLogs } = useAuth();
  const [selectedMonth, setSelectedMonth] = useState('Aug 2026');

  if (!isOpen) return null;

  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-4xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Attendance History & Calendar</h2>
              <p className="text-xs text-slate-400">Monthly shift punch records and status log</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Left: Interactive Calendar Picker Widget */}
          <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <CalendarIcon className="w-4 h-4 text-indigo-400" />
                {selectedMonth}
              </span>
              <div className="flex items-center gap-1">
                <button className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-500">
              <span>S</span><span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs">
              {daysInMonth.map((day) => {
                const isToday = day === 22;
                return (
                  <button
                    key={day}
                    className={`py-1.5 rounded-lg font-mono text-[11px] transition-all ${
                      isToday
                        ? 'bg-[#6366f1] text-white font-extrabold shadow-md glow-purple'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px]">
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> On Time</span>
                <span className="text-slate-200 font-bold">18 Days</span>
              </div>
              <div className="flex items-center justify-between text-slate-400">
                <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Late Punch</span>
                <span className="text-slate-200 font-bold">2 Days</span>
              </div>
            </div>
          </div>

          {/* Right: Attendance Logs Table */}
          <div className="md:col-span-2 bg-slate-950/70 border border-slate-800 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">Attendance Logs</h3>
              <span className="text-[10px] text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded-full border border-indigo-800">
                Live Sync
              </span>
            </div>

            <div className="overflow-x-auto max-h-72 overflow-y-auto">
              <table className="w-full text-left text-xs">
                <thead className="sticky top-0 bg-slate-950 border-b border-slate-800 text-slate-400 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="pb-2">Date</th>
                    <th className="pb-2">Clock-In</th>
                    <th className="pb-2">Check-Out</th>
                    <th className="pb-2">Hours</th>
                    <th className="pb-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {attendanceLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/40">
                      <td className="py-2.5 font-mono text-slate-200 font-semibold">{log.date}</td>
                      <td className="py-2.5 font-mono text-emerald-400">{log.clockIn}</td>
                      <td className="py-2.5 font-mono text-slate-400">{log.clockOut || 'Shift Active'}</td>
                      <td className="py-2.5 font-mono text-indigo-300">{log.workHours}</td>
                      <td className="py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          log.status === 'PRESENT'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                            : 'bg-amber-950 text-amber-300 border border-amber-800'
                        }`}>
                          {log.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
