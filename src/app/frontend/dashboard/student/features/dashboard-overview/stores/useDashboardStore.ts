// src\app\frontend\dashboard\student\features\dashboard-overview\stores\useDashboardStore.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { notifications } from "@mantine/notifications";
import type { Course, EnrolledCourse } from "@/types/course";

interface DashboardData {
  user: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
    member_since?: string;
  };
  stats: {
    totalEnrolled: number;
    totalCompleted: number;
    totalCertificates: number;
  };
  enrolledCourses: EnrolledCourse[];
  availableCourses: Course[];
}

interface DashboardStore {
  loading: boolean;
  error: string | null;
  dashboardData: DashboardData | null;
  rawEnrolledCourses: EnrolledCourse[];
  rawAvailableCourses: Course[];
  enrolledCourses: EnrolledCourse[];
  availableCourses: Course[];
  inProgressCourses: EnrolledCourse[];
  activeTab: string;
  searchTerm: string;
  filterLevel: string;
  sortBy: "title" | "price" | "level" | "progress";
  sortOrder: "asc" | "desc";
  enrollingCourseIds: Set<number>;
  hasActiveFilters: boolean;
  
  fetchDashboardData: () => Promise<void>;
  handleEnroll: (courseId: number) => Promise<void>;
  setActiveTab: (tab: string) => void;
  setSearchTerm: (term: string) => void;
  setFilterLevel: (level: string) => void;
  setSortBy: (sortBy: "title" | "price" | "level" | "progress") => void;
  setSortOrder: (order: "asc" | "desc") => void;
  handleClearFilters: () => void;
  isEnrolling: (courseId: number) => boolean;
  updateFilteredData: () => void;
}

export const useDashboardStore = create<DashboardStore>((set, get) => ({
  loading: false,
  error: null,
  dashboardData: null,
  rawEnrolledCourses: [],
  rawAvailableCourses: [],
  enrolledCourses: [],
  availableCourses: [],
  inProgressCourses: [],
  activeTab: "overview",
  searchTerm: "",
  filterLevel: "all",
  sortBy: "title",
  sortOrder: "asc",
  enrollingCourseIds: new Set(),

  get hasActiveFilters() {
    const state = get();
    return (
      state.searchTerm.trim() !== "" ||
      state.filterLevel !== "all" ||
      state.sortBy !== "title" ||
      state.sortOrder !== "asc"
    );
  },

  updateFilteredData: () => {
    const state = get();
    const { rawEnrolledCourses, rawAvailableCourses, searchTerm, filterLevel, sortBy, sortOrder } = state;

    const filterCourses = <T extends { course: Course }>(courses: T[]): T[] => {
      return courses.filter((item) => {
        const course = item.course;
        
        if (searchTerm.trim()) {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = 
            course.course_title?.toLowerCase().includes(searchLower) ||
            course.course_description?.toLowerCase().includes(searchLower) ||
            course.instructor?.first_name?.toLowerCase().includes(searchLower) ||
            course.instructor?.last_name?.toLowerCase().includes(searchLower) ||
            course.category?.category_name?.toLowerCase().includes(searchLower);
          
          if (!matchesSearch) return false;
        }

        if (filterLevel !== "all" && course.course_level !== filterLevel) {
          return false;
        }

        return true;
      });
    };

    const filterAvailableCourses = (courses: Course[]): Course[] => {
      return courses.filter((course) => {
        if (searchTerm.trim()) {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = 
            course.course_title?.toLowerCase().includes(searchLower) ||
            course.course_description?.toLowerCase().includes(searchLower) ||
            course.instructor?.first_name?.toLowerCase().includes(searchLower) ||
            course.instructor?.last_name?.toLowerCase().includes(searchLower) ||
            course.category?.category_name?.toLowerCase().includes(searchLower);
          
          if (!matchesSearch) return false;
        }

        if (filterLevel !== "all" && course.course_level !== filterLevel) {
          return false;
        }

        return true;
      });
    };

    const sortCourses = <T extends { course: Course }>(courses: T[]): T[] => {
      return [...courses].sort((a, b) => {
        let aValue: any, bValue: any;

        switch (sortBy) {
          case "title":
            aValue = a.course.course_title || "";
            bValue = b.course.course_title || "";
            break;
          case "price":
            aValue = a.course.course_price || 0;
            bValue = b.course.course_price || 0;
            break;
          case "level":
            const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 };
            aValue = levelOrder[a.course.course_level as keyof typeof levelOrder] || 0;
            bValue = levelOrder[b.course.course_level as keyof typeof levelOrder] || 0;
            break;
          case "progress":
            aValue = a.course.progress || 0;
            bValue = b.course.progress || 0;
            break;
          default:
            aValue = a.course.course_title || "";
            bValue = b.course.course_title || "";
        }

        if (typeof aValue === "string") {
          const comparison = aValue.localeCompare(bValue);
          return sortOrder === "asc" ? comparison : -comparison;
        } else {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        }
      });
    };

    const sortAvailableCourses = (courses: Course[]): Course[] => {
      return [...courses].sort((a, b) => {
        let aValue: any, bValue: any;

        switch (sortBy) {
          case "title":
            aValue = a.course_title || "";
            bValue = b.course_title || "";
            break;
          case "price":
            aValue = a.course_price || 0;
            bValue = b.course_price || 0;
            break;
          case "level":
            const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 };
            aValue = levelOrder[a.course_level as keyof typeof levelOrder] || 0;
            bValue = levelOrder[b.course_level as keyof typeof levelOrder] || 0;
            break;
          case "progress":
            aValue = a.progress || 0;
            bValue = b.progress || 0;
            break;
          default:
            aValue = a.course_title || "";
            bValue = b.course_title || "";
        }

        if (typeof aValue === "string") {
          const comparison = aValue.localeCompare(bValue);
          return sortOrder === "asc" ? comparison : -comparison;
        } else {
          return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
        }
      });
    };

    const filteredEnrolled = sortCourses(filterCourses(rawEnrolledCourses));
    const filteredAvailable = sortAvailableCourses(filterAvailableCourses(rawAvailableCourses));
    
    const inProgress = filteredEnrolled.filter((enrollment) => {
      const progress = enrollment.course?.progress || 0;
      return progress > 0 && progress < 100;
    });

    set({
      enrolledCourses: filteredEnrolled,
      availableCourses: filteredAvailable,
      inProgressCourses: inProgress,
    });
  },

  fetchDashboardData: async () => {
    set({ loading: true, error: null });
    
    try {
      const response = await fetch("/api/dashboard/student", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: DashboardData = await response.json();

      if (!data.user || !data.stats) {
        throw new Error("Invalid response format");
      }

      set({
        dashboardData: data,
        rawEnrolledCourses: data.enrolledCourses || [],
        rawAvailableCourses: data.availableCourses || [],
        loading: false,
        error: null,
      });

      get().updateFilteredData();
      
    } catch (error: any) {
      const errorMessage = error.message || "Failed to load dashboard data";
      
      set({
        loading: false,
        error: errorMessage,
        dashboardData: null,
        rawEnrolledCourses: [],
        rawAvailableCourses: [],
        enrolledCourses: [],
        availableCourses: [],
        inProgressCourses: [],
      });

      notifications.show({
        title: "Error",
        message: errorMessage,
        color: "red",
      });
    }
  },

  handleEnroll: async (courseId: number) => {
    const state = get();
    
    if (state.enrollingCourseIds.has(courseId)) {
      return;
    }

    set(state => ({
      enrollingCourseIds: new Set(state.enrollingCourseIds.add(courseId))
    }));

    try {
      notifications.show({
        title: "Success!",
        message: "Successfully enrolled in course!",
        color: "green",
      });

      await get().fetchDashboardData();
      
    } catch (error: any) {
      const errorMessage = error.message || "Failed to enroll in course";
      
      notifications.show({
        title: "Enrollment Failed",
        message: errorMessage,
        color: "red",
      });
    } finally {
      set(state => {
        const newSet = new Set(state.enrollingCourseIds);
        newSet.delete(courseId);
        return { enrollingCourseIds: newSet };
      });
    }
  },

  setActiveTab: (tab: string) => set({ activeTab: tab }),
  
  setSearchTerm: (term: string) => {
    set({ searchTerm: term });
    get().updateFilteredData();
  },
  
  setFilterLevel: (level: string) => {
    set({ filterLevel: level });
    get().updateFilteredData();
  },
  
  setSortBy: (sortBy: "title" | "price" | "level" | "progress") => {
    set({ sortBy });
    get().updateFilteredData();
  },
  
  setSortOrder: (order: "asc" | "desc") => {
    set({ sortOrder: order });
    get().updateFilteredData();
  },
  
  handleClearFilters: () => {
    set({
      searchTerm: "",
      filterLevel: "all",
      sortBy: "title",
      sortOrder: "asc",
    });
    get().updateFilteredData();
  },
  
  isEnrolling: (courseId: number) => {
    return get().enrollingCourseIds.has(courseId);
  },
}));