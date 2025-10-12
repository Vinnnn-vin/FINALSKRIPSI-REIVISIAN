// File: hooks/useDashboard.ts
// ================================
import { useDashboardStore } from '@/stores/dashboardStore';
import { useAuth } from './useAuth';
import { useCallback, useEffect } from 'react';

export const useDashboard = () => {
  const { user } = useAuth();
  const {
    studentStats,
    lecturerStats,
    adminStats,
    isLoading,
    error,
    fetchStudentDashboard,
    fetchLecturerDashboard,
    fetchAdminDashboard,
    clearError,
  } = useDashboardStore();

  const loadDashboard = useCallback(async () => {
    if (!user) return;
    
    switch (user.role) {
      case 'student':
        await fetchStudentDashboard();
        break;
      case 'lecturer':
        await fetchLecturerDashboard();
        break;
      case 'admin':
        await fetchAdminDashboard();
        break;
    }
  }, [user, fetchStudentDashboard, fetchLecturerDashboard, fetchAdminDashboard]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const getCurrentStats = useCallback(() => {
    if (!user) return null;
    
    switch (user.role) {
      case 'student':
        return studentStats;
      case 'lecturer':
        return lecturerStats;
      case 'admin':
        return adminStats;
      default:
        return null;
    }
  }, [user, studentStats, lecturerStats, adminStats]);

  return {
    stats: getCurrentStats(),
    isLoading,
    error,
    loadDashboard,
    clearError,
  };
};