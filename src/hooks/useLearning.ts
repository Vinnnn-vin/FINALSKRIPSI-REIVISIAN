/* eslint-disable @typescript-eslint/no-unused-vars */
// File: hooks/useLearning.ts
// ================================
import { useLearningStore } from '@/stores/learningStore';
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/router';

export const useLearning = (enrollmentId?: string) => {
  const {
    data,
    loading,
    error,
    selectedItem,
    fetchLearningData,
    setSelectedItem,
    markDetailAsComplete,
    markQuizAsComplete,
    downloadCertificate,
    clearData,
    resetState,
  } = useLearningStore();
  
  const router = useRouter();

  useEffect(() => {
    if (enrollmentId) {
      fetchLearningData(enrollmentId);
    }
    
    return () => {
      clearData();
    };
  }, [enrollmentId, fetchLearningData, clearData]);

  const handleSelectItem = useCallback((type: 'detail' | 'quiz', id: number, materialId: number) => {
    setSelectedItem({ type, id, material_id: materialId });
  }, [setSelectedItem]);

  const handleMarkDetailComplete = useCallback(async (materialDetailId: number) => {
    await markDetailAsComplete(materialDetailId);
  }, [markDetailAsComplete]);

  const handleMarkQuizComplete = useCallback(async (quizId: number, score: number) => {
    await markQuizAsComplete(quizId, score);
  }, [markQuizAsComplete]);

  const handleDownloadCertificate = useCallback(async () => {
    await downloadCertificate();
  }, [downloadCertificate]);

  const navigateToNextItem = useCallback(() => {
    if (!data) return;
    
    // Logic to find next item in sequence
    const allItems: Array<{type: 'detail' | 'quiz', id: number, material_id: number}> = [];
    
    data.course.materials.forEach(material => {
      material.details.forEach(detail => {
        allItems.push({ type: 'detail', id: detail.material_detail_id, material_id: material.material_id });
      });
      material.quizzes.forEach(quiz => {
        allItems.push({ type: 'quiz', id: quiz.quiz_id, material_id: material.material_id });
      });
    });
    
    if (selectedItem) {
      const currentIndex = allItems.findIndex(item => 
        item.type === selectedItem.type && item.id === selectedItem.id
      );
      
      if (currentIndex < allItems.length - 1) {
        const nextItem = allItems[currentIndex + 1];
        setSelectedItem(nextItem);
      }
    }
  }, [data, selectedItem, setSelectedItem]);

  return {
    data,
    loading,
    error,
    selectedItem,
    course: data?.course,
    progress: data?.progress_percentage || 0,
    canDownloadCertificate: data?.can_download_certificate || false,
    selectItem: handleSelectItem,
    markDetailComplete: handleMarkDetailComplete,
    markQuizComplete: handleMarkQuizComplete,
    downloadCertificate: handleDownloadCertificate,
    navigateToNextItem,
    resetState,
  };
};