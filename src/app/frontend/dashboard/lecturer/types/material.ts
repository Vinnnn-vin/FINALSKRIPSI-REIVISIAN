// src\app\frontend\dashboard\lecturer\types\material.ts

export interface MaterialDetailType {
  material_detail_id: number;
  material_detail_name: string;
  material_detail_description?: string;
  material_detail_type: number; // 1=Video, 2=PDF, 3=URL, 4=Assignment
  is_free: boolean;
  materi_detail_url?: string;
}

export interface QuizType {
  quiz_id: number;
  quiz_title: string;
  quiz_description?: string;
}

export interface MaterialType {
  material_id: number;
  material_name: string;
  material_description: string;
  MaterialDetails: MaterialDetailType[];
  Quizzes: QuizType[];
}

export type ContentItemType = {
  id: string;
  type: "lesson" | "quiz" | "assignment";
  name?: string;
  description?: string;
  lessonType?: "url" | "video" | "pdf";
  url?: string;
  file?: File | null;
  isFree?: boolean;
  title?: string;
  questions?: QuestionType[];
  passing_score?: number;
  time_limit?: number;
  max_attempts?: number;
  // khusus assignment
  instructions?: string;
  dueDate?: string;
  attachmentUrl?: string;
};

export type BabType = {
  id: string;
  name: string;
  description?: string;
  items: ContentItemType[];
};

export interface QuestionType {
  id: string;
  text: string;
  type: "multiple_choice" | "checkbox";
  options: OptionType[];
}

export interface OptionType {
  id: string;
  text: string;
  is_correct: boolean;
}
