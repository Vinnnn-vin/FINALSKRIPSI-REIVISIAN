// src\app\frontend\dashboard\student\stores\useLearningDashboard.ts
// src\app\frontend\dashboard\student\features\dashboard-overview\stores\useLearningDashboard.ts

import { create } from "zustand";

interface QuizResult {
  quiz: { id: number; title: string; passing_score: number };
  attemptId: number;
  score: number;
  status: string;
  attempt_date: string;
  detailedResults: {
    question_id: number;
    text: string;
    selected_option: number | null;
    options: { id: number; text: string; is_correct: boolean }[];
  }[];
}

interface LearningDashboardState {
  quizResult: QuizResult | null;
  loading: boolean;
  error: string | null;

  fetchQuizResult: (
    enrollmentId: string | number,
    quizId: string | number,
    attemptId: string | number
  ) => Promise<QuizResult | null>;
  
  clearError: () => void;
  clearResult: () => void;
}

export const useLearningDashboard = create<LearningDashboardState>((set, get) => ({
  quizResult: null,
  loading: false,
  error: null,

  fetchQuizResult: async (enrollmentId, quizId, attemptId) => {
    set({ loading: true, error: null });
    
    try {
      console.log('Fetching quiz result:', { enrollmentId, quizId, attemptId });
      
      const res = await fetch(
        `/api/dashboard/student/learn/${encodeURIComponent(
          String(enrollmentId)
        )}/quiz/submit?quizId=${encodeURIComponent(String(quizId))}&attemptId=${encodeURIComponent(String(attemptId))}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache', // FIX: Prevent caching issues
        }
      );

      console.log('Response status:', res.status);

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: `HTTP ${res.status}: ${res.statusText}` }));
        throw new Error(errorData.error || `Failed to fetch quiz result: ${res.statusText}`);
      }

      const data = await res.json();
      console.log('Quiz result data:', data);

      // FIX: Validate the response data structure
      if (!data || typeof data !== 'object') {
        throw new Error('Invalid response format');
      }

      if (!data.quiz || !data.detailedResults) {
        console.warn('Missing expected fields in response:', data);
        throw new Error('Incomplete quiz result data');
      }

      set({ quizResult: data, loading: false, error: null });
      return data;
    } catch (err) {
      console.error("fetchQuizResult error:", err);
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Failed to fetch quiz result";
      
      set({
        error: errorMessage,
        loading: false,
        quizResult: null,
      });
      return null;
    }
  },

  clearError: () => set({ error: null }),
  
  clearResult: () => set({ quizResult: null, error: null, loading: false }),
}));