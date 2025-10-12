// File: hooks/useRolePermissions.ts
// Hook untuk menentukan hak akses berdasarkan role user - Role-Based Access Control (RBAC)
import { useMemo } from 'react';
import { useAuth } from './useAuth';
import { UserRole } from '@/types';

// Interface yang mendefinisikan semua permission yang ada di sistem
interface Permissions {
  canCreateCourse: boolean; // Bisa buat kursus baru
  canEditCourse: (instructorId?: number) => boolean; // Bisa edit kursus (dengan cek ownership untuk lecturer)
  canDeleteCourse: (instructorId?: number) => boolean; // Bisa hapus kursus (dengan cek ownership untuk lecturer)
  canManageUsers: boolean; // Bisa kelola user (admin only)
  canManageCategories: boolean; // Bisa kelola kategori (admin only)
  canViewDashboard: boolean; // Bisa akses dashboard
  canEnrollInCourse: boolean; // Bisa mendaftar kursus (student only)
  canAccessLearning: boolean; // Bisa akses halaman pembelajaran (student only)
  canSubmitAssignment: boolean; // Bisa submit tugas (student only)
  canGradeAssignment: boolean; // Bisa nilai tugas (lecturer & admin)
  canViewAllCourses: boolean; // Bisa lihat semua kursus (admin only, lecturer hanya kursusnya)
  canViewFinancials: boolean; // Bisa lihat data finansial (admin only)
}

export const useRolePermissions = (): Permissions => {
  const { user } = useAuth();
  
  // Memoized permissions berdasarkan role user untuk optimasi performance
  const permissions = useMemo((): Permissions => {
    const role = user?.role as UserRole;
    const userId = user?.user_id;
    
    switch (role) {
      case 'admin': // Admin memiliki akses penuh kecuali fitur student
        return {
          canCreateCourse: true,
          canEditCourse: () => true, // Admin bisa edit kursus siapa saja
          canDeleteCourse: () => true, // Admin bisa hapus kursus siapa saja
          canManageUsers: true,
          canManageCategories: true,
          canViewDashboard: true,
          canEnrollInCourse: false, // Admin tidak perlu enroll
          canAccessLearning: false, // Admin tidak perlu belajar
          canSubmitAssignment: false, // Admin tidak submit tugas
          canGradeAssignment: true, // Admin bisa nilai semua tugas
          canViewAllCourses: true,
          canViewFinancials: true,
        };
        
      case 'lecturer': // Lecturer bisa kelola kursus sendiri dan nilai tugas
        return {
          canCreateCourse: true,
          canEditCourse: (instructorId) => !instructorId || instructorId === userId, // Hanya kursus sendiri
          canDeleteCourse: (instructorId) => !instructorId || instructorId === userId, // Hanya kursus sendiri
          canManageUsers: false,
          canManageCategories: false,
          canViewDashboard: true, // Dashboard lecturer dengan statistik
          canEnrollInCourse: false,
          canAccessLearning: false,
          canSubmitAssignment: false,
          canGradeAssignment: true, // Bisa nilai tugas di kursus sendiri
          canViewAllCourses: false, // Hanya lihat kursus sendiri
          canViewFinancials: false,
        };
        
      case 'student': // Student hanya bisa fitur pembelajaran
        return {
          canCreateCourse: false,
          canEditCourse: () => false,
          canDeleteCourse: () => false,
          canManageUsers: false,
          canManageCategories: false,
          canViewDashboard: true, // Dashboard student dengan progress
          canEnrollInCourse: true,
          canAccessLearning: true,
          canSubmitAssignment: true,
          canGradeAssignment: false,
          canViewAllCourses: false, // Student lihat kursus yang tersedia untuk dibeli
          canViewFinancials: false,
        };
        
      default: // Guest user - tidak ada permission khusus
        return {
          canCreateCourse: false,
          canEditCourse: () => false,
          canDeleteCourse: () => false,
          canManageUsers: false,
          canManageCategories: false,
          canViewDashboard: false,
          canEnrollInCourse: false, // Harus login dulu
          canAccessLearning: false,
          canSubmitAssignment: false,
          canGradeAssignment: false,
          canViewAllCourses: false,
          canViewFinancials: false,
        };
    }
  }, [user]);
  
  return permissions;
};