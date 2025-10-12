// src\app\frontend\landing\listcourse\stores\courseStore.ts
import { create } from 'zustand';
import { CourseDisplayData, UISelectOption } from '@/types/landing/list';

interface CourseState {
  courses: CourseDisplayData[];
  categories: UISelectOption[];
  totalCourses: number;
  totalPages: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  initialized: boolean;
  // Filter states
  searchQuery: string;
  selectedCategory: string | null;
  selectedLevel: string | null;
  sortBy: string;
}

interface CourseActions {
  initialize: (data: {
    initialCourses: CourseDisplayData[];
    initialTotalPages: number;
    initialTotalCourses: number;
    categories: UISelectOption[];
  }) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSelectedLevel: (level: string | null) => void;
  setSortBy: (sort: string) => void;
  setCurrentPage: (page: number) => void;
  fetchCourses: () => Promise<void>;
  resetFilters: () => void;
}

export const useCourseStore = create<CourseState & CourseActions>((set, get) => ({
  // Initial State
  courses: [],
  categories: [],
  totalCourses: 0,
  totalPages: 0,
  isLoading: false,
  error: null,
  currentPage: 1,
  initialized: false,
  searchQuery: '',
  selectedCategory: null,
  selectedLevel: null,
  sortBy: 'newest',

  // Actions
  initialize: (data) => set({
    courses: data.initialCourses,
    totalPages: data.initialTotalPages,
    totalCourses: data.initialTotalCourses,
    categories: data.categories,
    initialized: true,
  }),

  setSearchQuery: (query) => set({ searchQuery: query, currentPage: 1 }),
  setSelectedCategory: (category) => set({ selectedCategory: category, currentPage: 1 }),
  setSelectedLevel: (level) => set({ selectedLevel: level, currentPage: 1 }),
  setSortBy: (sort) => set({ sortBy: sort, currentPage: 1 }),
  setCurrentPage: (page) => set({ currentPage: page }),

  resetFilters: () => set({
    searchQuery: '',
    selectedCategory: null,
    selectedLevel: null,
    sortBy: 'newest',
    currentPage: 1,
  }),

  fetchCourses: async () => {
    const state = get();
    set({ isLoading: true, error: null });

    try {
      const params = new URLSearchParams({
        page: state.currentPage.toString(),
        limit: '9',
        sort: state.sortBy,
      });

      if (state.searchQuery) params.append('search', state.searchQuery);
      if (state.selectedCategory) params.append('category', state.selectedCategory);
      if (state.selectedLevel) params.append('level', state.selectedLevel);
      
      const response = await fetch(`/api/landing/listcourse?${params.toString()}`);
      if (!response.ok) throw new Error('Gagal mengambil data kursus.');

      const data = await response.json();
      set({
        courses: data.courses || [],
        totalCourses: data.totalCount || 0,
        totalPages: data.totalPages || 0,
        isLoading: false,
      });

    } catch (err) {
      const error = err as Error;
      set({
        error: error.message,
        isLoading: false,
        courses: [],
      });
    }
  },
}));