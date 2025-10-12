// File: hooks/useUserManagement.ts
// Hook untuk admin mengelola users - hanya untuk role admin
import { useEffect } from 'react';
import { useUserManagementStore } from '@/stores/userManagementStore';
import { useAuth } from './useAuth';

export const useUserManagement = (autoFetch = true) => {
  const store = useUserManagementStore();
  const { user } = useAuth();
  
  // Hanya fetch jika user adalah admin
  useEffect(() => {
    if (autoFetch && user?.role === 'admin') {
      store.fetchUsers();
    }
  }, [autoFetch, user, store]);
  
  // Refresh data setelah filter berubah
  useEffect(() => {
    if (user?.role === 'admin') {
      store.fetchUsers();
    }
  }, [store.filters, user, store]);
  
  return store;
};