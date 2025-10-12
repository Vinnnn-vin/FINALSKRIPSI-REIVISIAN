// src\types\assignment.ts

import { BaseEntity } from "./shared";

export interface Assignment {
  assignment_id: number;
  user_id: number;
  material_detail_id: number;
  title: string;
  description?: string;
  file_url?: string;
  score?: number;
  status: "pending" | "submitted" | "graded";
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface AssignmentSubmission extends BaseEntity {
  submission_id: number;
  assignment_id: number;
  user_id: number;
  course_id: number;
  material_detail_id: number;
  submission_url?: string;
  submission_file_path?: string; 
  status: 'submitted' | 'graded' | 'returned';
  submitted_at: Date;
  grade?: number;
  feedback?: string;
}

export interface AssignmentFeedback {
  grade: number;
  feedback?: string;
  graded_at?: Date;
  graded_by?: number;
}

export interface AssignmentGradingPayload {
  submission_id: number;
  grade: number;
  feedback?: string;
}

export interface AssignmentSubmissionData {
  submission_id: number;
  user_id: number;
  material_detail_id: number;
  course_id: number;
  enrollment_id: number;
  submission_type: "file" | "url" | "text";
  file_path?: string;
  submission_url?: string;
  submission_text?: string;
  attempt_number: number;
  status: "pending" | "submitted" | "under_review" | "approved" | "rejected";
  score?: number;
  feedback?: string;
  reviewed_by?: number;
  submitted_at: Date;
  reviewed_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface SubmitAssignmentPayload {
  enrollmentId: number;
  courseId: number;
  materialDetailId: number;
  submissionType: "file" | "url" | "text";
  filePath?: string;
  submissionUrl?: string;
  submissionText?: string;
}

export interface ReviewAssignmentPayload {
  submissionId: number;
  status: "approved" | "rejected";
  score?: number;
  feedback?: string;
  reviewedBy: number;
}