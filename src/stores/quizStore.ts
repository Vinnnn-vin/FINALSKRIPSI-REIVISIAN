// src\stores\quizStore.ts
import { create } from 'zustand';
import { Quiz, QuizQuestion, QuizAnswerOption, QuizCreationData, QuizQuestionCreationData, QuizAnswerOptionCreationData } from '@/types';

interface QuizState {
  quizzes: Quiz[];
  questions: QuizQuestion[];
  answerOptions: QuizAnswerOption[];
  selectedQuiz: Quiz | null;
  isLoading: boolean;
  error: string | null;
}

interface QuizActions {
  fetchQuizzesByMaterial: (materialId: number) => Promise<void>;
  fetchQuizById: (quizId: number) => Promise<void>;
  createQuiz: (data: QuizCreationData) => Promise<void>;
  updateQuiz: (id: number, data: Partial<QuizCreationData>) => Promise<void>;
  deleteQuiz: (id: number) => Promise<void>;
  createQuestion: (data: QuizQuestionCreationData) => Promise<void>;
  updateQuestion: (id: number, data: Partial<QuizQuestionCreationData>) => Promise<void>;
  deleteQuestion: (id: number) => Promise<void>;
  createAnswerOption: (data: QuizAnswerOptionCreationData) => Promise<void>;
  updateAnswerOption: (id: number, data: Partial<QuizAnswerOptionCreationData>) => Promise<void>;
  deleteAnswerOption: (id: number) => Promise<void>;
  clearError: () => void;
  setSelectedQuiz: (quiz: Quiz | null) => void;
}

export const useQuizStore = create<QuizState & QuizActions>((set, get) => ({
  quizzes: [],
  questions: [],
  answerOptions: [],
  selectedQuiz: null,
  isLoading: false,
  error: null,

  fetchQuizzesByMaterial: async (materialId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/materials/${materialId}/quizzes`);
      if (!response.ok) throw new Error('Failed to fetch quizzes');
      
      const data = await response.json();
      set({
        quizzes: data.quizzes,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch quizzes',
        isLoading: false,
      });
    }
  },

  fetchQuizById: async (quizId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/quizzes/${quizId}`);
      if (!response.ok) throw new Error('Failed to fetch quiz');
      
      const data = await response.json();
      set({
        selectedQuiz: data.quiz,
        questions: data.questions || [],
        answerOptions: data.answerOptions || [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch quiz',
        isLoading: false,
      });
    }
  },

  createQuiz: async (data: QuizCreationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/quizzes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create quiz');
      
      if (data.material_id) {
        get().fetchQuizzesByMaterial(data.material_id);
      }
      
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create quiz',
        isLoading: false,
      });
    }
  },

  updateQuiz: async (id: number, data: Partial<QuizCreationData>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/quizzes/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update quiz');
      
      const result = await response.json();
      
      set((state) => ({
        quizzes: state.quizzes.map(quiz => 
          quiz.quiz_id === id ? result.quiz : quiz
        ),
        selectedQuiz: state.selectedQuiz?.quiz_id === id ? result.quiz : state.selectedQuiz,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update quiz',
        isLoading: false,
      });
    }
  },

  deleteQuiz: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/quizzes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete quiz');
      
      set((state) => ({
        quizzes: state.quizzes.filter(quiz => quiz.quiz_id !== id),
        selectedQuiz: state.selectedQuiz?.quiz_id === id ? null : state.selectedQuiz,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete quiz',
        isLoading: false,
      });
    }
  },

  createQuestion: async (data: QuizQuestionCreationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/quiz-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create question');
      
      const result = await response.json();
      
      set((state) => ({
        questions: [...state.questions, result.question],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create question',
        isLoading: false,
      });
    }
  },

  updateQuestion: async (id: number, data: Partial<QuizQuestionCreationData>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/quiz-questions/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update question');
      
      const result = await response.json();
      
      set((state) => ({
        questions: state.questions.map(question => 
          question.question_id === id ? result.question : question
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update question',
        isLoading: false,
      });
    }
  },

  deleteQuestion: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/quiz-questions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete question');
      
      set((state) => ({
        questions: state.questions.filter(question => question.question_id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete question',
        isLoading: false,
      });
    }
  },

  createAnswerOption: async (data: QuizAnswerOptionCreationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/quiz-answer-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create answer option');
      
      const result = await response.json();
      
      set((state) => ({
        answerOptions: [...state.answerOptions, result.answerOption],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create answer option',
        isLoading: false,
      });
    }
  },

  updateAnswerOption: async (id: number, data: Partial<QuizAnswerOptionCreationData>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/quiz-answer-options/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update answer option');
      
      const result = await response.json();
      
      set((state) => ({
        answerOptions: state.answerOptions.map(option => 
          option.option_id === id ? result.answerOption : option
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update answer option',
        isLoading: false,
      });
    }
  },

  deleteAnswerOption: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/quiz-answer-options/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete answer option');
      
      set((state) => ({
        answerOptions: state.answerOptions.filter(option => option.option_id !== id),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete answer option',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
  setSelectedQuiz: (quiz: Quiz | null) => set({ selectedQuiz: quiz }),
}));