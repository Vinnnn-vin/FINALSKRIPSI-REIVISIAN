// src\app\frontend\dashboard\student\hooks\useDashboard.ts

import { useState, useEffect, useMemo, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { 
  Course, 
  EnrolledCourse, 
  User,
  // Removed unused imports: CourseLevel, EnrollmentStatus
} from '@/types';

// Rest of the interfaces remain the same
interface DashboardData {
  user: User;
  enrolledCourses: EnrolledCourse[];
  availableCourses: Course[];
  certificates: number;
}

interface UseDashboardReturn {
  // Data
  data: DashboardData | null;
  loading: boolean;
  refreshing: boolean;
  error: Error | null;
  
  // Search & Filters
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterLevel: string;
  setFilterLevel: (level: string) => void;
  debouncedSearchTerm: string;
  clearFilters: () => void;
  hasActiveFilters: boolean;
  
  // Tabs
  activeTab: string;
  setActiveTab: (tab: string) => void;
  
  // Actions
  refreshData: () => Promise<void>;
  enrollInCourse: (courseId: number) => Promise<void>;
  isEnrolling: (courseId: number) => boolean;
  
  // Computed data
  filteredEnrolled: EnrolledCourse[];
  filteredAvailable: Course[];
  inProgressCourses: EnrolledCourse[];
  totalEnrolled: number;
  totalCompleted: number;
  totalCertificates: number;
  inProgressCount: number;
  completionRate: number;
}

// Helper functions remain the same
const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const filterCourses = <T extends Course | EnrolledCourse>(
  courses: T[],
  searchTerm: string,
  filterLevel: string
): T[] => {
  return courses.filter((item) => {
    // Get course object (handle both Course and EnrolledCourse)
    const course = ('course' in item ? item.course : item) as Course;
    
    if (!course) return false;

    // Search filter
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      (course.course_title || "").toLowerCase().includes(searchLower) ||
      (course.course_description || "").toLowerCase().includes(searchLower) ||
      (course.instructor?.first_name || "").toLowerCase().includes(searchLower) ||
      (course.instructor?.last_name || "").toLowerCase().includes(searchLower) ||
      (course.category?.category_name || "").toLowerCase().includes(searchLower);

    // Level filter
    const matchesLevel = filterLevel === "all" ||
      (course.course_level || "").toLowerCase() === filterLevel.toLowerCase();

    return matchesSearch && matchesLevel;
  });
};

const calculateProgress = (completed: number, total: number): number => {
  if (!total || total === 0) return 0;
  return Math.round((completed / total) * 100);
};

export const useDashboard = (): UseDashboardReturn => {
  // State management
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');
  const [activeTab, setActiveTab] = useState('overview');
  const [enrollingCourses, setEnrollingCourses] = useState<Set<number>>(new Set());

  // Debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // API calls
  const fetchDashboardData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await fetch('/api/dashboard/student', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-cache',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to fetch dashboard data`);
      }

      const result = await response.json();
      
      // Validate response structure
      if (!result || typeof result !== 'object') {
        throw new Error('Invalid response format');
      }

      setData(result);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('An unknown error occurred');
      setError(error);
      
      if (isRefresh) {
        notifications.show({
          title: 'Error',
          message: 'Failed to refresh dashboard data',
          color: 'red',
        });
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const enrollInCourse = useCallback(async (courseId: number) => {
    try {
      setEnrollingCourses(prev => new Set(prev).add(courseId));

      const response = await fetch('/api/enrollment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ course_id: courseId }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to enroll in course');
      }

      notifications.show({
        title: 'Success',
        message: 'Successfully enrolled in course',
        color: 'green',
      });

      // Refresh data after successful enrollment
      await fetchDashboardData(true);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to enroll in course';
      notifications.show({
        title: 'Error',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setEnrollingCourses(prev => {
        const newSet = new Set(prev);
        newSet.delete(courseId);
        return newSet;
      });
    }
  }, [fetchDashboardData]);

  const isEnrolling = useCallback((courseId: number): boolean => {
    return enrollingCourses.has(courseId);
  }, [enrollingCourses]);

  const refreshData = useCallback(() => {
    return fetchDashboardData(true);
  }, [fetchDashboardData]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setFilterLevel('all');
  }, []);

  // Computed values
  const filteredEnrolled = useMemo(() => {
    if (!data?.enrolledCourses) return [];
    return filterCourses(data.enrolledCourses, debouncedSearchTerm, filterLevel);
  }, [data?.enrolledCourses, debouncedSearchTerm, filterLevel]);

  const filteredAvailable = useMemo(() => {
    if (!data?.availableCourses) return [];
    return filterCourses(data.availableCourses, debouncedSearchTerm, filterLevel);
  }, [data?.availableCourses, debouncedSearchTerm, filterLevel]);

  const inProgressCourses = useMemo(() => {
    return filteredEnrolled.filter(enrollment => 
      enrollment.status && 
      enrollment.status.toLowerCase() !== 'completed'
    );
  }, [filteredEnrolled]);

  const totalEnrolled = useMemo(() => {
    return data?.enrolledCourses?.length || 0;
  }, [data?.enrolledCourses]);

  const totalCompleted = useMemo(() => {
    return data?.enrolledCourses?.filter(enrollment =>
      enrollment.status && enrollment.status.toLowerCase() === 'completed'
    ).length || 0;
  }, [data?.enrolledCourses]);

  const totalCertificates = useMemo(() => {
    return data?.certificates || 0;
  }, [data?.certificates]);

  const inProgressCount = useMemo(() => {
    return totalEnrolled - totalCompleted;
  }, [totalEnrolled, totalCompleted]);

  const completionRate = useMemo(() => {
    return calculateProgress(totalCompleted, totalEnrolled);
  }, [totalCompleted, totalEnrolled]);

  const hasActiveFilters = useMemo(() => {
    return searchTerm.length > 0 || filterLevel !== 'all';
  }, [searchTerm, filterLevel]);

  // Initial data fetch
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  return {
    // Data
    data,
    loading,
    refreshing,
    error,
    
    // Search & Filters
    searchTerm,
    setSearchTerm,
    filterLevel,
    setFilterLevel,
    debouncedSearchTerm,
    clearFilters,
    hasActiveFilters,
    
    // Tabs
    activeTab,
    setActiveTab,
    
    // Actions
    refreshData,
    enrollInCourse,
    isEnrolling,
    
    // Computed data
    filteredEnrolled,
    filteredAvailable,
    inProgressCourses,
    totalEnrolled,
    totalCompleted,
    totalCertificates,
    inProgressCount,
    completionRate,
  };
};