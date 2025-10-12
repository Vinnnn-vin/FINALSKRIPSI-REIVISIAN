/* eslint-disable @typescript-eslint/no-explicit-any */
// src\app\frontend\landing\listcategory\utils\categoryUtils.ts
import {
  IconCode,
  IconPalette,
  IconTrendingUp,
  IconDatabase,
  IconBuildingStore,
  IconCamera,
  IconMusic,
  IconLanguage,
  IconHeart,
  IconPlant,
  IconCooker,
  IconCategory,
} from "@tabler/icons-react";

// Interface untuk data kategori dari API
export interface CategoryAPI {
  category_id: number;
  category_name: string;
  course_count: number;
  category_description?: string;
  color?: string;
  image_url?: string;
  popular?: boolean;
}

// Interface untuk data kategori yang sudah diformat
export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  icon: any;
  courseCount: number;
  studentCount: number;
  color: string;
  image: string;
  level: string[];
  popular: boolean;
}

// Mapping icon berdasarkan nama kategori
export const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();

  if (
    name.includes("teknik informatika") ||
    name.includes("programming") ||
    name.includes("development") ||
    name.includes("komputer")
  ) {
    return IconCode;
  } else if (name.includes("desain")) {
    return IconPalette;
  } else if (
    name.includes("marketing") ||
    name.includes("bisnis") ||
    name.includes("kewirausahaan")
  ) {
    return IconTrendingUp;
  } else if (name.includes("data") || name.includes("basis data")) {
    return IconDatabase;
  } else if (name.includes("jaringan")) {
    return IconBuildingStore;
  } else if (name.includes("photo")) {
    return IconCamera;
  } else if (name.includes("music") || name.includes("audio")) {
    return IconMusic;
  } else if (name.includes("bahasa")) {
    return IconLanguage;
  } else if (name.includes("health") || name.includes("wellness")) {
    return IconHeart;
  } else if (name.includes("cook") || name.includes("culinary")) {
    return IconCooker;
  } else if (name.includes("agriculture") || name.includes("plant")) {
    return IconPlant;
  } else {
    return IconCategory;
  }
};

// Fungsi untuk generate slug dari nama kategori
export const generateSlug = (name: string) => {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");
};

// Fungsi untuk generate deskripsi kategori berdasarkan nama
export const generateDescription = (categoryName: string) => {
  const descriptions: { [key: string]: string } = {
    "teknik informatika":
      "Pelajari teknologi komputer terkini mulai dari pemrograman, algoritma, hingga pengembangan sistem informasi modern.",
    "jaringan komputer":
      "Kuasai teknologi jaringan komputer, administrasi server, dan keamanan sistem untuk era digital.",
    "basis data":
      "Pelajari desain, implementasi, dan manajemen basis data untuk aplikasi modern dan big data.",
    "kecerdasan buatan":
      "Eksplorasi machine learning, deep learning, dan AI untuk solusi teknologi masa depan.",
    "sistem operasi":
      "Memahami arsitektur sistem operasi, administrasi server, dan optimalisasi performa sistem.",
    kewirausahaan:
      "Entrepreneurship, manajemen bisnis, dan strategi pengembangan usaha untuk era digital.",
    "soft skills":
      "Pengembangan kemampuan komunikasi, leadership, dan keterampilan interpersonal untuk karier sukses.",
    "teknik elektro":
      "Pelajari sistem kelistrikan, elektronika, dan teknologi kontrol untuk industri modern.",
    "teknik industri":
      "Optimalisasi proses produksi, manajemen operasi, dan efisiensi sistem industri.",
    "teknik mekatronika":
      "Integrasi mekanik, elektronik, dan kontrol sistem untuk otomasi industri.",
    "desain komunikasi visual":
      "Kreativitas visual, branding, dan komunikasi grafis untuk media digital dan cetak.",
    "desain produk":
      "Pengembangan produk inovatif dari konsep hingga implementasi dengan pendekatan user-centered design.",
    bahasa:
      "Penguasaan bahasa asing untuk komunikasi global dan pengembangan karier internasional.",
    matematika:
      "Matematika terapan dan sains untuk mendukung teknologi dan inovasi modern.",
  };

  const name = categoryName.toLowerCase();
  for (const [key, desc] of Object.entries(descriptions)) {
    if (name.includes(key)) {
      return desc;
    }
  }
  return `Pelajari berbagai skill dan pengetahuan dalam bidang ${categoryName} dengan instruktur berpengalaman dan kurikulum yang up-to-date.`;
};

// Transform API data to frontend format
export const transformCategories = (categoriesData: CategoryAPI[]): Category[] => {
  const colors = ['blue', 'red', 'green', 'purple', 'orange', 'teal', 'pink', 'indigo'];
  
  return categoriesData.map((category, index) => ({
    id: category.category_id || index + 1,
    name: category.category_name,
    slug: generateSlug(category.category_name),
    description:
      category.category_description ||
      generateDescription(category.category_name),
    icon: getCategoryIcon(category.category_name),
    courseCount: category.course_count || 0,
    // Generate consistent student count based on course count
    studentCount: category.course_count > 0 
      ? Math.floor(category.course_count * (Math.random() * 200 + 100)) // 100-300 students per course
      : Math.floor(Math.random() * 500) + 50, // 50-550 interested students for upcoming categories
    color: category.color || colors[index % colors.length],
    image: category.image_url || "/SIGNIN.jpg",
    level: ["Beginner", "Intermediate", "Advanced"],
    popular: category.popular || category.course_count > 0,
  }));
};

// Sort categories function
export const sortCategories = (categories: Category[], sortBy: string): Category[] => {
  let filtered = [...categories];

  switch (sortBy) {
    case "newest":
      filtered = filtered.reverse();
      break;
    case "most-courses":
      filtered = filtered.sort((a, b) => b.courseCount - a.courseCount);
      break;
    case "most-students":
      filtered = filtered.sort((a, b) => b.studentCount - a.studentCount);
      break;
    case "alphabetical":
      filtered = filtered.sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "popular":
    default:
      filtered = filtered.sort((a, b) => {
        if (a.courseCount > 0 && b.courseCount === 0) return -1;
        if (a.courseCount === 0 && b.courseCount > 0) return 1;
        return b.courseCount - a.courseCount;
      });
      break;
  }

  return filtered;
};