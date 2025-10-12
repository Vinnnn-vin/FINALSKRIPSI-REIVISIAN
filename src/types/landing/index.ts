// src\types\landing\index.ts

import { TextProps } from "@mantine/core";

export interface LandingCourse {
  id: string;
  title: string;
  instructor: string;
  instructorAvatar?: string;
  price: string;
  rating: number | string;
  students: number | string;
  category: string;
  level?: string;
  duration?: string;
  image?: string;
}

export interface LandingCategory {
  category_id: string;
  category_name: string;
  course_count: number;
}

export interface CategoriesSectionProps {
  categories: LandingCategory[];
  isLoading: boolean;
  mounted: boolean;
}

export interface CourseCardProps {
  course: LandingCourse;
  index: number;
  mounted: boolean;
}

export interface FeaturedCoursesSectionProps {
  courses: LandingCourse[];
  isLoading: boolean;
  error: string | null;
  mounted: boolean;
}

export interface HeroSectionProps {
  mounted: boolean;
}

export interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar: string;
  rating: number;
}

export interface TestimonialsSectionProps {
  mounted: boolean;
}

export interface AnimatedCounterProps extends TextProps {
  from?: number;
  to: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
}

export interface CourseDisplayData {
  id: number;
  title: string;
  instructor: string;
  instructorAvatar?: string;
  price: string;
  rating: number; // Rating sebaiknya selalu number untuk sorting
  students: number; // Students sebaiknya selalu number untuk sorting
  category: string;
  level?: string;
  duration?: string;
  image?: string;
  description?: string;
  originalPrice?: string;
  isBestseller?: boolean;
  isNew?: boolean;
  reviewCount?: number;
}

export interface LandingCategory {
  category_id: string;
  category_name: string;
  course_count: number;
}

export interface UISelectOption {
  value: string;
  label: string;
}

export interface CourseListWrapperProps {
  initialCourses: CourseDisplayData[];
  initialTotalPages: number;
  initialTotalCourses: number;
  availableCategories: UISelectOption[];
}

export interface CourseFiltersProps {
  categories: UISelectOption[];
  coursesLength: number;
  totalCourses: number;
}

export interface CourseGridProps {
  courses: CourseDisplayData[];
  isLoading: boolean;
  error: string | null;
  onResetFilters: () => void;
}

export interface HeroSectionProps {
  totalCourses: number;
}