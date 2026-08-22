'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  Download, 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Building2, 
  CheckCircle, 
  ShieldCheck,
  FileCheck
} from 'lucide-react';
import { PayrollBreakdown } from '../types/hrms';

interface PayrollCardProps {
  payroll: PayrollBreakdown;
}

export default function PayrollCard({ payroll }: PayrollCardProps) {
  const [downloading, setDownloading] = useState(false);
  const [downloadMsg, setDownloadMsg] = useState(false);

  const handleDownloadPayslip = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      setDownloadMsg(true);
      setTimeout(() => setDownloadMsg(false), 4000);
    }, 1200);
  };

  const netPayPercentage = Math.round(
    (payroll.netPay / payroll.grossEarnings) * 100
  );

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-sm border border-slate-200/80 dark:border-slate-800 space-y-6 relative overflow-hidden">
      
      {/* Download Alert Toast */}
      {downloadMsg && (
        <div className="absolute top-4 right-4 z-20 bg-indigo-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl animate-in fade-in slide-in-from-top-2">
          <FileCheck className="w-4 h-4" />
          <span>Payslip PDF for {payroll.payPeriod} generated! Check downloads.</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-2xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-lg">
              Payroll & Salary Summary
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Pay Period: <strong className="text-slate-800 dark:text-slate-200">{payroll.payPeriod}</strong> (Disbursed: {payroll.payDate})
            </p>
          </div>
        </div>

        <button
          onClick={handleDownloadPayslip}
          disabled={downloading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-600/20 transition-all active:scale-[0.98] disabled:opacity-70"
        >
          <Download className="w-4 h-4" />
          <span>{downloading ? 'Generating PDF...' : 'Download Payslip'}</span>
        </button>
      </div>

      {/* Hero Net Pay Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
              Net Take-Home Pay
            </span>
            <div className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-emerald-400">
              {payroll.currency}{payroll.netPay.toLocaleString()}
            </div>
            <span className="inline-block text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-bold">
              Direct Deposit Paid
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-slate-300">
              <span>Earnings Ratio:</span>
              <span className="font-bold font-mono">{netPayPercentage}% Net</span>
            </div>
            <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-400 h-full rounded-full"
                style={{ width: `${netPayPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>Gross: {payroll.currency}{payroll.grossEarnings}</span>
              <span>Deductions: {payroll.currency}{payroll.totalDeductions}</span>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md p-3.5 rounded-2xl border border-white/10 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-slate-300 font-semibold">
              <Building2 className="w-4 h-4 text-emerald-400" />
              <span>Bank Account</span>
            </div>
            <p className="font-mono text-slate-100">{payroll.bankAccount}</p>
            <p className="text-[10px] text-slate-400">PAN: {payroll.panNumber}</p>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Earnings */}
        <div className="space-y-3 bg-slate-50/70 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Earnings & Allowances
            </h4>
            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
              {payroll.currency}{payroll.grossEarnings.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Basic Salary</span>
              <span className="font-mono font-semibold">{payroll.currency}{payroll.baseSalary.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>House Rent Allowance (HRA)</span>
              <span className="font-mono font-semibold">{payroll.currency}{payroll.hra.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Special Allowance</span>
              <span className="font-mono font-semibold">{payroll.currency}{payroll.specialAllowance.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Performance Bonus</span>
              <span className="font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                +{payroll.currency}{payroll.performanceBonus.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Deductions */}
        <div className="space-y-3 bg-slate-50/70 dark:bg-slate-800/40 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 dark:border-slate-700/60">
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <TrendingDown className="w-4 h-4" />
              Statutory Deductions
            </h4>
            <span className="text-xs font-bold text-slate-900 dark:text-white font-mono">
              {payroll.currency}{payroll.totalDeductions.toLocaleString()}
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Provident Fund (PF)</span>
              <span className="font-mono font-semibold">{payroll.currency}{payroll.providentFund.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Professional Tax</span>
              <span className="font-mono font-semibold">{payroll.currency}{payroll.professionalTax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <span>Income Tax (TDS)</span>
              <span className="font-mono font-semibold text-rose-600 dark:text-rose-400">
                -{payroll.currency}{payroll.incomeTax.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
