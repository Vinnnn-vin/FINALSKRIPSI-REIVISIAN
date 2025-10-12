// src\app\frontend\dashboard\lecturer\types\lecturer.ts

export interface LecturerStatsType {
  totalCourses: number;
  totalStudents: number;
  totalEnrollments: number;
  averageRating: number;
}

export interface CategoryOptionType {
  value: string;
  label: string;
}
