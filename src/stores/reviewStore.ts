// src\stores\reviewStore.ts

/* eslint-disable @typescript-eslint/no-unused-vars */

import { create } from 'zustand';
import { Review, ReviewCreationData } from '@/types';

interface ReviewState {
  reviews: Review[];
  courseReviews: Review[];
  userReviews: Review[];
  isLoading: boolean;
  error: string | null;
  averageRating: number;
  totalReviews: number;
}

interface ReviewActions {
  // Fetch reviews
  fetchReviewsByCourse: (courseId: number) => Promise<void>;
  fetchReviewsByUser: (userId: number) => Promise<void>;
  
  // Create and manage reviews
  createReview: (data: ReviewCreationData) => Promise<void>;
  updateReview: (reviewId: number, data: Partial<ReviewCreationData>) => Promise<void>;
  deleteReview: (reviewId: number) => Promise<void>;
  
  // Check if user can review
  canUserReview: (courseId: number, userId: number) => Promise<boolean>;
  
  clearError: () => void;
}

export const useReviewStore = create<ReviewState & ReviewActions>((set, get) => ({
  reviews: [],
  courseReviews: [],
  userReviews: [],
  isLoading: false,
  error: null,
  averageRating: 0,
  totalReviews: 0,

  fetchReviewsByCourse: async (courseId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/courses/${courseId}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch reviews');
      
      const data = await response.json();
      set({
        courseReviews: data.reviews,
        averageRating: data.averageRating || 0,
        totalReviews: data.totalReviews || 0,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch reviews',
        isLoading: false,
      });
    }
  },

  fetchReviewsByUser: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/users/${userId}/reviews`);
      if (!response.ok) throw new Error('Failed to fetch user reviews');
      
      const data = await response.json();
      set({
        userReviews: data.reviews,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch user reviews',
        isLoading: false,
      });
    }
  },

  createReview: async (data: ReviewCreationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create review');
      
      const result = await response.json();
      
      set((state) => ({
        courseReviews: [...state.courseReviews, result.review],
        userReviews: [...state.userReviews, result.review],
        totalReviews: state.totalReviews + 1,
        isLoading: false,
      }));

      // Refetch to get updated average rating
      get().fetchReviewsByCourse(data.course_id || 0);
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create review',
        isLoading: false,
      });
    }
  },

  updateReview: async (reviewId: number, data: Partial<ReviewCreationData>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update review');
      
      const result = await response.json();
      
      set((state) => ({
        courseReviews: state.courseReviews.map(r => 
          r.review_id === reviewId ? result.review : r
        ),
        userReviews: state.userReviews.map(r => 
          r.review_id === reviewId ? result.review : r
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update review',
        isLoading: false,
      });
    }
  },

  deleteReview: async (reviewId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete review');
      
      set((state) => ({
        courseReviews: state.courseReviews.filter(r => r.review_id !== reviewId),
        userReviews: state.userReviews.filter(r => r.review_id !== reviewId),
        totalReviews: Math.max(0, state.totalReviews - 1),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete review',
        isLoading: false,
      });
    }
  },

  canUserReview: async (courseId: number, userId: number) => {
    try {
      const response = await fetch(`/api/courses/${courseId}/can-review?userId=${userId}`);
      if (!response.ok) return false;
      
      const data = await response.json();
      return data.canReview;
    } catch (error) {
      return false;
    }
  },

  clearError: () => set({ error: null }),
}));