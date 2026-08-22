'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, 
  User, 
  Shield, 
  Lock, 
  Mail, 
  BadgeCheck, 
  ArrowRight, 
  Building2, 
  Briefcase,
  UserPlus
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types/hrms';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();

  const [role, setRole] = useState<Role>('employee');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [employeeCode, setEmployeeCode] = useState('');
  const [department, setDepartment] = useState('Engineering');
  const [designation, setDesignation] = useState('Frontend Engineer');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMsg('Please fill out all required fields.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      signup({
        fullName,
        email,
        role,
        department,
        designation,
        employeeCode: employeeCode || `DF-${Math.floor(1000 + Math.random() * 9000)}`,
      });
      setIsLoading(false);

      if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/employee/dashboard');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Header */}
      <header className="max-w-6xl mx-auto w-full flex items-center justify-between py-4 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white glow-purple shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
              Dayflow <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">HRMS</span>
            </h1>
            <p className="text-[11px] text-slate-400">Enterprise HR Management System</p>
          </div>
        </div>

        <Link 
          href="/login"
          className="text-xs font-bold text-slate-300 hover:text-white bg-slate-900/60 px-4 py-2 rounded-full border border-slate-800 backdrop-blur-md transition-all"
        >
          Already registered? Sign In
        </Link>
      </header>

      {/* Main Card */}
      <main className="max-w-xl w-full mx-auto my-auto relative z-10 py-6">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          
          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black text-white tracking-tight">
              Create Employee Profile
            </h2>
            <p className="text-xs text-slate-400">
              Join your company workforce on Dayflow HRMS portal
            </p>
          </div>

          {/* Role Toggle */}
          <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800">
            <button
              type="button"
              onClick={() => setRole('employee')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                role === 'employee'
                  ? 'bg-[#6366f1] text-white glow-purple'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-4 h-4" />
              <span>Employee Portal</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('admin')}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                role === 'admin'
                  ? 'bg-amber-500 text-slate-950 font-black glow-amber'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>HR / Admin Portal</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs text-center font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            
            {/* Grid 2 Cols */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="alex@dayflow.io"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                  />
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Employee ID */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Employee ID Code
                </label>
                <div className="relative">
                  <BadgeCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="DF-9941"
                    value={employeeCode}
                    onChange={(e) => setEmployeeCode(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                  />
                </div>
              </div>

              {/* Department */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Department
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Product & Design">Product & Design</option>
                    <option value="Marketing">Marketing</option>
                    <option value="People & HR Admin">People & HR Admin</option>
                    <option value="Finance & Operations">Finance & Operations</option>
                  </select>
                </div>
              </div>

            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Designation */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Job Designation
                </label>
                <div className="relative">
                  <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="e.g. Senior Frontend Engineer"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                  />
                </div>
              </div>

            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-all duration-200 mt-4 ${
                role === 'admin'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 glow-amber'
                  : 'bg-[#6366f1] hover:bg-indigo-600 glow-purple-lg'
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create {role === 'admin' ? 'HR Director' : 'Employee'} Account</span>
                </>
              )}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
            Already have an account?{' '}
            <Link href="/login" className="text-[#6366f1] hover:text-indigo-400 font-bold underline underline-offset-2">
              Sign In Here
            </Link>
          </div>

        </div>
      </main>

      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-slate-500 py-4 relative z-10">
        © 2026 Dayflow HRMS. Built with Next.js App Router & Tailwind CSS.
      </footer>

    </div>
  );
}
