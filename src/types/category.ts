// src\types\category.ts

import { BaseEntity } from "./shared";

export interface Category extends BaseEntity {
  category_id: number;
  category_name?: string;
  category_description?: string;
  image_url?: string;
  course_count?: number; 
}

export interface CategoryCreationData {
  category_name?: string;
  category_description?: string;
  image_url?: string;
}