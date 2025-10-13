// src\app\frontend\dashboard\student\stores\index.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from "zustand";
import { notifications } from "@mantine/notifications";
import type { Course, EnrolledCourse } from "@/types/course";

interface UserData {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  member_since: string;
}

interface Stats {
  totalEnrolled: number;
  totalCompleted: number;
  totalCertificates: number;
}

interface DashboardData {
  user: UserData;
  stats: Stats;
  enrolledCourses: EnrolledCourse[];
  availableCourses: Course[];
}

type SortBy = "title" | "price" | "level" | "progress";
type SortOrder = "asc" | "desc";

interface DashboardStore {
  // --- State utama ---
  loading: boolean;
  error: string | null;
  dashboardData: DashboardData | null;

  enrolledCourses: EnrolledCourse[];
  availableCourses: Course[];
  inProgressCourses: EnrolledCourse[];

  // --- UI state ---
  activeTab: string;
  searchTerm: string;
  filterLevel: string;
  sortBy: SortBy;
  sortOrder: SortOrder;
  hasActiveFilters: boolean;
  enrolling: number | null;

  // --- Actions ---
  fetchDashboardData: () => Promise<void>;
  handleEnroll: (courseId: number) => Promise<void>;
  handleClearFilters: () => void;

  setActiveTab: (tab: string) => void;
  setSearchTerm: (term: string) => void;
  setFilterLevel: (level: string) => void;
  setSortBy: (sort: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;

  isEnrolling: (courseId: number) => boolean;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  // --- Default state ---
  loading: true,
  error: null,
  dashboardData: null,

  enrolledCourses: [],
  availableCourses: [],
  inProgressCourses: [],

  activeTab: "overview",
  searchTerm: "",
  filterLevel: "all",
  sortBy: "title",
  sortOrder: "asc",
  hasActiveFilters: false,
  enrolling: null,

  // --- Fetch data dashboard ---
  fetchDashboardData: async () => {
    try {
      set({ loading: true, error: null });
      const res = await fetch("/api/dashboard/student");
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || `HTTP ${res.status}`);
      }

      const data: DashboardData = await res.json();
      const inProgress = (data.enrolledCourses || []).filter(
        (c) => c.course && (c.course.progress ?? 0) < 100
      );

      set({
        dashboardData: data,
        enrolledCourses: data.enrolledCourses || [],
        availableCourses: data.availableCourses || [],
        inProgressCourses: inProgress,
      });
    } catch (err: any) {
      set({ error: err.message || "Failed to load dashboard data" });
    } finally {
      set({ loading: false });
    }
  },

  // --- Enroll course ---
  handleEnroll: async (courseId: number) => {
    try {
      set({ enrolling: courseId });
      const res = await fetch("/api/dashboard/student/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to enroll");
      }

      notifications.show({
        title: "Success",
        message: "Successfully enrolled in course!",
        color: "green",
      });

      await get().fetchDashboardData();
    } catch (err: any) {
      notifications.show({
        title: "Error",
        message: err.message || "Failed to enroll in course",
        color: "red",
      });
    } finally {
      set({ enrolling: null });
    }
  },

  // --- Clear filters ---
  handleClearFilters: () =>
    set({
      searchTerm: "",
      filterLevel: "all",
      sortBy: "title",
      sortOrder: "asc",
      hasActiveFilters: false,
    }),

  // --- Setters ---
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSearchTerm: (term) =>
    set((state) => ({
      searchTerm: term,
      hasActiveFilters:
        term.trim() !== "" ||
        state.filterLevel !== "all" ||
        state.sortBy !== "title" ||
        state.sortOrder !== "asc",
    })),
  setFilterLevel: (level) =>
    set((state) => ({
      filterLevel: level,
      hasActiveFilters:
        state.searchTerm.trim() !== "" ||
        level !== "all" ||
        state.sortBy !== "title" ||
        state.sortOrder !== "asc",
    })),
  setSortBy: (sort) =>
    set((state) => ({
      sortBy: sort,
      hasActiveFilters:
        state.searchTerm.trim() !== "" ||
        state.filterLevel !== "all" ||
        sort !== "title" ||
        state.sortOrder !== "asc",
    })),
  setSortOrder: (order) =>
    set((state) => ({
      sortOrder: order,
      hasActiveFilters:
        state.searchTerm.trim() !== "" ||
        state.filterLevel !== "all" ||
        state.sortBy !== "title" ||
        order !== "asc",
    })),

  // --- Helpers ---
  isEnrolling: (courseId) => get().enrolling === courseId,
}));
