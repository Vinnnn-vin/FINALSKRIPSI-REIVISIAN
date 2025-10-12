// src\app\frontend\dashboard\lecturer\types\course.ts

export interface CourseType {
  course_id: number;
  course_title: string;
  course_description: string;
  course_level: string;
  course_price: number;
  publish_status: number;
  category_id?: number;
  thumbnail_url?: string;
  student_count: number;
  created_at: string;
  instructor_name?: string;
}
