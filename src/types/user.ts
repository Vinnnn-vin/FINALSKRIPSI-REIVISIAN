// src\types\user.ts

import { BaseEntity, UserRole } from "./shared";

// REVISI: Menambahkan `is_active` untuk fitur aktif/nonaktif oleh Admin.
export interface User extends BaseEntity {
  user_id: number;
  first_name?: string;
  last_name?: string;
  full_name?: string; // Virtual field
  email?: string;
  password_hash?: string;
  role?: UserRole;
  is_active?: boolean; // BARU: Untuk fitur Admin menonaktifkan pengguna
}

// BARU: Tipe data spesifik untuk halaman manajemen pengguna oleh Admin.
// Lebih baik dari sekadar memakai `User` karena bisa ditambah properti lain.
export interface UserManagementView extends User {
  course_count?: number; // Jumlah kursus yang dibuat (dosen) atau diambil (siswa)
  last_login?: Date;
  total_payment?: number;
}

// Payload untuk API registrasi oleh Guest.
export interface RegisterPayload {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}

// Payload untuk API update profil oleh Siswa/Dosen.
export interface UpdateProfilePayload {
  first_name?: string;
  last_name?: string;
}

// BARU: Payload terpisah untuk ganti password, ini praktik keamanan yang baik.
export interface UpdatePasswordPayload {
  current_password: string;
  new_password: string;
}

// BARU: Payload untuk Admin saat memperbarui data pengguna.
// Admin punya hak lebih, seperti mengubah peran.
export interface AdminUpdateUserPayload extends UpdateProfilePayload {
    role?: UserRole;
    is_active?: boolean;
}