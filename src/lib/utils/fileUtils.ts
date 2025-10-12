// src\utils\fileUtils.ts
/* eslint-disable @typescript-eslint/no-require-imports */

import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

export interface UploadConfig {
  maxSize?: number;
  allowedTypes?: string[];
  baseDir?: string;
}

const DEFAULT_CONFIG: Required<UploadConfig> = {
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedTypes: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  baseDir: "uploads",
};

/**
 * Create a safe filename by removing special characters and limiting length
 */
export function createSafeFilename(
  text: string,
  maxLength: number = 50
): string {
  return text
    .toLowerCase()
    .normalize("NFD") // Normalize unicode characters
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/[^a-zA-Z0-9\s]/g, "") // Remove special characters
    .replace(/\s+/g, "_") // Replace spaces with underscores
    .replace(/_+/g, "_") // Replace multiple underscores with single
    .substring(0, maxLength)
    .replace(/^_+|_+$/g, ""); // Remove leading/trailing underscores
}

/**
 * Ensure directory exists, create if it doesn't
 */
export function ensureDirectoryExists(dirPath: string): void {
  const fs = require("fs");
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Validate uploaded file
 */
export function validateFile(
  file: File,
  config: UploadConfig = {}
): FileValidationResult {
  const { maxSize, allowedTypes } = { ...DEFAULT_CONFIG, ...config };

  if (!file || file.size === 0) {
    return { isValid: false, error: "No file provided" };
  }

  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid file type. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  if (file.size > maxSize) {
    const maxSizeMB = (maxSize / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      error: `File size too large. Maximum ${maxSizeMB}MB allowed.`,
    };
  }

  return { isValid: true };
}

/**
 * Delete file from filesystem
 */
export function deleteFile(relativePath: string): boolean {
  const fs = require("fs");
  const path = require("path");

  try {
    const fullPath = path.join(PUBLIC_DIR, relativePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Successfully deleted file: ${fullPath}`);
      return true;
    } else {
      console.warn(`File not found for deletion: ${fullPath}`);
      return false;
    }
  } catch (error) {
    console.error("Error deleting file:", error);
    return false;
  }
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() || "";
}

/**
 * Generate unique filename with timestamp
 */
export function generateUniqueFilename(
  prefix: string,
  originalFilename: string,
  suffix?: string
): string {
  const extension = getFileExtension(originalFilename);
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8);

  const parts = [prefix, suffix, timestamp, random].filter(Boolean);
  return `${parts.join("_")}.${extension}`;
}

/**
 * Course thumbnail upload handler
 */
export interface CourseUploadParams {
  file: File;
  lecturerName: string;
  courseTitle: string;
  lecturerId: number;
}

export async function uploadCourseThumbnail(
  params: CourseUploadParams
): Promise<{
  success: boolean;
  thumbnailUrl?: string;
  error?: string;
}> {
  const { file, lecturerName, courseTitle, lecturerId } = params;

  try {
    const validation = validateFile(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const safeLecturerName = createSafeFilename(
      lecturerName || `lecturer_${lecturerId}`
    );
    const safeCourseTitle = createSafeFilename(courseTitle);

    const filename = generateUniqueFilename(
      safeLecturerName,
      file.name,
      safeCourseTitle
    );

    const path = require("path");
    const lecturerDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "course-thumbnails",
      safeLecturerName
    );

    ensureDirectoryExists(lecturerDir);

    const filePath = path.join(lecturerDir, filename);
    const fs = require("fs");
    fs.writeFileSync(filePath, buffer);

    const thumbnailUrl = `/uploads/course-thumbnails/${safeLecturerName}/${filename}`;

    console.log(`Thumbnail uploaded successfully: ${thumbnailUrl}`);

    return {
      success: true,
      thumbnailUrl,
    };
  } catch (error) {
    console.error("Error uploading thumbnail:", error);
    return {
      success: false,
      error: "Failed to upload thumbnail",
    };
  }
}

/**
 * Clean up old thumbnails for a course
 */
export function cleanupOldThumbnails(oldThumbnailUrl: string): void {
  if (oldThumbnailUrl) {
    deleteFile(oldThumbnailUrl);
  }
}

/**
 * Get file size in human readable format
 */
export function formatFileSize(bytes: number): string {
  const sizes = ["Bytes", "KB", "MB", "GB"];
  if (bytes === 0) return "0 Bytes";
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round((bytes / Math.pow(1024, i)) * 100) / 100 + " " + sizes[i];
}

/**
 * Check if file is an image
 */
export function isImageFile(filename: string): boolean {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"];
  const extension = getFileExtension(filename);
  return imageExtensions.includes(extension);
}
