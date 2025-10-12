// src/constants/app.ts
export const APP_CONFIG = {
  COURSES_PER_PAGE: 12,
  FEATURED_COURSES_LIMIT: 4,
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: ['pdf', 'doc', 'docx'],
  VIDEO_URL_PATTERNS: [
    /^https:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https:\/\/youtu\.be\/[\w-]+/,
    /^https:\/\/drive\.google\.com\/file\/d\/[\w-]+/
  ],
  MATERIAL_TYPES: {
    VIDEO: 1,
    DOCUMENT: 2, 
    AUDIO: 3,
    ASSIGNMENT: 4
  },
  DEFAULT_QUIZ_SETTINGS: {
    PASSING_SCORE: 70,
    MAX_ATTEMPTS: 3,
    TIME_LIMIT: null
  }
} as const;

export const ROUTES = {
  HOME: '/',
  COURSES: '/courses',
  COURSE_DETAIL: (id: number) => `/courses/${id}`,
  COURSE_LEARN: (id: number) => `/learn/${id}`,
  STUDENT_DASHBOARD: '/dashboard/student',
  LECTURER_DASHBOARD: '/dashboard/lecturer',
  ADMIN_DASHBOARD: '/dashboard/admin',
  PROFILE: '/profile',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register'
} as const;