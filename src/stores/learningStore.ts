// src\stores\learningStore.ts

import { create } from "zustand";

interface Instructor {
  user_id: number;
  first_name: string;
  last_name: string;
}

interface MaterialDetail {
  material_detail_id: number;
  material_detail_name: string;
  material_detail_type: "video" | "document" | "audio" | "assignment";
  material_detail_description: string;
  is_completed: boolean;
  material_detail_url: string;
  is_free: boolean;
  can_download: boolean;
}

interface Quiz {
  quiz_id: number;
  quiz_title: string;
  quiz_description: string;
  passing_score: number;
  max_attempts: number;
  is_completed: boolean;
  best_score?: number;
}

interface Material {
  material_id: number;
  material_name: string;
  material_description: string;
  details: MaterialDetail[];
  quizzes: Quiz[];
  order_index: number;
}

interface Course {
  course_id: number;
  course_title: string;
  course_description: string;
  instructor: Instructor;
  materials: Material[];
}

interface LearningData {
  enrollment_id: number;
  course: Course;
  progress_percentage: number;
  completed_materials: number;
  total_materials: number;
  can_download_certificate: boolean;
}

interface SelectedItem {
  type: "detail" | "quiz";
  id: number;
  material_id: number;
}

interface LearningState {
  data: LearningData | null;
  loading: boolean;
  error: string | null;
  selectedItem: SelectedItem | null;
  enrollmentId: string | null;
}

interface LearningActions {
  // Data management
  fetchLearningData: (enrollmentId: string) => Promise<void>;
  setSelectedItem: (item: SelectedItem | null) => void;

  // Progress tracking
  markDetailAsComplete: (materialDetailId: number) => Promise<void>;
  markQuizAsComplete: (quizId: number, score: number) => Promise<void>;

  // Certificate
  downloadCertificate: () => Promise<void>;

  // Utility
  clearData: () => void;
  resetState: () => void;
}

export const useLearningStore = create<LearningState & LearningActions>(
  (set, get) => ({
    // Initial state
    data: null,
    loading: false,
    error: null,
    selectedItem: null,
    enrollmentId: null,

    fetchLearningData: async (enrollmentId: string) => {
      set({ loading: true, error: null, enrollmentId });
      try {
        const response = await fetch(`/api/learning/${enrollmentId}`);
        if (!response.ok) throw new Error("Failed to fetch learning data");

        const data = await response.json();
        set({
          data: data.learningData,
          loading: false,
        });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch learning data",
          loading: false,
        });
      }
    },

    fetchQuizResult: async (
      enrollmentId: string,
      quizId: number,
      attemptId: number
    ) => {
      try {
        const response = await fetch(
          `/api/dashboard/student/learn/${enrollmentId}/quiz/${quizId}/result/${attemptId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch quiz result");
        }

        return await response.json();
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to fetch quiz result",
        });
        return null;
      }
    },

    setSelectedItem: (selectedItem) => {
      set({ selectedItem });
    },

    markDetailAsComplete: async (materialDetailId: number) => {
      const state = get();
      if (!state.data) return;

      try {
        const response = await fetch("/api/learning/mark-complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            enrollment_id: state.data.enrollment_id,
            material_detail_id: materialDetailId,
          }),
        });

        if (!response.ok) throw new Error("Failed to mark as complete");

        // Update local state
        const updatedData = {
          ...state.data,
          course: {
            ...state.data.course,
            materials: state.data.course.materials.map((material) => ({
              ...material,
              details: material.details.map((detail) =>
                detail.material_detail_id === materialDetailId
                  ? { ...detail, is_completed: true }
                  : detail
              ),
            })),
          },
        };

        // Recalculate progress
        const allDetails = updatedData.course.materials.flatMap(
          (m) => m.details
        );
        const completedDetails = allDetails.filter((d) => d.is_completed);
        updatedData.progress_percentage =
          (completedDetails.length / allDetails.length) * 100;
        updatedData.completed_materials = completedDetails.length;

        set({ data: updatedData });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to mark as complete",
        });
      }
    },

    markQuizAsComplete: async (quizId: number, score: number) => {
      const state = get();
      if (!state.data) return;

      try {
        const response = await fetch("/api/learning/quiz-complete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            enrollment_id: state.data.enrollment_id,
            quiz_id: quizId,
            score,
          }),
        });

        if (!response.ok) throw new Error("Failed to mark quiz as complete");

        // Update local state
        const updatedData = {
          ...state.data,
          course: {
            ...state.data.course,
            materials: state.data.course.materials.map((material) => ({
              ...material,
              quizzes: material.quizzes.map((quiz) =>
                quiz.quiz_id === quizId
                  ? {
                      ...quiz,
                      is_completed: true,
                      best_score: Math.max(quiz.best_score || 0, score),
                    }
                  : quiz
              ),
            })),
          },
        };

        set({ data: updatedData });
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to mark quiz as complete",
        });
      }
    },

    downloadCertificate: async () => {
      const state = get();
      if (!state.data?.can_download_certificate) {
        set({ error: "Certificate not available yet" });
        return;
      }

      try {
        const response = await fetch(
          `/api/certificates/${state.data.enrollment_id}`
        );
        if (!response.ok) throw new Error("Failed to download certificate");

        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `certificate-${state.data.course.course_title}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } catch (error) {
        set({
          error:
            error instanceof Error
              ? error.message
              : "Failed to download certificate",
        });
      }
    },

    clearData: () => {
      set({
        data: null,
        loading: false,
        error: null,
        selectedItem: null,
      });
    },

    resetState: () => {
      set({
        data: null,
        loading: false,
        error: null,
        selectedItem: null,
        enrollmentId: null,
      });
    },
  })
);
