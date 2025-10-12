// src\app\frontend\dashboard\student\utils\index.ts

import type { Course } from "@/types/course";

/**
 * Get color for course level badge
 */
export function getLevelColor(level?: string): string {
  switch (level?.toLowerCase()) {
    case "beginner":
      return "green";
    case "intermediate":
      return "blue";
    case "advanced":
      return "red";
    default:
      return "gray";
  }
}

/**
 * Format price to Indonesian Rupiah
 */
export function formatPrice(price: number): string {
  if (price === 0) {
    return "Free";
  }
  
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
}

/**
 * Get instructor full name
 */
export function getInstructorName(instructor?: {
  first_name?: string;
  last_name?: string;
}): string {
  if (!instructor) {
    return "Unknown Instructor";
  }

  const firstName = instructor.first_name || "";
  const lastName = instructor.last_name || "";
  const fullName = `${firstName} ${lastName}`.trim();

  return fullName || "Unknown Instructor";
}

/**
 * Get course thumbnail URL with proper fallback
 */
export function getCourseImageUrl(thumbnailUrl?: string | null): string {
  if (!thumbnailUrl) {
    return getCourseFallbackUrl();
  }

  // If it's a data URL (base64), return as is
  if (thumbnailUrl.startsWith("data:")) {
    return thumbnailUrl;
  }

  // If it's already a full URL, return as is
  if (thumbnailUrl.startsWith("http://") || thumbnailUrl.startsWith("https://")) {
    return thumbnailUrl;
  }

  // If it starts with /, it's a relative path
  if (thumbnailUrl.startsWith("/")) {
    return thumbnailUrl;
  }

  // Otherwise, prepend with / to make it relative
  return `/${thumbnailUrl}`;
}

/**
 * Get fallback course image URL
 */
export function getCourseFallbackUrl(): string {
  return "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMyMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMjAiIGhlaWdodD0iMTgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0xNDQgNzJIMTc2VjEwNEgxNDRWNzJaIiBmaWxsPSIjQzRDNEM0Ii8+CjxwYXRoIGQ9Ik0xMjggMTA0SDE5MlYxMDhIMTI4VjEwNFoiIGZpbGw9IiNDNEM0QzQiLz4KPC9zdmc+";
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Format date to readable string
 */
export function formatDate(dateString?: string | null): string {
  if (!dateString) return "N/A";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "N/A";
  }
}

/**
 * Format duration from minutes to hours/minutes
 */
export function formatDuration(minutes?: number): string {
  if (!minutes || minutes === 0) return "N/A";
  
  if (minutes < 60) {
    return `${minutes} min`;
  }
  
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  
  if (remainingMinutes === 0) {
    return `${hours} hr`;
  }
  
  return `${hours} hr ${remainingMinutes} min`;
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + "...";
}

/**
 * Check if course is free
 */
export function isFree(course: Course): boolean {
  return !course.course_price || course.course_price === 0;
}

/**
 * Get course status based on progress
 */
export function getCourseStatus(progress?: number): "not-started" | "in-progress" | "completed" {
  if (!progress || progress === 0) return "not-started";
  if (progress >= 100) return "completed";
  return "in-progress";
}

/**
 * Get status badge color
 */
export function getStatusColor(status: string): string {
  switch (status) {
    case "completed":
      return "green";
    case "in-progress":
    case "active":
      return "blue";
    case "not-started":
    case "pending":
      return "gray";
    default:
      return "gray";
  }
}

/**
 * Mendapatkan teks dan warna untuk tombol berdasarkan progres kursus.
 */
export function getCourseButtonProps(progress?: number): { text: string; color: string } {
  if (progress === undefined || progress === 0) {
    return { text: "Start Learning", color: "blue" };
  }
  if (progress >= 100) {
    return { text: "Course Finished", color: "gray" };
  }
  return { text: "Continue Learning", color: "green" };
}