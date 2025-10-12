// src\types\quiz.ts

import { Course, Material, StudentQuizAnswer } from "@/types";
import { BaseEntity, QuizQuestionType } from "./shared";

export interface Quiz extends BaseEntity {
  quiz_id: number;
  material_id?: number;
  course_id?: number;
  quiz_title?: string;
  quiz_description?: string;
  passing_score?: number;
  time_limit?: number;
  max_attempts?: number;
  
  // Relational fields
  material?: Material;
  course?: Course;
  questions?: QuizQuestion[];
  answer_options?: QuizAnswerOption[];
}

export interface QuizQuestion extends BaseEntity {
  question_id: number;
  quiz_id?: number;
  question_text?: string;
  question_type?: QuizQuestionType;
  question_order?: number;
  points?: number;
  
  // Relational fields
  quiz?: Quiz;
  answer_options?: QuizAnswerOption[];
  student_answers?: StudentQuizAnswer[];
}

export interface QuizAnswerOption {
  option_id: number;
  quiz_id?: number;
  question_id?: number;
  option_text?: string;
  is_correct?: boolean;
  
  // Relational fields
  quiz?: Quiz;
  question?: QuizQuestion;
  student_answers?: StudentQuizAnswer[];
}

export interface QuizCreationData {
  material_id?: number;
  course_id?: number;
  quiz_title?: string;
  quiz_description?: string;
  passing_score?: number;
  time_limit?: number;
  max_attempts?: number;
}

export interface QuizQuestionCreationData {
  quiz_id?: number;
  question_text?: string;
  question_type?: QuizQuestionType;
  question_order?: number;
  points?: number;
}

export interface QuizAnswerOptionCreationData {
  quiz_id?: number;
  question_id?: number;
  option_text?: string;
  is_correct?: boolean;
}