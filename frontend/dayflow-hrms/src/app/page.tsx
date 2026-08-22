'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import LoginPage from './login/page';
import EmployeeDashboardPage from './employee/dashboard/page';
import AdminDashboardPage from './admin/dashboard/page';

export default function Home() {
  const router = useRouter();
  const { role, isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (role === 'HR_ADMIN') {
        router.replace('/admin/dashboard');
      } else {
        router.replace('/employee/dashboard');
      }
    }
  }, [isLoading, isAuthenticated, role, router]);

  if (isLoading || !isAuthenticated) {
    return <LoginPage />;
  }

  if (role === 'HR_ADMIN') {
    return <AdminDashboardPage />;
  }

  return <EmployeeDashboardPage />;
}
