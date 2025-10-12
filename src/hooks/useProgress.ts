/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-unused-vars */
// File: hooks/useProgress.ts
// Hook untuk tracking progress pembelajaran mahasiswa - menghitung persentase penyelesaian
import { useState, useEffect } from 'react';
import { StudentProgress } from '@/types';
import { useAuth } from './useAuth';

// Interface untuk data progress pembelajaran
interface ProgressData {
  courseId: number;
  completedMaterials: number; // Jumlah materi yang sudah selesai
  totalMaterials: number; // Total jumlah materi dalam kursus
  progressPercentage: number; // Persentase penyelesaian (0-100)
  lastAccessed?: Date; // Terakhir kali mengakses kursus
}

export const useProgress = (courseId?: number) => {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  
  // Fungsi untuk fetch progress dari API
  const fetchProgress = async (cId: number) => {
    if (!user) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/courses/${cId}/progress`);
      if (!response.ok) throw new Error('Failed to fetch progress');
      
      const data = await response.json();
      setProgress(data.progress);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch progress');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Auto-fetch progress saat courseId berubah dan user adalah student
  useEffect(() => {
    if (courseId && user?.role === 'student') {
      fetchProgress(courseId);
    }
  }, [courseId, user]);
  
  // Fungsi untuk menandai materi sebagai selesai dan update progress
  const markMaterialComplete = async (materialDetailId: number) => {
    if (!courseId || !user) return;
    
    try {
      const response = await fetch('/api/student-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          course_id: courseId,
          material_detail_id: materialDetailId,
          is_completed: true,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to mark material as complete');
      
      // Refresh progress setelah menandai materi selesai
      fetchProgress(courseId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark material as complete');
    }
  };
  
  return {
    progress,
    isLoading,
    error,
    markMaterialComplete, // Fungsi untuk mark complete dari komponen
    refreshProgress: courseId ? () => fetchProgress(courseId) : undefined, // Fungsi refresh manual
  };
};