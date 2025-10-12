// src\types\review.ts
import { Course } from "./course";
import { User } from "./user";    
import { BaseEntity } from "./shared";

export interface Review extends BaseEntity {
  review_id: number;
  user_id?: number;
  course_id?: number;
  rating?: number;
  review_text?: string;
  
  // Relational fields
  reviewer?: User;
  course?: Course;
}

export interface ReviewCreationData {
  user_id?: number;
  course_id?: number;
  rating?: number;
  review_text?: string;
}