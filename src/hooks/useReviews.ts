// File: hooks/useReviews.ts
// Hook untuk mengelola review kursus - langsung return store
import { useReviewStore } from '@/stores/reviewStore';

export const useReviews = () => {
  const store = useReviewStore();
  return store;
};