// src\types\certificate.ts
import { Course, Enrollment, User } from "@/types";
import { BaseEntity } from "./shared";

export interface Certificate extends BaseEntity {
  certificate_id: number;
  user_id?: number;
  course_id?: number;
  enrollment_id?: number;
  certificate_url?: string;
  certificate_number?: string;
  issued_at?: Date;
  
  // Relational fields
  recipient?: User;
  course?: Course;
  enrollment?: Enrollment;
}