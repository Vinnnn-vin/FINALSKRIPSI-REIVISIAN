// src\types\shared.ts

import { CourseDisplayData } from "./landing";

export type UserRole = "student" | "lecturer" | "admin";
export type CourseLevel = "beginner" | "intermediate" | "advanced";

// Fixed: Changed to match database schema (integer)
export type MaterialDetailTypeId = 1 | 2 | 3 | 4;
export const MaterialDetailType = {
  VIDEO: 1 as const,
  DOCUMENT: 2 as const, 
  AUDIO: 3 as const,
  ASSIGNMENT: 4 as const
} as const;

export type EnrollmentStatus = "active" | "completed" | "dropped" | "inactive";
export type PaymentStatus = "pending" | "paid" | "failed" | "refunded" | "cancelled" | "success";
export type QuizQuestionType = "multiple_choice" | "checkbox" | "true_false" | "essay" | "fill_blank";
export type NotificationType = "info" | "success" | "warning" | "error" | "system";
export type StudentQuizAnswerStatus = "answered" | "submitted" | "graded" | "pending";

// Base interfaces with proper generic constraints
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedData<T> {
  items: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
}

export interface BaseEntity {
  created_at?: Date | string;
  updated_at?: Date | string;
  deleted_at?: Date | string | null;
}

export interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  data: T[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  debugInfo?: Record<string, unknown>;
}

// UI Components
export interface UISelectOption {
  value: string;
  label: string;
}

// Generic filter interfaces
export interface BaseFilters {
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
}

export interface CourseListFilters extends BaseFilters {
  category?: string;
  level?: CourseLevel;
  price_min?: number;
  price_max?: number;
  instructor?: string;
}

export interface CourseListApiResponse extends ApiResponse {
  courses: CourseDisplayData[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  availableCategories?: UISelectOption[];
  debugInfo?: Record<string, unknown>;
}

// Error handling interfaces
export interface ErrorStateProps {
  error: string;
  onRetry?: () => void;
  onGoHome?: () => void | string;
}

// Search and filter props - Fixed typing
export interface SearchFiltersProps {
  searchTerm: string;
  filterLevel: string;
  sortBy: 'title' | 'price' | 'level' | 'progress';
  sortOrder: 'asc' | 'desc';
  onSearchChange: (value: string) => void;
  onLevelChange: (value: string) => void;
  onSortByChange: (value: 'title' | 'price' | 'level' | 'progress') => void;
  onSortOrderChange: (value: 'asc' | 'desc') => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

// Course card props - Fixed with proper generic constraints
export interface CourseCardProps<T = unknown> {
  course?: T;
  onEnroll?: (courseId: number) => void;
  isEnrolling?: boolean;
  error?: string;
  onRetry?: () => void;
  onGoHome?: () => void | string;
}

// Tab content props - Fixed with proper types
export interface TabContentProps<TCourse = unknown, TEnrollment = unknown> {
  activeTab: string;
  onTabChange: (tab: string) => void;
  enrolledCourses: TEnrollment[];
  availableCourses: TCourse[];
  inProgressCourses: TEnrollment[];
  onEnroll: (courseId: number) => void;
  onBrowseCourses: () => void;
  onClearFilters: () => void;
  onRefresh: () => void;
  isEnrolling: (courseId: number) => boolean;
  searchTerm: string;
  hasActiveFilters: boolean;
}

// Utility type for making properties optional
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Utility type for making properties required
export type Required<T, K extends keyof T> = T & RequiredPick<T, K>;
type RequiredPick<T, K extends keyof T> = {
  [P in K]-?: T[P];
};