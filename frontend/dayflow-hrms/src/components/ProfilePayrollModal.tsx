'use client';

import React from 'react';
import { User, Wallet, X, Mail, Phone, MapPin, Calendar, Award, ShieldCheck, DollarSign } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface ProfilePayrollModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfilePayrollModal({ isOpen, onClose }: ProfilePayrollModalProps) {
  const { user } = useAuth();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-xl w-full p-6 shadow-2xl space-y-6 relative overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-950/60 border border-indigo-800/60 text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Employee Profile & Payroll</h2>
              <p className="text-xs text-slate-400">Personal details and salary breakdown statement</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Details Header */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80'}
            alt={user?.fullName || 'Sarah'}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500/50 shadow-lg"
          />
          <div>
            <h3 className="text-base font-black text-white">{user?.fullName || 'Sarah Jenkins'}</h3>
            <p className="text-xs text-indigo-300 font-medium">{user?.designation || 'Senior UX Designer'}</p>
            <p className="text-[11px] text-slate-400">{user?.department || 'Product & Design'} • ID: {user?.employeeCode || 'DF-8902'}</p>
          </div>
        </div>

        {/* Personal Details List */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-0.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Email Address</span>
            <p className="text-slate-200 font-semibold truncate">{user?.email}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-0.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Phone Contact</span>
            <p className="text-slate-200 font-semibold">{user?.phone || '+1 (555) 234-5678'}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-0.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Date Joined</span>
            <p className="text-slate-200 font-semibold">{user?.joinDate || '06/15/2023'}</p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 space-y-0.5">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Work Location</span>
            <p className="text-slate-200 font-semibold">{user?.location || 'San Francisco, CA'}</p>
          </div>
        </div>

        {/* Payroll Details Section */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-purple-950/60 border border-indigo-800/50 space-y-3">
          <div className="flex items-center justify-between border-b border-indigo-800/40 pb-2">
            <div className="flex items-center gap-2">
              <Wallet className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">Salary Details</h4>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded-full border border-emerald-800">
              Monthly Active
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span>Basic Salary Detail</span>
              <span className="font-mono font-bold text-white">$5,000.00</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span>Salary Tax & Deductions</span>
              <span className="font-mono text-slate-400">-$300.00</span>
            </div>
            <div className="pt-2 border-t border-indigo-800/40 flex items-center justify-between text-sm">
              <span className="font-bold text-white">Net Total Monthly Salary</span>
              <span className="font-mono font-black text-emerald-400 text-base">$4,700.00</span>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl bg-[#6366f1] hover:bg-indigo-600 text-white font-extrabold text-xs shadow-lg glow-purple transition-all"
          >
            Save & Close
          </button>
        </div>

      </div>
    </div>
  );
}
