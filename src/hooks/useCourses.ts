/* eslint-disable @typescript-eslint/no-explicit-any */
// File: hooks/useCourses.ts
// ================================
import { useCourseStore } from '@/stores/courseStore';
import { useCallback, useEffect } from 'react';
import { CourseFilters } from '@/types';

export const useCourses = (initialFilters?: CourseFilters) => {
  const {
    courses,
    selectedCourse,
    isLoading,
    error,
    filters,
    pagination,
    fetchCourses,
    fetchCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
    publishCourse,
    unpublishCourse,
    setFilters,
    clearFilters,
    clearError,
    setSelectedCourse,
  } = useCourseStore();

  useEffect(() => {
    if (initialFilters) {
      setFilters(initialFilters);
    }
  }, [initialFilters, setFilters]);

  const loadCourses = useCallback(async (newFilters?: CourseFilters) => {
    await fetchCourses(newFilters);
  }, [fetchCourses]);

  const loadCourse = useCallback(async (id: number) => {
    await fetchCourseById(id);
  }, [fetchCourseById]);

  const handleCreateCourse = useCallback(async (data: any) => {
    const result = await createCourse(data);
    return result;
  }, [createCourse]);

  const handleUpdateCourse = useCallback(async (id: number, data: any) => {
    await updateCourse(id, data);
  }, [updateCourse]);

  const handleDeleteCourse = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to delete this course?')) {
      await deleteCourse(id);
    }
  }, [deleteCourse]);

  const handlePublishCourse = useCallback(async (id: number) => {
    await publishCourse(id);
  }, [publishCourse]);

  const handleUnpublishCourse = useCallback(async (id: number) => {
    await unpublishCourse(id);
  }, [unpublishCourse]);

  return {
    courses,
    selectedCourse,
    isLoading,
    error,
    filters,
    pagination,
    loadCourses,
    loadCourse,
    createCourse: handleCreateCourse,
    updateCourse: handleUpdateCourse,
    deleteCourse: handleDeleteCourse,
    publishCourse: handlePublishCourse,
    unpublishCourse: handleUnpublishCourse,
    setFilters,
    clearFilters,
    clearError,
    setSelectedCourse,
  };
};