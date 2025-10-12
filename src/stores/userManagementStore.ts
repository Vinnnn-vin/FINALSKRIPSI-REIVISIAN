// src\stores\userManagementStore.ts

import { create } from 'zustand';
import { UserManagementView, AdminUpdateUserPayload, UserRole } from '@/types';

interface UserManagementState {
  users: UserManagementView[];
  selectedUser: UserManagementView | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    role?: string;
    is_active?: boolean;
    search?: string;
    page: number;
    limit: number;
  };
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
}

interface UserManagementActions {
  fetchUsers: () => Promise<void>;
  updateUser: (userId: number, data: AdminUpdateUserPayload) => Promise<void>;
  deactivateUser: (userId: number) => Promise<void>;
  activateUser: (userId: number) => Promise<void>;
  changeUserRole: (userId: number, role: UserRole) => Promise<void>;
  resetUserPassword: (userId: number) => Promise<void>;
  setFilters: (filters: Partial<UserManagementState['filters']>) => void;
  clearError: () => void;
  setSelectedUser: (user: UserManagementView | null) => void;
}

export const useUserManagementStore = create<UserManagementState & UserManagementActions>((set, get) => ({
  users: [],
  selectedUser: null,
  isLoading: false,
  error: null,
  filters: { page: 1, limit: 20 },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  },

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const queryParams = new URLSearchParams();
      Object.entries(get().filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/admin/users?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      set({
        users: data.data,
        pagination: {
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalCount: data.totalCount,
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch users',
        isLoading: false,
      });
    }
  },

  updateUser: async (userId: number, data: AdminUpdateUserPayload) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update user');
      
      const result = await response.json();
      
      set((state) => ({
        users: state.users.map(u => 
          u.user_id === userId ? result.user : u
        ),
        selectedUser: state.selectedUser?.user_id === userId ? result.user : state.selectedUser,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update user',
        isLoading: false,
      });
    }
  },

  deactivateUser: async (userId: number) => {
    await get().updateUser(userId, { is_active: false });
  },

  activateUser: async (userId: number) => {
    await get().updateUser(userId, { is_active: true });
  },

  changeUserRole: async (userId: number, role: UserRole) => {
    await get().updateUser(userId, { role });
  },

  resetUserPassword: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/admin/users/${userId}/reset-password`, {
        method: 'POST',
      });
      
      if (!response.ok) throw new Error('Failed to reset password');
      
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reset password',
        isLoading: false,
      });
    }
  },

  setFilters: (filters: Partial<UserManagementState['filters']>) => {
    set((state) => ({
      filters: { ...state.filters, ...filters, page: 1 }
    }));
  },

  clearError: () => set({ error: null }),
  setSelectedUser: (user: UserManagementView | null) => set({ selectedUser: user }),
}));