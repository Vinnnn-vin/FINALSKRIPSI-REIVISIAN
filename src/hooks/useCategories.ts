/* eslint-disable react-hooks/exhaustive-deps */
// File: hooks/useCategories.ts
// Hook untuk mengelola kategori kursus - untuk dropdown filter dan admin management
import { useEffect } from 'react';
import { useCategoryStore } from '@/stores/categoryStore';

export const useCategories = (autoFetch = true) => {
  const store = useCategoryStore();
  
  // Auto-fetch kategori saat hook digunakan (biasanya untuk dropdown)
  useEffect(() => {
    if (autoFetch) {
      store.fetchCategories();
    }
  }, [autoFetch]);
  
  return store;
};