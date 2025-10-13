// src\app\frontend\landing\listcourse\components\useCourseList.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useCallback } from 'react';
import { useDebouncedValue } from '@mantine/hooks';
import { CourseDisplayData, UISelectOption } from '@/types/landing';

export const useCourseList = () => {
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  
  // State for data
  const [courses, setCourses] = useState<CourseDisplayData[]>([]);
  const [categories, setCategories] = useState<UISelectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCourses, setTotalCourses] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query to avoid excessive API calls
  const [debouncedSearch] = useDebouncedValue(searchQuery, 300);

  const fetchCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const params = new URLSearchParams();
    
    if (debouncedSearch) params.append('search', debouncedSearch);
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedLevel) params.append('level', selectedLevel);
    if (sortBy) params.append('sort', sortBy);
    params.append('page', currentPage.toString());
    params.append('limit', '9');

    try {
      const response = await fetch(`/api/landing/listcourse?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setCourses(data);
        setTotalCourses(data.length);
        setTotalPages(Math.ceil(data.length / 9));
      } else if (data.courses) {
        setCourses(data.courses);
        setTotalCourses(data.totalCount || data.courses.length);
        setTotalPages(data.totalPages || Math.ceil((data.totalCount || data.courses.length) / 9));
      } else {
        setCourses([]);
        setTotalCourses(0);
        setTotalPages(0);
      }
    } catch (error: any) {
      setError(error.message || "Failed to fetch courses");
      setCourses([]);
      setTotalCourses(0);
      setTotalPages(0);
    } finally {
      setIsLoading(false);
    }
  }, [debouncedSearch, selectedCategory, selectedLevel, sortBy, currentPage]);

  // Fetch categories once on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/landing/listcategory');
        if (!response.ok) {
          throw new Error('Failed to fetch categories');
        }
        const data = await response.json();
        const formattedCategories = data.map((cat: any) => ({
          value: cat.name || cat.category_name,
          label: cat.name || cat.category_name,
        }));
        setCategories(formattedCategories);
      } catch (error) {
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [debouncedSearch, selectedCategory, selectedLevel, sortBy]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory(null);
    setSelectedLevel(null);
    setSortBy('newest');
    setCurrentPage(1);
  };

  return {
    // Filter states
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedLevel,
    setSelectedLevel,
    sortBy,
    setSortBy,
    currentPage,
    setCurrentPage,
    
    // Data states
    courses,
    categories,
    isLoading,
    totalCourses,
    totalPages,
    error,
    
    // Actions
    handleResetFilters,
  };
};