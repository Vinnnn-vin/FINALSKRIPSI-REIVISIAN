// src\types\landing\list\index.ts

import { CourseLevel } from "@/types/shared";

// ==================================
// TIPE DATA INTI (DATA MODELS)
// ==================================

/**
 * Merepresentasikan data kursus yang akan ditampilkan di UI.
 * ID adalah 'number' agar konsisten dengan tipe data dari database.
 */
export interface CourseDisplayData {
  id: number;
  title: string;
  instructor: string;
  instructorAvatar?: string;
  rating: number;
  students: number;
  duration: string;
  image: string;
  price: string;
  originalPrice?: string;
  category: string;
  level: CourseLevel;
  description: string;
  isBestseller?: boolean;
  isNew?: boolean;
  reviewCount?: number;
}
/**
 * Tipe untuk opsi dropdown/select di UI, digunakan untuk filter.
 */
export interface UISelectOption {
  value: string;
  label: string;
}

// ==================================
// TIPE PROPS UNTUK KOMPONEN
// ==================================

/**
 * Props untuk komponen wrapper utama yang menangani state dan logika.
 */
export interface CourseListWrapperProps {
  initialCourses: CourseDisplayData[];
  initialTotalPages: number;
  initialTotalCourses: number;
  availableCategories: UISelectOption[];
}

/**
 * Props untuk komponen filter pencarian.
 */
export interface CourseFiltersProps {
  categories: UISelectOption[];
  coursesLength: number;
  totalCourses: number;
}

/**
 * Props untuk komponen yang menampilkan grid dari kartu kursus.
 */
export interface CourseGridProps {
  courses: CourseDisplayData[];
  isLoading: boolean;
  error: string | null;
  onResetFilters: () => void;
}

/**
 * Props untuk komponen kartu kursus individual.
 */
export interface CourseCardProps {
  course: CourseDisplayData;
}

/**
 * Props untuk komponen Hero/Header di halaman list course.
 */
export interface HeroSectionProps {
  totalCourses: number;
}