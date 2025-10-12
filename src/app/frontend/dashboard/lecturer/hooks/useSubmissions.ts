// src\app\frontend\dashboard\lecturer\hooks\useSubmissions.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';

// Definisikan tipe data agar konsisten
export interface Submission {
  submission_id: number;
  student: { user_id: number; name: string; email: string; };
  course: { course_id: number; course_title: string; };
  assignment: { material_detail_id: number; name: string; };
  submission_type: 'file' | 'text' | 'url';
  file_path: string | null;
  submission_text: string | null;
  status: 'submitted' | 'approved' | 'rejected' | 'under_review';
  submitted_at: string;
  score?: number;
  feedback?: string;
}

export const useSubmissions = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State untuk filter
  const [courseFilter, setCourseFilter] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>('submitted');

  const fetchSubmissions = useCallback(async () => {
    setLoading(true);
    try {
      // Bangun URL dengan parameter filter
      const params = new URLSearchParams();
      if (courseFilter) params.append('courseId', courseFilter);
      if (statusFilter) params.append('status', statusFilter);

      const response = await fetch(`/api/dashboard/lecturer/assignments?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch submissions');
      
      const data = await response.json();
      setSubmissions(data.submissions || []);
    } catch (err: any) {
      setError(err.message);
      notifications.show({ title: 'Error', message: err.message, color: 'red' });
    } finally {
      setLoading(false);
    }
  }, [courseFilter, statusFilter]);

  useEffect(() => {
    fetchSubmissions();
  }, [fetchSubmissions]);

  const handleGradeSubmission = async (
    submissionId: number,
    payload: { score: number; feedback: string; status: 'approved' | 'rejected' }
  ) => {
    try {
      const response = await fetch(`/api/dashboard/lecturer/assignments/${submissionId}/review`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to submit grade');
      }

      notifications.show({ title: 'Success', message: 'Grade submitted successfully!', color: 'green' });
      
      // Refresh data setelah berhasil
      await fetchSubmissions();
      return true; // Mengindikasikan sukses
    } catch (err: any) {
      notifications.show({ title: 'Error', message: err.message, color: 'red' });
      return false; // Mengindikasikan gagal
    }
  };

  return {
    submissions,
    loading,
    error,
    filters: { courseFilter, statusFilter },
    setFilters: { setCourseFilter, setStatusFilter },
    handleGradeSubmission,
  };
};