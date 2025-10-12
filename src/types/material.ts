// src\types\material.ts

import { Course, Quiz, StudentProgress } from "@/types";
import { MaterialDetailTypeId, BaseEntity } from "./shared";

export interface Material extends BaseEntity {
  material_id: number;
  material_name?: string;
  material_description?: string;
  course_id: number;
  
  // Relational fields
  course?: Course;
  details?: MaterialDetail[];
  quizzes?: Quiz[];
}

export interface MaterialDetail extends BaseEntity {
  material_detail_id: number;
  material_detail_name: string;
  material_detail_description: string;
  material_detail_type: MaterialDetailTypeId; // Fixed: Use correct type
  materi_detail_url: string;
  material_id?: number;
  is_free?: boolean;
  
  // Relational fields
  material?: Material;
  progress?: StudentProgress[];
  
  // Computed fields for frontend
  is_completed?: boolean;
}

export interface MaterialCreationData {
  material_name?: string;
  material_description?: string;
  course_id: number;
}

export interface MaterialDetailCreationData {
  material_detail_name: string;
  material_detail_description: string;
  material_detail_type: MaterialDetailTypeId;
  materi_detail_url: string;
  material_id?: number;
  is_free?: boolean;
}

// Helper functions for material types
export const getMaterialTypeLabel = (type: MaterialDetailTypeId): string => {
  switch (type) {
    case 1:
      return "Video";
    case 2:
      return "Document";
    case 3:
      return "Audio";
    case 4:
      return "Assignment";
    default:
      return "Unknown";
  }
};

export const getMaterialTypeIcon = (type: MaterialDetailTypeId): string => {
  switch (type) {
    case 1:
      return "📹";
    case 2:
      return "📄";
    case 3:
      return "🎵";
    case 4:
      return "📝";
    default:
      return "📄";
  }
};