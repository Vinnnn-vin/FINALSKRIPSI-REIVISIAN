/* eslint-disable @typescript-eslint/no-unused-vars */
// File: hooks/useAuth.ts
// ================================
import { useAuthStore } from '@/stores/authStore';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

export const useAuth = () => {
  const { 
    user, 
    isAuthenticated, 
    isLoading, 
    login, 
    logout, 
    updateUser, 
    setLoading 
  } = useAuthStore();
  
  const router = useRouter();

  const handleLogout = useCallback(async () => {
    try {
      setLoading(true);
      // Call logout API if needed
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      router.push('/login');
    }
  }, [logout, router, setLoading]);

  const requireAuth = useCallback((allowedRoles?: string[]) => {
    if (!isAuthenticated) {
      router.push('/login');
      return false;
    }
    
    if (allowedRoles && user && !allowedRoles.includes(user.role || "")) {
      router.push('/unauthorized');
      return false;
    }
    
    return true;
  }, [isAuthenticated, user, router]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout: handleLogout,
    updateUser,
    requireAuth,
    isStudent: user?.role === 'student',
    isLecturer: user?.role === 'lecturer',
    isAdmin: user?.role === 'admin',
  };
};
