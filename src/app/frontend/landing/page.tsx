// src\app\frontend\landing\page.tsx
"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  LoadingOverlay,
} from "@mantine/core";
import { HeroSection } from "./components/HeroSection";
import { StatsSection } from "./components/StatsSection";
import { FeaturedCoursesSection } from "./components/FeaturedCoursesSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { CategoriesSection } from "./components/CategoriesSection";
import { TestimonialsSection } from "./components/TestimonialsSection";

import { LandingCourse, LandingCategory } from "@/types/landing";

const mockCourses: LandingCourse[] = [
  {
    id: "1",
    title: "React.js Complete Guide",
    instructor: "John Doe",
    price: "Rp 299.000",
    rating: 4.8,
    students: 1250,
    category: "Programming",
    level: "Intermediate",
    duration: "8 weeks",
    image: "/images/course-react.jpg"
  },
  {
    id: "2",
    title: "UI/UX Design Fundamentals",
    instructor: "Jane Smith",
    price: "Rp 399.000",
    rating: 4.9,
    students: 850,
    category: "Design",
    level: "Beginner",
    duration: "6 weeks",
    image: "/images/course-uiux.jpg"
  },
  {
    id: "3",
    title: "Digital Marketing Strategy",
    instructor: "Mike Johnson",
    price: "Rp 249.000",
    rating: 4.7,
    students: 920,
    category: "Marketing",
    level: "Beginner",
    duration: "4 weeks",
    image: "/images/course-marketing.jpg"
  },
  {
    id: "4",
    title: "Python for Data Science",
    instructor: "Sarah Lee",
    price: "Rp 349.000",
    rating: 4.8,
    students: 1100,
    category: "Data Science",
    level: "Intermediate",
    duration: "10 weeks",
    image: "/images/course-python.jpg"
  }
];

const mockCategories: LandingCategory[] = [
  { category_id: "1", category_name: "Programming", course_count: 45 },
  { category_id: "2", category_name: "Design", course_count: 32 },
  { category_id: "3", category_name: "Marketing", course_count: 28 },
  { category_id: "4", category_name: "Data Science", course_count: 21 }
];

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);
  const [courses, setCourses] = useState<LandingCourse[]>([]);
  const [categories, setCategories] = useState<LandingCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [coursesResponse, categoriesResponse] = await Promise.all([
        fetch("/api/landing/listcourse").catch(() => null),
        fetch("/api/landing/listcategory").catch(() => null),
      ]);

      let processedCourses: LandingCourse[] = [];
      let processedCategories: LandingCategory[] = [];

      if (coursesResponse?.ok) {
        const coursesData = await coursesResponse.json();
        console.log("Raw courses data:", coursesData);
        
        if (Array.isArray(coursesData)) {
          processedCourses = coursesData;
        } else if (coursesData && Array.isArray(coursesData.data)) {
          processedCourses = coursesData.data;
        } else if (coursesData && Array.isArray(coursesData.courses)) {
          processedCourses = coursesData.courses;
        } else if (coursesData && coursesData.success && Array.isArray(coursesData.result)) {
          processedCourses = coursesData.result;
        } else {
          console.warn("Courses API response format not recognized, using mock data");
          processedCourses = mockCourses;
        }
      } else {
        console.warn("Courses API failed, using mock data");
        processedCourses = mockCourses;
      }

      if (categoriesResponse?.ok) {
        const categoriesData = await categoriesResponse.json();
        console.log("Raw categories data:", categoriesData);
        
        if (Array.isArray(categoriesData)) {
          processedCategories = categoriesData;
        } else if (categoriesData && Array.isArray(categoriesData.data)) {
          processedCategories = categoriesData.data;
        } else if (categoriesData && Array.isArray(categoriesData.categories)) {
          processedCategories = categoriesData.categories;
        } else if (categoriesData && categoriesData.success && Array.isArray(categoriesData.result)) {
          processedCategories = categoriesData.result;
        } else {
          console.warn("Categories API response format not recognized, using mock data");
          processedCategories = mockCategories;
        }
      } else {
        console.warn("Categories API failed, using mock data");
        processedCategories = mockCategories;
      }

      setCourses(processedCourses);
      setCategories(processedCategories);
    } catch (err) {
      console.error("Error fetching data:", err);
      setCourses(mockCourses);
      setCategories(mockCategories);
      setError("Menggunakan data demo. API mungkin belum tersedia.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Box style={{ minHeight: "100vh", position: "relative" }}>
        <LoadingOverlay
          visible={true}
          zIndex={1000}
          overlayProps={{ radius: "sm", blur: 2 }}
          loaderProps={{ type: "dots" }}
        />
      </Box>
    );
  }

  return (
    <Box style={{ overflow: "hidden" }}>
      <HeroSection mounted={mounted} totalCourses={0} />
      <StatsSection />
      
      <FeaturedCoursesSection
        courses={courses}
        isLoading={isLoading}
        error={error}
        mounted={mounted}
      />
      
      <FeaturesSection />
      
      <CategoriesSection
        categories={categories}
        isLoading={isLoading}
        mounted={mounted}
      />
      
      <TestimonialsSection mounted={mounted} />
    </Box>
  );
}