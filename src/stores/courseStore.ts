// src\stores\courseStore.ts
// ================================
import { create } from 'zustand';
import { 
  Course, 
  CourseFilters, 
  CourseCreationData, 
  PaginatedApiResponse,
} from '@/types';

interface CourseState {
  courses: Course[];
  selectedCourse: Course | null;
  isLoading: boolean;
  error: string | null;
  filters: CourseFilters;
  pagination: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
  };
}

interface CourseActions {
  // Course management
  fetchCourses: (filters?: CourseFilters) => Promise<void>;
  fetchCourseById: (id: number) => Promise<void>;
  fetchCoursesByInstructor: (instructorId: number) => Promise<void>;
  createCourse: (data: CourseCreationData) => Promise<Course>;
  updateCourse: (id: number, data: Partial<CourseCreationData>) => Promise<void>;
  deleteCourse: (id: number) => Promise<void>;
  publishCourse: (id: number) => Promise<void>;
  unpublishCourse: (id: number) => Promise<void>;
  
  // Filtering and navigation
  setFilters: (filters: Partial<CourseFilters>) => void;
  clearFilters: () => void;
  clearError: () => void;
  setSelectedCourse: (course: Course | null) => void;
}

export const useCourseStore = create<CourseState & CourseActions>((set, get) => ({
  // Initial state
  courses: [],
  selectedCourse: null,
  isLoading: false,
  error: null,
  filters: { page: 1, limit: 10 },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalCount: 0,
  },

  fetchCourses: async (filters?: CourseFilters) => {
    set({ isLoading: true, error: null });
    try {
      const currentFilters = { ...get().filters, ...filters };
      const queryParams = new URLSearchParams();
      
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          queryParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/courses?${queryParams.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch courses');
      
      const data: PaginatedApiResponse<Course> = await response.json();
      
      set({
        courses: data.data,
        filters: currentFilters,
        pagination: {
          currentPage: data.currentPage,
          totalPages: data.totalPages,
          totalCount: data.totalCount,
        },
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch courses',
        isLoading: false,
      });
    }
  },

  fetchCourseById: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/courses/${id}`);
      if (!response.ok) throw new Error('Failed to fetch course');
      
      const data = await response.json();
      set({
        selectedCourse: data.course,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch course',
        isLoading: false,
      });
    }
  },

  fetchCoursesByInstructor: async (instructorId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/instructors/${instructorId}/courses`);
      if (!response.ok) throw new Error('Failed to fetch instructor courses');
      
      const data = await response.json();
      set({
        courses: data.courses,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch instructor courses',
        isLoading: false,
      });
    }
  },

  createCourse: async (data: CourseCreationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create course');
      
      const result = await response.json();
      get().fetchCourses(get().filters);
      
      set({ isLoading: false });
      return result.course;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create course',
        isLoading: false,
      });
      throw error;
    }
  },

  updateCourse: async (id: number, data: Partial<CourseCreationData>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update course');
      
      const result = await response.json();
      const currentSelected = get().selectedCourse;
      if (currentSelected && currentSelected.course_id === id) {
        set({ selectedCourse: result.course });
      }
      
      get().fetchCourses(get().filters);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update course',
        isLoading: false,
      });
    }
  },

  deleteCourse: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/courses/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete course');
      
      set((state) => ({
        courses: state.courses.filter(course => course.course_id !== id),
        selectedCourse: state.selectedCourse?.course_id === id ? null : state.selectedCourse,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete course',
        isLoading: false,
      });
    }
  },

  publishCourse: async (id: number) => {
    await get().updateCourse(id, { publish_status: 1 }); // Publish
  },

  unpublishCourse: async (id: number) => {
    await get().updateCourse(id, { publish_status: 0 }); // Draft
  },

  setFilters: (filters: Partial<CourseFilters>) => set((state) => ({ 
    filters: { ...state.filters, ...filters } 
  })),
  clearFilters: () => set({ filters: { page: 1, limit: 10 } }),
  clearError: () => set({ error: null }),
  setSelectedCourse: (course: Course | null) => set({ selectedCourse: course }),
}));