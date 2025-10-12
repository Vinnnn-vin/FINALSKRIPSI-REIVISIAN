// src/services/landing.service.ts

import { LandingCourse, LandingCategory } from "@/types/landing";

// URL dasar API Anda, diambil dari environment variable
const API_BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

/**
 * Mengambil daftar kursus unggulan (4 terpopuler) dari API.
 * Data di-cache selama 1 jam untuk performa.
 */
export async function getFeaturedCourses(): Promise<LandingCourse[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/landing/listcourse?limit=4&sort=popularity`, {
      next: { revalidate: 3600 } // Cache data selama 1 jam
    });

    if (!response.ok) {
      console.error('API Error: Failed to fetch courses.', { status: response.status });
      return []; // Kembalikan array kosong jika gagal
    }

    const data = await response.json();
    return data.courses || [];
  } catch (error) {
    console.error("Service Error: Error fetching featured courses:", error);
    return []; // Selalu kembalikan array kosong jika ada error
  }
}

/**
 * Mengambil semua kategori dari API.
 * Data di-cache selama 1 jam untuk performa.
 */
export async function getCategories(): Promise<LandingCategory[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/landing/listcategory`, {
      next: { revalidate: 3600 } // Cache data selama 1 jam
    });

    if (!response.ok) {
      console.error('API Error: Failed to fetch categories.', { status: response.status });
      return []; // Kembalikan array kosong jika gagal
    }

    return await response.json();
  } catch (error) {
    console.error("Service Error: Error fetching categories:", error);
    return []; // Selalu kembalikan array kosong jika ada error
  }
}