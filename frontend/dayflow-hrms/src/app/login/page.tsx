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
  CheckCircle2,
  KeyRound,
  RefreshCw,
  Send,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types/hrms';

export default function LoginPage() {
  const router = useRouter();
  const { login, sendOtp, verifyOtp, switchRole } = useAuth();

  const [activePortal, setActivePortal] = useState<UserRole>('EMPLOYEE');
  const [authMode, setAuthMode] = useState<'otp' | 'password'>('otp');

  // Form State
  const [email, setEmail] = useState('sarah.jenkins@dayflow.io');
  const [password, setPassword] = useState('password123');
  const [employeeId, setEmployeeId] = useState('DF-8902');
  
  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Switch active role portal
  const handlePortalSwitch = (portal: UserRole) => {
    setActivePortal(portal);
    switchRole(portal);
    setErrorMsg('');
    setSuccessMsg('');
    setOtpSent(false);
    setOtpCode('');
    setSimulatedOtp(null);

    if (portal === 'HR_ADMIN') {
      setEmail('elena.rostova@dayflow.io');
      setEmployeeId('HR-1001');
    } else {
      setEmail('sarah.jenkins@dayflow.io');
      setEmployeeId('DF-8902');
    }
  };

  // Step 1: Send OTP
  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setErrorMsg('Please enter a valid work email address.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const res = sendOtp(email);
      setIsLoading(false);
      if (res.success) {
        setOtpSent(true);
        setSimulatedOtp(res.code);
        setSuccessMsg(`OTP sent to ${email}. Use the test toast banner code below!`);
      } else {
        setErrorMsg('Failed to send OTP. Please try again.');
      }
    }, 500);
  };

  // Step 2: Verify OTP & Submit
  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode || otpCode.length < 6) {
      setErrorMsg('Please enter a valid 6-digit OTP code.');
      return;
    }

    setIsLoading(true);
    setErrorMsg('');

    setTimeout(() => {
      const success = verifyOtp(email, otpCode, activePortal);
      setIsLoading(false);

      if (success) {
        if (activePortal === 'HR_ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/employee/dashboard');
        }
      } else {
        setErrorMsg('Invalid OTP code. Please enter the generated test code.');
      }
    }, 500);
  };

  // Password Login fallback
  const handlePasswordLogin = (e: React.FormEvent) => {
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
        if (activePortal === 'HR_ADMIN') {
          router.push('/admin/dashboard');
        } else {
          router.push('/employee/dashboard');
        }
      } else {
        setErrorMsg('Invalid login credentials.');
      }
    }, 500);
  };

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col justify-between p-4 sm:p-6 lg:p-8 selection:bg-indigo-500 selection:text-white relative overflow-hidden">
      
      {/* Decorative Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Top Header */}
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
          <span className="font-medium text-slate-300">OTP Auth Ready</span>
        </div>
      </header>

      {/* Main Login Form Card */}
      <main className="max-w-md w-full mx-auto my-auto relative z-10 py-6">
        <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
          
          {/* Title & Role Switcher */}
          <div className="space-y-3">
            <div className="text-center space-y-1">
              <h2 className="text-2xl font-black text-white tracking-tight">
                Secure Portal Login
              </h2>
              <p className="text-xs text-slate-400">
                Select your portal role level to log in to Dayflow
              </p>
            </div>

            {/* Role Switcher Toggle */}
            <div className="grid grid-cols-2 p-1.5 bg-slate-950/80 rounded-2xl border border-slate-800">
              <button
                type="button"
                onClick={() => handlePortalSwitch('EMPLOYEE')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activePortal === 'EMPLOYEE'
                    ? 'bg-[#6366f1] text-white glow-purple'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Employee Portal</span>
              </button>

              <button
                type="button"
                onClick={() => handlePortalSwitch('HR_ADMIN')}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activePortal === 'HR_ADMIN'
                    ? 'bg-amber-500 text-slate-950 font-black glow-amber'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Shield className="w-4 h-4" />
                <span>HR / Admin Portal</span>
              </button>
            </div>
          </div>

          {/* Quick Pre-fill Demo Button */}
          <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
              <span className="text-indigo-200">
                Demo: <strong className="text-white capitalize">{activePortal === 'HR_ADMIN' ? 'Elena Rostova (HR Admin)' : 'Sarah Jenkins (Employee)'}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                if (activePortal === 'HR_ADMIN') {
                  setEmail('elena.rostova@dayflow.io');
                  setEmployeeId('HR-1001');
                } else {
                  setEmail('sarah.jenkins@dayflow.io');
                  setEmployeeId('DF-8902');
                }
              }}
              className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
            >
              Autofill
            </button>
          </div>

          {/* Auth Method Tabs */}
          <div className="flex border-b border-slate-800 text-xs font-bold">
            <button
              type="button"
              onClick={() => setAuthMode('otp')}
              className={`pb-2 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
                authMode === 'otp'
                  ? 'border-[#6366f1] text-[#6366f1]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <KeyRound className="w-4 h-4" />
              <span>Email OTP Login</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMode('password')}
              className={`pb-2 px-3 border-b-2 flex items-center gap-1.5 transition-all ${
                authMode === 'password'
                  ? 'border-[#6366f1] text-[#6366f1]'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Password Login</span>
            </button>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs text-center font-medium animate-in fade-in">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 text-emerald-300 text-xs text-center font-medium animate-in fade-in">
              {successMsg}
            </div>
          )}

          {/* Simulated OTP Banner Toast */}
          {simulatedOtp && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950 to-purple-950 border border-indigo-700/60 shadow-xl space-y-2 animate-in fade-in">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Email OTP Code Sent!
                </span>
                <span className="text-[10px] text-slate-400">Demo Code</span>
              </div>

              <div className="flex items-center justify-between bg-slate-950/80 p-2.5 rounded-xl border border-indigo-800">
                <span className="font-mono text-lg font-black tracking-widest text-amber-400">
                  {simulatedOtp}
                </span>
                <button
                  type="button"
                  onClick={() => setOtpCode(simulatedOtp)}
                  className="px-3 py-1 bg-[#6366f1] hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition-all glow-purple"
                >
                  Autofill OTP Code
                </button>
              </div>
            </div>
          )}

          {/* EMAIL OTP LOGIN */}
          {authMode === 'otp' && (
            <>
              {!otpSent ? (
                /* Step 1: Send OTP */
                <form onSubmit={handleSendOtp} className="space-y-4">
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

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                      {activePortal === 'HR_ADMIN' ? 'HR Director Code' : 'Employee Code'}
                    </label>
                    <div className="relative">
                      <BadgeCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        placeholder={activePortal === 'HR_ADMIN' ? 'HR-1001' : 'DF-8902'}
                        value={employeeId}
                        onChange={(e) => setEmployeeId(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-all duration-200 mt-2 ${
                      activePortal === 'HR_ADMIN'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 glow-amber'
                        : 'bg-[#6366f1] hover:bg-indigo-600 glow-purple-lg'
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Send className="w-4 h-4" />
                        <span>Send 6-Digit OTP Code</span>
                      </>
                    )}
                  </button>
                </form>
              ) : (
                /* Step 2: Verify OTP */
                <form onSubmit={handleVerifyOtpSubmit} className="space-y-4 animate-in fade-in">
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider">
                        Enter 6-Digit OTP Code
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpSent(false);
                          setSimulatedOtp(null);
                        }}
                        className="text-[11px] text-indigo-400 hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" /> Change Email
                      </button>
                    </div>

                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        required
                        maxLength={6}
                        placeholder="e.g. 892104"
                        value={otpCode}
                        onChange={(e) => setOtpCode(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 text-sm font-mono tracking-widest font-bold bg-slate-950/70 border border-slate-800 rounded-xl text-amber-400 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-all duration-200 mt-2 ${
                      activePortal === 'HR_ADMIN'
                        ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 glow-amber'
                        : 'bg-[#6366f1] hover:bg-indigo-600 glow-purple-lg'
                    }`}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Verify OTP & Launch {activePortal === 'HR_ADMIN' ? 'HR Portal' : 'Employee Portal'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </>
          )}

          {/* PASSWORD LOGIN FALLBACK */}
          {authMode === 'password' && (
            <form onSubmit={handlePasswordLogin} className="space-y-4">
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
                    className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-950/70 border border-slate-800 rounded-xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"
                  />
                </div>
              </div>

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

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl text-xs font-extrabold text-white flex items-center justify-center gap-2 transition-all duration-200 mt-2 ${
                  activePortal === 'HR_ADMIN'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 glow-amber'
                    : 'bg-[#6366f1] hover:bg-indigo-600 glow-purple-lg'
                }`}
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Sign In with Password</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto w-full text-center text-xs text-slate-500 py-4 relative z-10">
        © 2026 Dayflow HRMS. Strict Role Isolation & OTP Security.
      </footer>

    </div>
  );
}
