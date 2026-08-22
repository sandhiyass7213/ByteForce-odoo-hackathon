'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import { Sparkles } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const { role, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/employee/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, role, router]);

  return (
    <div className="min-h-screen bg-[#0b1120] text-slate-100 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col items-center gap-4 text-center relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white glow-purple shadow-xl animate-pulse">
          <Sparkles className="w-7 h-7" />
        </div>

        <h1 className="text-2xl font-black tracking-tight text-white">
          Dayflow HRMS
        </h1>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <div className="w-4 h-4 border-2 border-[#6366f1] border-t-transparent rounded-full animate-spin" />
          <span>Verifying role permissions & initializing portal...</span>
        </div>
      </div>

    </div>
  );
}