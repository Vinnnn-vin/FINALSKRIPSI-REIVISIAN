// src\app\frontend\dashboard\student\hooks\index.ts
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect, useCallback, useMemo } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { notifications } from "@mantine/notifications";
import { DashboardData } from "../stores/";
import { filterCourses, debounce } from "../utils";
import { Course, EnrolledCourse } from "@/types";

/**
 * Hook for authentication and role checking
 */
export const useAuth = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/frontend/auth/login");
      return;
    }

    if (status === "authenticated") {
      if ((session.user as any)?.role !== "student") {
        notifications.show({
          title: "Access Denied",
          message: "You do not have permission to access this page",
          color: "red",
        });
        router.push("/frontend/landing");
        return;
      }
    }
  }, [status, session, router]);

  const handleLogout = useCallback(() => {
    signOut({ callbackUrl: "/frontend/auth/login" });
  }, []);

  return {
    session,
    status,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading",
    handleLogout,
  };
};

/**
 * Hook for dashboard data management
 */
export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      else setRefreshing(true);

      const response = await fetch("/api/dashboard/student", {
        headers: { "Content-Type": "application/json" },
        cache: "no-cache",
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Session expired. Please login again.");
        }
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch dashboard data");
      }

      const responseData = await response.json();

      // Ensure arrays exist
      responseData.enrolledCourses = responseData.enrolledCourses || [];
      responseData.availableCourses = responseData.availableCourses || [];

      setData(responseData);
      setError(null);
    } catch (error: any) {
      setError(error.message);

      if (error.message.includes("Session expired")) {
        signOut({ callbackUrl: "/frontend/auth/login" });
        return;
      }

      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const refreshData = useCallback(() => {
    fetchDashboardData(false);
  }, [fetchDashboardData]);

  return {
    data,
    loading,
    refreshing,
    error,
    refreshData,
    fetchDashboardData,
  };
};

/**
 * Hook for course enrollment
 */
export const useEnrollment = (refreshData?: () => void) => {
  const [enrollingCourses, setEnrollingCourses] = useState<Set<number>>(
    new Set()
  );

  const enrollInCourse = useCallback(
    async (courseId: number) => {
      try {
        setEnrollingCourses((prev) => new Set(prev).add(courseId));

        const response = await fetch("/api/dashboard/student/enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ courseId }),
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Session expired. Please login again.");
          }
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to enroll");
        }

        notifications.show({
          title: "Success!",
          message: "Successfully enrolled in course",
          color: "green",
        });

        if (refreshData) {
          refreshData();
        }
      } catch (error: any) {
        if (error.message.includes("Session expired")) {
          signOut({ callbackUrl: "/frontend/auth/login" });
          return;
        }

        notifications.show({
          title: "Error",
          message: error.message,
          color: "red",
        });
      } finally {
        setEnrollingCourses((prev) => {
          const newSet = new Set(prev);
          newSet.delete(courseId);
          return newSet;
        });
      }
    },
    [refreshData]
  );

  const isEnrolling = useCallback(
    (courseId: number) => {
      return enrollingCourses.has(courseId);
    },
    [enrollingCourses]
  );

  return {
    enrollInCourse,
    isEnrolling,
    enrollingCourses,
  };
};

/**
 * Hook for search and filtering
 */
export const useSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterLevel, setFilterLevel] = useState("all");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  // Debounced search term
  const debouncedSetSearch = useMemo(
    () => debounce((term: string) => setDebouncedSearchTerm(term), 300),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setFilterLevel("all");
  }, []);

  const hasActiveFilters = useMemo(() => {
    return searchTerm.length > 0 || filterLevel !== "all";
  }, [searchTerm, filterLevel]);

  return {
    searchTerm,
    setSearchTerm,
    filterLevel,
    setFilterLevel,
    debouncedSearchTerm,
    clearFilters,
    hasActiveFilters,
  };
};

/**
 * Hook for filtered courses
 */
export const useFilteredCourses = (
  data: DashboardData | null,
  searchTerm: string,
  filterLevel: string
) => {
  return useMemo(() => {
    if (!data) {
      return {
        filteredEnrolled: [],
        filteredAvailable: [],
        inProgressCourses: [],
        completedCourses: [],
      };
    }
    const filteredEnrolled = filterCourses(
      data.enrolledCourses as EnrolledCourse[],
      searchTerm,
      filterLevel
    );
    const filteredAvailable = filterCourses(
      data.availableCourses as Course[],
      searchTerm,
      filterLevel
    );

    const inProgressCourses = filteredEnrolled.filter(
      (e: any) => e.status && e.status.toLowerCase() !== "completed"
    );

    const completedCourses = filteredEnrolled.filter(
      (e: any) => e.status && e.status.toLowerCase() === "completed"
    );

    return {
      filteredEnrolled,
      filteredAvailable,
      inProgressCourses,
      completedCourses,
    };
  }, [data, searchTerm, filterLevel]);
};

/**
 * Hook for dashboard statistics
 */
export const useDashboardStats = (data: DashboardData | null) => {
  return useMemo(() => {
    if (!data) {
      return {
        totalEnrolled: 0,
        totalCompleted: 0,
        totalCertificates: 0,
        inProgressCount: 0,
        completionRate: 0,
      };
    }

    const inProgressCount = data.enrolledCourses.filter(
      (e) => e.status && e.status.toLowerCase() !== "completed"
    ).length;

    const completionRate =
      data.stats.totalEnrolled > 0
        ? Math.round(
            (data.stats.totalCompleted / data.stats.totalEnrolled) * 100
          )
        : 0;

    return {
      totalEnrolled: data.stats.totalEnrolled,
      totalCompleted: data.stats.totalCompleted,
      totalCertificates: data.stats.totalCertificates,
      inProgressCount,
      completionRate,
    };
  }, [data]);
};

/**
 * Hook for tab management
 */
export const useTabs = (defaultTab = "overview") => {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const switchToTab = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);

  return {
    activeTab,
    setActiveTab,
    switchToTab,
  };
};

/**
 * Combined hook for dashboard functionality
 */
export const useDashboard = () => {
  const auth = useAuth();
  const dashboardData = useDashboardData();
  const search = useSearch();
  const tabs = useTabs();
  const enrollment = useEnrollment(dashboardData.refreshData);

  const filteredCourses = useFilteredCourses(
    dashboardData.data,
    search.debouncedSearchTerm,
    search.filterLevel
  );

  const stats = useDashboardStats(dashboardData.data);

  return {
    // Auth
    ...auth,

    // Data
    ...dashboardData,

    // Search & Filters
    ...search,

    // Tabs
    ...tabs,

    // Enrollment
    ...enrollment,

    // Computed data
    ...filteredCourses,
    ...stats,
  };
};
