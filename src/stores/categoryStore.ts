// src\stores\categoryStore.ts

import { create } from 'zustand';
import { Category, CategoryCreationData } from '@/types';

interface CategoryState {
  categories: Category[];
  selectedCategory: Category | null;
  isLoading: boolean;
  error: string | null;
}

interface CategoryActions {
  fetchCategories: () => Promise<void>;
  createCategory: (data: CategoryCreationData) => Promise<void>;
  updateCategory: (id: number, data: Partial<CategoryCreationData>) => Promise<void>;
  deleteCategory: (id: number) => Promise<void>;
  clearError: () => void;
  setSelectedCategory: (category: Category | null) => void;
}

export const useCategoryStore = create<CategoryState & CategoryActions>((set, get) => ({
  categories: [],
  selectedCategory: null,
  isLoading: false,
  error: null,

  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      
      const data = await response.json();
      set({
        categories: data.categories,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch categories',
        isLoading: false,
      });
    }
  },

  createCategory: async (data: CategoryCreationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create category');
      
      get().fetchCategories();
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create category',
        isLoading: false,
      });
    }
  },

  updateCategory: async (id: number, data: Partial<CategoryCreationData>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update category');
      
      const result = await response.json();
      
      set((state) => ({
        categories: state.categories.map(c => 
          c.category_id === id ? result.category : c
        ),
        selectedCategory: state.selectedCategory?.category_id === id ? result.category : state.selectedCategory,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update category',
        isLoading: false,
      });
    }
  },

  deleteCategory: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete category');
      
      set((state) => ({
        categories: state.categories.filter(c => c.category_id !== id),
        selectedCategory: state.selectedCategory?.category_id === id ? null : state.selectedCategory,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete category',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
  setSelectedCategory: (category: Category | null) => set({ selectedCategory: category }),
}));