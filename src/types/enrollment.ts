// src\types\enrollment.ts

import { Certificate, Course, Payment, User } from "@/types";
import { BaseEntity, EnrollmentStatus } from "./shared";

export interface Enrollment extends BaseEntity {
  enrollment_id: number;
  user_id?: number;
  course_id?: number;
  status?: EnrollmentStatus;
  completed_at?: Date;
  enrolled_at?: Date;
  
  // Relational fields
  student?: User;
  course?: Course;
  payments?: Payment[];
  certificate?: Certificate;
  
  // Virtual fields for progress tracking
  progress_percentage?: number;
  completed_materials?: number;
  total_materials?: number;
}

export interface EnrollmentCreationData {
  user_id?: number;
  course_id?: number;
  status?: EnrollmentStatus;
}

export interface EnrollmentFilters {
  user_id?: number;
  course_id?: number;
  status?: EnrollmentStatus;
  page?: number;
  limit?: number;
}