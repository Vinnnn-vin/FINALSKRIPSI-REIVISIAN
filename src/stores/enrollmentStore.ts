// src\stores\enrollmentStore.ts
import { create } from 'zustand';
import { EnrolledCourse, EnrollmentFilters, PaginatedApiResponse } from '@/types';

interface EnrollmentState {
  enrolledCourses: EnrolledCourse[];
  inProgressCourses: EnrolledCourse[];
  completedCourses: EnrolledCourse[];
  isLoading: boolean;
  error: string | null;
  filters: EnrollmentFilters;
}

interface EnrollmentActions {
  fetchEnrolledCourses: (filters?: EnrollmentFilters) => Promise<void>;
  enrollInCourse: (courseId: number) => Promise<void>;
  markCourseComplete: (enrollmentId: number) => Promise<void>;
  clearError: () => void;
  refreshEnrollments: () => Promise<void>;
  
  // For instructors to view their course enrollments
  fetchCourseEnrollments: (courseId: number) => Promise<void>;
}

export const useEnrollmentStore = create<EnrollmentState & EnrollmentActions>((set, get) => ({
  enrolledCourses: [],
  inProgressCourses: [],
  completedCourses: [],
  isLoading: false,
  error: null,
  filters: { page: 1, limit: 50 },

  fetchEnrolledCourses: async (filters?: EnrollmentFilters) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = { ...get().filters, ...filters };
      const queryParams = new URLSearchParams();
      
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== 0) {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/enrollments?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch enrollments');
      
      const data: PaginatedApiResponse<EnrolledCourse> = await response.json();
      const allEnrollments = data.data;
      const inProgress = allEnrollments.filter(e => e.status === 'active');
      const completed = allEnrollments.filter(e => e.status === 'completed');
      
      set({
        enrolledCourses: allEnrollments,
        inProgressCourses: inProgress,
        completedCourses: completed,
        filters: currentFilters,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch enrollments',
        isLoading: false,
      });
    }
  },

  enrollInCourse: async (courseId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ course_id: courseId }),
      });
      
      if (!response.ok) throw new Error('Failed to enroll in course');
      
      await get().fetchEnrolledCourses();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to enroll in course',
        isLoading: false,
      });
      throw error;
    }
  },

  markCourseComplete: async (enrollmentId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/enrollments/${enrollmentId}/complete`, {
        method: 'PUT',
      });
      
      if (!response.ok) throw new Error('Failed to mark course as complete');
      
      await get().fetchEnrolledCourses();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to mark course as complete',
        isLoading: false,
      });
    }
  },

  fetchCourseEnrollments: async (courseId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/courses/${courseId}/enrollments`);
      if (!response.ok) throw new Error('Failed to fetch course enrollments');
      
      const data = await response.json();
      set({
        enrolledCourses: data.enrollments,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch course enrollments',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
  refreshEnrollments: async () => {
    await get().fetchEnrolledCourses(get().filters);
  },
}));