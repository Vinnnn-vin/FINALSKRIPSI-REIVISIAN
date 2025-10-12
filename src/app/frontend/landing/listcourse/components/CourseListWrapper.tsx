// src\app\frontend\landing\listcourse\components\CourseListWrapper.tsx
"use client"; 

import React, { useEffect, useRef } from 'react';
import { Center, Pagination, Stack, Skeleton, Card, Group } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useCourseStore } from '../stores/courseStore';
import CourseGrid from './CourseGrid';
import { CourseListWrapperProps } from '@/types/landing/list';
import dynamic from 'next/dynamic';

// Dynamic import CourseFilters to prevent hydration issues
const CourseFilters = dynamic(
  () => import('./CourseFilters'),
  { 
    ssr: false,
    loading: () => <CourseFiltersSkeleton />
  }
);

// Loading skeleton for CourseFilters
const CourseFiltersSkeleton = () => (
  <Card shadow="lg" padding="xl" radius="xl" withBorder>
    <Stack gap="lg">
      <Group grow>
        <Skeleton height={40} />
        <Skeleton height={40} />
        <Skeleton height={40} />
        <Skeleton height={40} />
      </Group>
      <Group justify="space-between" align="center">
        <Skeleton height={20} width="40%" />
        <Skeleton height={32} width={120} />
      </Group>
    </Stack>
  </Card>
);

const CourseListWrapper = ({
  initialCourses,
  initialTotalPages,
  initialTotalCourses,
  availableCategories,
}: CourseListWrapperProps) => {
  const isInitialized = useRef(false);
  const store = useCourseStore();
  const [debouncedSearch] = useDebouncedValue(store.searchQuery, 400);

  useEffect(() => {
    if (!isInitialized.current) {
      store.initialize({
        initialCourses,
        initialTotalPages,
        initialTotalCourses,
        categories: availableCategories,
      });
      isInitialized.current = true;
    }
  }, [initialCourses, initialTotalPages, initialTotalCourses, availableCategories, store.initialize]);

  useEffect(() => {
    if (!isInitialized.current) return;
    store.fetchCourses();
  }, [debouncedSearch, store.selectedCategory, store.selectedLevel, store.sortBy, store.currentPage, store.fetchCourses]);

  return (
    <Stack gap="xl">
      {/* Dynamic CourseFilters with no SSR */}
      <CourseFilters
        categories={store.categories}
        coursesLength={store.courses.length}
        totalCourses={store.totalCourses}
      />
      
      <CourseGrid
        courses={store.courses}
        isLoading={store.isLoading}
        error={store.error}
        onResetFilters={store.resetFilters}
      />

      {store.totalPages > 1 && (
        <Center mt="xl">
          <Pagination 
            total={store.totalPages}
            value={store.currentPage} 
            onChange={store.setCurrentPage}
            size="lg"
            radius="md"
            withEdges
          />
        </Center>
      )}
    </Stack>
  );
};

export default CourseListWrapper;