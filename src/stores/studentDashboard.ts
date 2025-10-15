// src\stores\studentDashboard.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { notifications } from '@mantine/notifications';
import { StudentDashboardData, Enrollment, Course } from '@/types/dashboard';

// Tipe untuk State
type DashboardStatus = 'idle' | 'loading' | 'error' | 'success';

interface DashboardState {
  status: DashboardStatus;
  data: StudentDashboardData | null;
  error: string | null;
  
  // State UI
  activeTab: string;
  searchTerm: string;
  filterLevel: string; // 'all', 'Beginner', etc.
  enrollingCourseIds: Set<number>; // Untuk loading button enroll
}

// Tipe untuk Actions
interface DashboardActions {
  initialize: (initialData: StudentDashboardData) => void;
  setTab: (tab: string) => void;
  setFilter: (term: string, level: string) => void;
  enrollInCourse: (courseId: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

// Helper untuk fetch data (digunakan oleh action)
const fetchApiData = async (): Promise<StudentDashboardData> => {
  const response = await fetch('/api/dashboard/student', { cache: 'no-cache' });
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || 'Failed to fetch dashboard data');
  }
  return response.json();
};

export const useStudentDashboardStore = create<DashboardState & DashboardActions>((set, get) => ({
  // Initial State
  status: 'loading',
  data: null,
  error: null,
  activeTab: 'overview',
  searchTerm: '',
  filterLevel: 'all',
  enrollingCourseIds: new Set(),

  // Actions
  initialize: (initialData) => {
    set({ data: initialData, status: 'success' });
  },

  setTab: (tab) => set({ activeTab: tab }),

  setFilter: (term, level) => set({ searchTerm: term, filterLevel: level }),

  refreshData: async () => {
    try {
      set({ status: 'loading' });
      const data = await fetchApiData();
      set({ data, status: 'success', error: null });
    } catch (e: any) {
      set({ status: 'error', error: e.message });
    }
  },

  enrollInCourse: async (courseId) => {
    set((state) => ({
      enrollingCourseIds: new Set(state.enrollingCourseIds).add(courseId),
    }));

    try {
      const response = await fetch('/api/dashboard/student/enroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to enroll');
      }

      notifications.show({ title: 'Success!', message: 'Successfully enrolled!', color: 'green' });
      // Refresh data setelah berhasil
      const freshData = await fetchApiData();
      set({ data: freshData });

    } catch (e: any) {
      notifications.show({ title: 'Error', message: e.message, color: 'red' });
    } finally {
      set((state) => {
        const newSet = new Set(state.enrollingCourseIds);
        newSet.delete(courseId);
        return { enrollingCourseIds: newSet };
      });
    }
  },
}));