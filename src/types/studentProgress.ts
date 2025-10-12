// src\types\studentProgress.ts

import { Course, MaterialDetail, QuizAnswerOption, QuizQuestion, User } from "@/types";
import { BaseEntity, StudentQuizAnswerStatus } from "./shared";

export interface StudentProgress extends BaseEntity {
  progress_id: number;
  user_id: number;
  course_id: number;
  material_detail_id: number;
  is_completed: boolean;
  completed_at: Date;

  student?: User;
  course?: Course;
  material_detail?: MaterialDetail;
}
export interface StudentQuizAnswer {
  answer_id: number;
  question_id?: number;
  selected_option_id?: number;
  answer_text?: string;
  is_correct?: boolean;
  attempt_session?: number;
  score?: number;
  status?: StudentQuizAnswerStatus;
  answered_at?: Date;
  completed_at?: Date;
  
  question?: QuizQuestion;
  selected_option?: QuizAnswerOption;
}

export interface StudentProgressCreationData {
  user_id: number;
  course_id: number;
  material_detail_id: number;
  is_completed: boolean;
}