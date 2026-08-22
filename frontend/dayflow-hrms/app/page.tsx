'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from './context/AuthContext';
import LoginPage from './login/page';
import EmployeeDashboardPage from './employee/dashboard/page';
import AdminDashboardPage from './admin/dashboard/page';

export default function Home() {
  const router = useRouter();
  const { role, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (role === 'admin') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/employee/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, role, router]);

  // If loading or unauthenticated, render dark-themed Login Page directly for zero lag
  if (isLoading || !isAuthenticated) {
    return <LoginPage />;
  }

  // If authenticated, render respective dashboard
  if (role === 'admin') {
    return <AdminDashboardPage />;
  }

  return <EmployeeDashboardPage />;
}