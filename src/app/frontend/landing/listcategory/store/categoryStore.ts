// src\app\frontend\landing\listcategory\store\categoryStore.ts
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { CategoryAPI, Category, transformCategories, sortCategories } from '../utils/categoryUtils';

interface CategoryState {
  // Data state
  categories: Category[];
  isLoading: boolean;
  error: string | null;

  // Filter state
  searchQuery: string;
  selectedCategory: string | null;
  sortBy: string;

  // Computed values
  filteredAndSortedCategories: Category[];
  popularCategories: Category[];
  totalCourses: number;
  totalStudents: number;

  // Actions
  setCategories: (categories: Category[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSelectedCategory: (category: string | null) => void;
  setSortBy: (sortBy: string) => void;
  clearFilters: () => void;
  fetchCategories: () => Promise<void>;
  
  // Private method to update computed values
  updateComputedValues: () => void;
}

export const useCategoryStore = create<CategoryState>()(
  devtools(
    (set, get) => ({
      // Initial state
      categories: [],
      isLoading: true,
      error: null,
      searchQuery: '',
      selectedCategory: null,
      sortBy: 'popular',
      filteredAndSortedCategories: [],
      popularCategories: [],
      totalCourses: 0,
      totalStudents: 0,

      // Actions
      setCategories: (categories) => {
        set({ categories });
        get().updateComputedValues();
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      setSearchQuery: (searchQuery) => {
        set({ searchQuery });
        get().updateComputedValues();
      },

      setSelectedCategory: (selectedCategory) => {
        set({ selectedCategory });
        get().updateComputedValues();
      },

      setSortBy: (sortBy) => {
        set({ sortBy });
        get().updateComputedValues();
      },

      clearFilters: () => {
        set({ 
          searchQuery: '', 
          selectedCategory: null 
        });
        get().updateComputedValues();
      },

      fetchCategories: async () => {
        set({ isLoading: true, error: null });

        try {
          const response = await fetch('/api/landing/listcategory');

          if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new Error(
              errorData?.message ||
                `Server error: ${response.status} ${response.statusText}`
            );
          }

          const data = await response.json();

          let categoriesData: CategoryAPI[];

          if (Array.isArray(data)) {
            categoriesData = data;
          } else if (data.success && Array.isArray(data.data)) {
            categoriesData = data.data;
          } else {
            throw new Error('Format response tidak dikenali');
          }

          if (!Array.isArray(categoriesData)) {
            throw new Error('Data format tidak sesuai - expected array');
          }

          const transformedCategories = transformCategories(categoriesData);
          get().setCategories(transformedCategories);
        } catch (err: any) {
          console.error('Error fetching categories:', err);
          set({ 
            error: err.message || 'Terjadi kesalahan saat memuat data kategori' 
          });
        } finally {
          set({ isLoading: false });
        }
      },

      // Private method to update computed values
      updateComputedValues: () => {
        const state = get();
        
        // Filter categories based on search
        let filtered = state.categories.filter(
          (category) =>
            category.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
            category.description.toLowerCase().includes(state.searchQuery.toLowerCase())
        );

        // Sort filtered categories
        const filteredAndSortedCategories = sortCategories(filtered, state.sortBy);

        // Popular categories (categories with courses available)
        const popularCategories = state.categories.filter((cat) => cat.courseCount > 0);

        // Calculate totals
        const totalCourses = state.categories.reduce((sum, cat) => sum + cat.courseCount, 0);
        const totalStudents = state.categories.reduce((sum, cat) => sum + cat.studentCount, 0);

        set({
          filteredAndSortedCategories,
          popularCategories,
          totalCourses,
          totalStudents,
        });
      },
    }),
    {
      name: 'category-store',
    }
  )
);
