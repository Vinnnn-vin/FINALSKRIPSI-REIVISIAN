// src\stores\assignmentStore.ts
/* eslint-disable @typescript-eslint/no-unused-vars */
// ================================
import { create } from 'zustand';
import { Assignment, AssignmentSubmission, AssignmentFeedback } from '@/types';

interface AssignmentState {
  assignments: Assignment[];
  submissions: AssignmentSubmission[];
  selectedAssignment: Assignment | null;
  selectedSubmission: AssignmentSubmission | null;
  isLoading: boolean;
  error: string | null;
}

interface AssignmentActions {
  fetchAssignmentsByMaterial: (materialId: number) => Promise<void>;
  createAssignment: (data: Omit<Assignment, 'assignment_id'>) => Promise<void>;
  updateAssignment: (id: number, data: Partial<Assignment>) => Promise<void>;
  deleteAssignment: (id: number) => Promise<void>;
  
  // For instructors - review submissions
  fetchSubmissionsByAssignment: (assignmentId: number) => Promise<void>;
  provideFeedback: (submissionId: number, feedback: AssignmentFeedback) => Promise<void>;
  
  // For students - submit assignments
  fetchStudentSubmissions: (userId: number) => Promise<void>;
  submitAssignment: (data: Omit<AssignmentSubmission, 'submission_id' | 'submitted_at' | 'status'>) => Promise<void>;
  
  clearError: () => void;
  setSelectedAssignment: (assignment: Assignment | null) => void;
  setSelectedSubmission: (submission: AssignmentSubmission | null) => void;
}

export const useAssignmentStore = create<AssignmentState & AssignmentActions>((set, get) => ({
  assignments: [],
  submissions: [],
  selectedAssignment: null,
  selectedSubmission: null,
  isLoading: false,
  error: null,

  fetchAssignmentsByMaterial: async (materialId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/materials/${materialId}/assignments`);
      if (!response.ok) throw new Error('Failed to fetch assignments');
      
      const data = await response.json();
      set({
        assignments: data.assignments,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch assignments',
        isLoading: false,
      });
    }
  },

  createAssignment: async (data: Omit<Assignment, 'assignment_id'>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create assignment');
      
      const result = await response.json();
      set((state) => ({
        assignments: [...state.assignments, result.assignment],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create assignment',
        isLoading: false,
      });
    }
  },

  updateAssignment: async (id: number, data: Partial<Assignment>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/assignments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update assignment');
      
      const result = await response.json();
      
      set((state) => ({
        assignments: state.assignments.map(a => 
          a.assignment_id === id ? result.assignment : a
        ),
        selectedAssignment: state.selectedAssignment?.assignment_id === id ? result.assignment : state.selectedAssignment,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update assignment',
        isLoading: false,
      });
    }
  },

  deleteAssignment: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/assignments/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete assignment');
      
      set((state) => ({
        assignments: state.assignments.filter(a => a.assignment_id !== id),
        selectedAssignment: state.selectedAssignment?.assignment_id === id ? null : state.selectedAssignment,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete assignment',
        isLoading: false,
      });
    }
  },

  fetchSubmissionsByAssignment: async (assignmentId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/assignments/${assignmentId}/submissions`);
      if (!response.ok) throw new Error('Failed to fetch submissions');
      
      const data = await response.json();
      set({
        submissions: data.submissions,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch submissions',
        isLoading: false,
      });
    }
  },

  provideFeedback: async (submissionId: number, feedback: AssignmentFeedback) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/submissions/${submissionId}/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(feedback),
      });
      
      if (!response.ok) throw new Error('Failed to provide feedback');
      
      const result = await response.json();
      
      set((state) => ({
        submissions: state.submissions.map(s => 
          s.submission_id === submissionId ? result.submission : s
        ),
        selectedSubmission: state.selectedSubmission?.submission_id === submissionId ? 
          result.submission : state.selectedSubmission,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to provide feedback',
        isLoading: false,
      });
    }
  },

  fetchStudentSubmissions: async (userId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/users/${userId}/submissions`);
      if (!response.ok) throw new Error('Failed to fetch student submissions');
      
      const data = await response.json();
      set({
        submissions: data.submissions,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch student submissions',
        isLoading: false,
      });
    }
  },

  submitAssignment: async (data: Omit<AssignmentSubmission, 'submission_id' | 'submitted_at' | 'status'>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to submit assignment');
      
      const result = await response.json();
      
      set((state) => ({
        submissions: [...state.submissions, result.submission],
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to submit assignment',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
  setSelectedAssignment: (assignment: Assignment | null) => set({ selectedAssignment: assignment }),
  setSelectedSubmission: (submission: AssignmentSubmission | null) => set({ selectedSubmission: submission }),
}));