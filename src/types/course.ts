// src\types\course.ts
import { Category } from "./category";
import { Enrollment } from "./enrollment";
import { Material } from "./material";
import { Review } from "./review";
import { User } from "./user";
import { BaseEntity, CourseLevel, EnrollmentStatus } from "./shared";

export interface Course extends BaseEntity {
  course_id: number;
  course_title: string;
  course_description: string;
  course_level: CourseLevel;
  course_price: number;
  course_duration?: number;
  publish_status?: number; 
  user_id?: number;
  category_id?: number;
  thumbnail_url?: string;

  instructor?: User;
  category?: Category;
  materials?: Material[];
  enrollments?: Enrollment[];
  reviews?: Review[];

  instructor_name?: string;
  category_name?: string;
  total_materials?: number;
  student_count?: number;
  total_students?: number;
  review_count?: number;
  average_rating?: number;
  enrollment_count?: number;
  progress?: number; 
  totalMaterials?: number;
  completedMaterials?: number;

  Enrollments?: Enrollment[];
}

export interface EnrolledCourse extends BaseEntity {
  enrollment_id: number;
  enrollment_date: string | Date;
  status?: EnrollmentStatus | string;
  last_accessed?: string | Date;

  course: Course;

  progress?: number;
  completed_materials?: number;
  total_materials?: number;

  user_id?: number;
  course_id?: number;
  completed_at?: Date | string;
  enrolled_at?: Date | string;
  progress_percentage?: number;
  certificate_earned?: boolean;
  time_spent?: number; 
}

export interface EnrolledCourseCard extends BaseEntity {
  enrollment_id: number;
  enrollment_date: string | Date;
  status?: EnrollmentStatus;
  last_accessed?: string | Date;

  course: Course;

  user_id?: number;
  course_id?: number;
  completed_at?: Date | string;
  enrolled_at?: Date | string;
  progress_percentage?: number;
  completed_materials?: number;
  total_materials?: number;
  certificate_earned?: boolean;
  time_spent?: number;
}

export interface CourseCreationData {
  course_title?: string;
  course_description?: string;
  course_level?: CourseLevel;
  course_price?: number;
  course_duration?: number;
  publish_status?: number;
  user_id?: number;
  category_id?: number;
  thumbnail_url?: string;
}

export interface CourseFilters {
  search?: string;
  category_id?: number;
  course_level?: CourseLevel;
  user_id?: number; 
  publish_status?: number;
  page?: number;
  limit?: number;
  price_min?: number;
  price_max?: number;
}

export interface DashboardFilters {
  search: string;
  level: string;
  sortBy: "title" | "price" | "level" | "progress";
  sortOrder: "asc" | "desc";
}

export interface CourseWithEnrollment extends Course {
  enrollment?: {
    enrollment_id: number;
    status: EnrollmentStatus;
    progress: number;
    enrolled_at: Date | string;
  };
}

export const getCourseProgress = (course: Course | EnrolledCourse): number => {
  if ("course" in course) {
    return course.progress || course.course.progress || 0;
  }
  return course.progress || 0;
};

export const isCourseCompleted = (course: Course | EnrolledCourse): boolean => {
  return getCourseProgress(course) >= 100;
};

export const getCoursePrice = (price?: number): string => {
  if (!price || price === 0) return "Free";
  return `Rp ${price.toLocaleString("id-ID")}`;
};
