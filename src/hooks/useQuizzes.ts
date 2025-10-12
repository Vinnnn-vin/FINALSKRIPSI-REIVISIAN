/* eslint-disable react-hooks/exhaustive-deps */
// File: hooks/useQuizzes.ts
// Hook untuk mengelola kuis dalam materi pembelajaran
import { useEffect } from 'react';
import { useQuizStore } from '@/stores/quizStore';

export const useQuizzes = (materialId?: number, autoFetch = true) => {
  const store = useQuizStore();
  
  // Auto-fetch kuis saat materialId berubah
  useEffect(() => {
    if (autoFetch && materialId) {
      store.fetchQuizzesByMaterial(materialId);
    }
  }, [autoFetch, materialId]);
  
  return store;
};