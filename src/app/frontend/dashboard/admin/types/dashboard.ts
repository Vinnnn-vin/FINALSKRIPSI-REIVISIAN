// src\app\frontend\dashboard\admin\types\dashboard.ts

export interface DashboardStats {
  totalCourses: number;
  publishedCourses: number;
  unpublishedCourses: number;
  totalStudents: number;
  totalLecturers: number;
  totalEnrollments: number;
  recentEnrollments: number;
  categoryAnalytics: Array<{
    category_name: string;
    course_count: number;
    enrollment_count: number;
  }>;
  paymentSummary: Array<{
    status: string;
    count: number;
    total_amount: number;
  }>;
  enrollmentTrends: Array<{
    month: string;
    enrollments: number;
  }>;
}

export interface User {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Course {
  course_id: number;
  course_title: string;
  course_description: string;
  course_level: string;
  course_price: number;
  publish_status: number;
  user_id: number;
  category_id: number;
  created_at: string;
  instructor?: { first_name: string; last_name: string };
  category?: { category_name: string };
  User?: { first_name: string; last_name: string };
  Category?: { category_name: string };
}

export interface Payment {
  payment_id: number;
  amount: number;
  status: string;
  payment_method: string;
  created_at: string;
  user?: { first_name: string; last_name: string; email: string };
  course?: { course_title: string };
  User?: { first_name: string; last_name: string; email: string };
  Course?: { course_title: string };
}

export interface EnrollmentData {
  enrollment_id: number;
  status: string;
  created_at: string;
  student?: { first_name: string; last_name: string; email: string };
  course?: {
    course_title: string;
    course_level: string;
    category?: { category_name: string };
  };
  User?: { first_name: string; last_name: string; email: string };
  Course?: {
    course_title: string;
    course_level: string;
    Category?: { category_name: string };
  };
}

