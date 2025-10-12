// src\app\frontend\landing\listcourse\page.tsx
import React from 'react';
import { Container, Stack } from '@mantine/core';
import HeroSection from './components/HeroSection';
import CTASection from './components/CTASection';
import CourseListWrapper from './components/CourseListWrapper';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

async function getInitialData() {
  try {
    const [courseRes, categoryRes] = await Promise.all([
      fetch(`${API_BASE_URL}/api/landing/listcourse?page=1&limit=9&sort=newest`, { cache: 'no-store' }),
      fetch(`${API_BASE_URL}/api/landing/listcategory`, { cache: 'no-store' })
    ]);

    const courseData = courseRes.ok ? await courseRes.json() : { courses: [], totalCount: 0, totalPages: 0 };
    const categoryData = categoryRes.ok ? await categoryRes.json() : [];

    const formattedCategories = categoryData.map((cat: { category_id: string; category_name: string; }) => ({
      value: String(cat.category_id),
      label: cat.category_name,
    }));

    return {
      courses: courseData.courses || [],
      totalCount: courseData.totalCount || 0,
      totalPages: courseData.totalPages || 0,
      categories: formattedCategories,
    };
  } catch (error) {
    console.error("Failed to fetch initial data:", error);
    return { courses: [], totalCount: 0, totalPages: 0, categories: [] };
  }
}

export default async function ListCoursePage() {
  const initialData = await getInitialData();

  return (
    <>
      <HeroSection totalCourses={initialData.totalCount} />
      <Container size="xl" py="xl">
        <Stack gap="xl">
          <CourseListWrapper
            initialCourses={initialData.courses}
            initialTotalPages={initialData.totalPages}
            initialTotalCourses={initialData.totalCount}
            availableCategories={initialData.categories}
          />
          <CTASection />
        </Stack>
      </Container>
    </>
  );
}