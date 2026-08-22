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
  Eye, 
  EyeOff,
  Building2,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Role } from '../types/hrms';

export default function LoginPage() {
  const router = useRouter();
  const { login, switchRole } = useAuth();

  const [activePortal, setActivePortal] = useState<Role>('employee');
  const [email, setEmail] = useState('sarah.jenkins@dayflow.io');
  const [password, setPassword] = useState('password123');
  const [employeeId, setEmployeeId] = useState('DF-8902');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Switch role portal
  const handlePortalSwitch = (portal: Role) => {
    setActivePortal(portal);
    switchRole(portal);
    setErrorMsg('');
    if (portal === 'admin') {
      setEmail('elena.rostova@dayflow.io');
      setEmployeeId('HR-1001');
    } else {
      setEmail('sarah.jenkins@dayflow.io');
      setEmployeeId('DF-8902');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter your email and password.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const success = login(email, password, activePortal);
      setIsLoading(false);
      if (success) {
        if (activePortal === 'admin') {
          router.push('/admin/dashboard');
        } else {
          router.push('/employee/dashboard');
        }
      } else {
        setErrorMsg('Invalid login credentials. Please try again.');
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header Navigation */}
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

        <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-900/60 px-3.5 py-1.5 rounded-full border border-slate-800 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium text-slate-300">System Online</span>
        </div>
      </header>

      {/* Main Login Card Section */}
      <main className="max-w-md w-full mx-auto my-auto relative z-10 py-6">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Top Banner Role Switcher Toggle */}
          <div className="space-y-3">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Welcome Back
              </h2>
              <p className="text-xs text-slate-400">
                Select your portal role to access your Dayflow workspace
              </p>
            </div>

            {/* Role Switcher Switch */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => handlePortalSwitch('employee')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activePortal === 'employee'
                    ? 'bg-[#6366f1] text-white glow-purple'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Employee Portal</span>
              </button>

              <button
                type="button"
                onClick={() => handlePortalSwitch('admin')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activePortal === 'admin'
                    ? 'bg-amber-500 text-slate-950 font-black glow-amber'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>HR / Admin Portal</span>
              </button>
            </div>
          </div>

          {/* Quick Demo Pre-fill Badge */}
          <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-indigo-200">
                Demo Account: <strong className="text-white capitalize">{activePortal === 'admin' ? 'Elena Rostova (HR)' : 'Sarah Jenkins'}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (activePortal === 'admin') {
                  setEmail('elena.rostova@dayflow.io');
                  setEmployeeId('HR-1001');
                  setPassword('password123');
                } else {
                  setEmail('sarah.jenkins@dayflow.io');
                  setEmployeeId('DF-8902');
                  setPassword('password123');
                }
              }}
              className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              Autofill
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs text-center font-medium animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Role Selection Dropdown */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Role Access Level
              </label>
              <div className="relative">
                <select
                  value={activePortal}
                  onChange={(e) => handlePortalSwitch(e.target.value as Role)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 focus:outline-none focus:ring-2 focus:ring-[#6366f1] appearance-none"
                >
                  <option value="employee">Employee - Dashboard & Attendance</option>
                  <option value="admin">HR / Admin - Approvals & Directory</option>
                </select>
                <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  required
                  placeholder="name@dayflow.io"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition-all"
                />
              </div>
            </div>

            {/* Employee ID Field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                {activePortal === 'admin' ? 'HR Director Code' : 'Employee ID / Code'}
              </label>
              <div className="relative">
                <BadgeCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder={activePortal === 'admin' ? 'HR-1001' : 'DF-8902'}
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-all duration-200 mt-2 ${
                activePortal === 'admin'
                  ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 glow-amber'
                  : 'bg-[#6366f1] hover:bg-indigo-600 glow-purple-lg'
              }`}
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to {activePortal === 'admin' ? 'HR Admin Portal' : 'Employee Portal'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer switch to Signup */}
          <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
            Don't have an employee account?{' '}
            <Link href="/signup" className="text-[#6366f1] hover:text-indigo-400 font-bold underline underline-offset-2">
              Sign Up Here
            </Link>
          </div>

        </div>
      </main>

      {/* Footer Branding */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-slate-500 py-4 relative z-10">
        © 2026 Dayflow HRMS. Built for Odoo Hackathon & Role-Based Access Control (RBAC).
      </footer>

    </div>
  );
}
