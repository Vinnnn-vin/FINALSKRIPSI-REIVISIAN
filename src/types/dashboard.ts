// src\types\dashboard.ts
// ================================

// Student dashboard stats
export interface StudentDashboardStats {
  total_enrolled_courses: number;
  completed_courses: number;
  in_progress_courses: number;
  total_certificates: number;
  learning_streak_days: number;
  recent_activities: {
    type: 'course_enrolled' | 'material_completed' | 'quiz_passed' | 'assignment_submitted';
    title: string;
    date: Date;
  }[];
  recommended_courses: {
    course_id: number;
    course_title: string;
    instructor_name: string;
    rating: number;
  }[];
}

// Lecturer dashboard stats
export interface LecturerDashboardStats {
  total_students: number;
  active_courses: number;
  total_revenue_month: number;
  average_rating: number;
  recent_enrollments: { 
    course_title: string; 
    student_name: string; 
    date: Date;
  }[];
  recent_reviews: Array<{
    review_id: number;
    course_title: string;
    student_name: string;
    rating: number;
    comment: string;
    date: Date;
  }>;
  pending_submissions: number;
}

// Admin dashboard stats
export interface AdminDashboardStats {
  total_revenue: number;
  total_sales_month: number;
  new_users_month: number;
  active_courses: number;
  total_lecturers: number;
  total_students: number;
  platform_growth: { 
    month: string; 
    students: number; 
    instructors: number;
    revenue: number;
  }[];
  top_courses: {
    course_id: number;
    title: string;
    lecturer: string;
    enrollments: number;
    revenue: number;
  }[];
}