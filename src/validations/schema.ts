// src\validations\schema.ts

import { z } from 'zod';

export const UserSchema = z.object({
  user_id: z.number().optional(),
  first_name: z.string().min(1).max(255).optional(),
  last_name: z.string().min(1).max(255).optional(),
  email: z.string().email().max(255).optional(),
  password: z.string().min(6).optional(),
  password_hash: z.string().optional(),
  role: z.enum(['admin', 'lecturer', 'student']).optional(),
  created_at: z.date().optional(),
  deleted_at: z.date().optional(),
});

export const CategorySchema = z.object({
  category_id: z.number().optional(),
  category_name: z.string().min(1).max(255).optional(),
  category_description: z.string().optional(),
  image_url: z.string().url().optional(),
  created_at: z.date().optional(),
});

export const CourseSchema = z.object({
  course_id: z.number().optional(),
  course_title: z.string().min(1).max(255).optional(),
  course_description: z.string().optional(),
  course_level: z.enum(['beginner', 'intermediate', 'advanced']).optional(),
  course_price: z.number().min(0).optional(),
  course_duration: z.number().min(1).optional(),
  publish_status: z.number().min(0).max(1).optional(),
  user_id: z.number().optional(),
  category_id: z.number().optional(),
  thumbnail_url: z.string().url().optional(),
  created_at: z.date().optional(),
  deleted_at: z.date().optional(),
  updated_at: z.date().optional(),
});

export const MaterialSchema = z.object({
  material_id: z.number().optional(),
  material_name: z.string().min(1).max(255).optional(),
  material_description: z.string().max(255).optional(),
  course_id: z.number(),
});

export const MaterialDetailSchema = z.object({
  material_detail_id: z.number().optional(),
  material_detail_name: z.string().min(1).max(255),
  material_detail_description: z.string().min(1),
  material_detail_type: z.number(),
  materi_detail_url: z.string().url(),
});

export const QuizSchema = z.object({
  quiz_id: z.number().optional(),
  material_id: z.number().optional(),
  course_id: z.number().optional(),
  quiz_title: z.string().min(1).max(255).optional(),
  quiz_description: z.string().optional(),
  passing_score: z.number().min(0).max(100).optional(),
  time_limit: z.number().min(1).optional(),
  max_attempts: z.number().min(1).optional(),
  created_at: z.date().optional(),
  deleted_at: z.date().optional(),
});

export const EnrollmentSchema = z.object({
  enrollment_id: z.number().optional(),
  user_id: z.string().optional(),
  course_id: z.string().optional(),
  status: z.enum(['active', 'completed', 'cancelled']).optional(),
  created_at: z.date().optional(),
  deleted_at: z.date().optional(),
  updated_at: z.date().optional(),
  completed_at: z.date().optional(),
});

export const PaymentSchema = z.object({
  payment_id: z.number().optional(),
  user_id: z.string().optional(),
  course_id: z.string().optional(),
  enrollment_id: z.string().optional(),
  amount: z.number().min(0).optional(),
  status: z.enum(['pending', 'completed', 'failed', 'cancelled']).optional(),
  gateway_invoice_id: z.string().max(255).optional(),
  payment_method: z.string().max(100).optional(),
  created_at: z.date().optional(),
  deleted_at: z.date().optional(),
  updated_at: z.date().optional(),
});