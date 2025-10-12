// src\stores\dashboardStore.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
//

import { create } from "zustand";
import {
  StudentDashboardStats,
  LecturerDashboardStats,
  AdminDashboardStats,
} from "@/types";

interface DashboardState {
  studentStats: StudentDashboardStats | null;
  lecturerStats: LecturerDashboardStats | null;
  adminStats: AdminDashboardStats | null;
  isLoading: boolean;
  error: string | null;
}

interface DashboardActions {
  fetchStudentDashboard: () => Promise<void>;
  fetchLecturerDashboard: () => Promise<void>;
  fetchAdminDashboard: () => Promise<void>;
  clearError: () => void;
}

export const useDashboardStore = create<DashboardState & DashboardActions>(
  (set, get) => ({
    studentStats: null,
    lecturerStats: null,
    adminStats: null,
    isLoading: false,
    error: null,

    fetchStudentDashboard: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch("/api/dashboard/student");
        if (!response.ok) throw new Error("Failed to fetch student dashboard");

        const data = await response.json();
        set({
          studentStats: data.stats,
          isLoading: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch student dashboard",
          isLoading: false,
        });
      }
    },

    fetchLecturerDashboard: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch("/api/dashboard/lecturer");
        if (!response.ok) throw new Error("Failed to fetch lecturer dashboard");

        const data = await response.json();
        set({
          lecturerStats: data.stats,
          isLoading: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch lecturer dashboard",
          isLoading: false,
        });
      }
    },

    fetchAdminDashboard: async () => {
      set({ isLoading: true, error: null });
      try {
        const response = await fetch("/api/dashboard/admin");
        if (!response.ok) throw new Error("Failed to fetch admin dashboard");

        const data = await response.json();
        set({
          adminStats: data.stats,
          isLoading: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch admin dashboard",
          isLoading: false,
        });
      }
    },

    clearError: () => set({ error: null }),
  })
);
