/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLearningStore } from '@/stores/learningStore';

export const useLearningData = () => {
  const router = useRouter();
  const {
    enrollmentId,
    setData,
    setLoading,
    setError,
    setSelectedItem,
    setEnrollmentId
  } = useLearningStore();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const pathParts = window.location.pathname.split('/');
      const id = pathParts[pathParts.indexOf('learn') + 1];
      if (id) {
        setEnrollmentId(id);
      }
    }
  }, [setEnrollmentId]);

  useEffect(() => {
    if (!enrollmentId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/dashboard/student/learn/${enrollmentId}`
        );

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Gagal memuat data pembelajaran');
        }

        const result = await response.json();

        if (
          !result ||
          !result.course ||
          !result.course.materials ||
          !Array.isArray(result.course.materials)
        ) {
          throw new Error('Data pembelajaran tidak valid');
        }

        setData(result);

        // Auto-select first available content
        if (result.course.materials.length > 0) {
          const firstMaterial = result.course.materials[0];
          
          const freeDetail = firstMaterial.details?.find((d: { is_free: any; }) => d.is_free);
          if (freeDetail) {
            setSelectedItem({
              type: 'detail',
              id: freeDetail.material_detail_id,
              material_id: firstMaterial.material_id
            });
          } else if (firstMaterial.details && firstMaterial.details.length > 0) {
            setSelectedItem({
              type: 'detail',
              id: firstMaterial.details[0].material_detail_id,
              material_id: firstMaterial.material_id
            });
          } else if (firstMaterial.quizzes && firstMaterial.quizzes.length > 0) {
            setSelectedItem({
              type: 'quiz',
              id: firstMaterial.quizzes[0].quiz_id,
              material_id: firstMaterial.material_id
            });
          }
        }
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message || 'Terjadi kesalahan saat memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [enrollmentId, setData, setLoading, setError, setSelectedItem]);

  const handleMarkAsComplete = async (materialDetailId: number) => {
    if (!enrollmentId) return;

    try {
      const response = await fetch("/api/dashboard/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollmentId: parseInt(enrollmentId),
          courseId: useLearningStore.getState().data?.course.course_id,
          materialDetailId: materialDetailId,
          isCompleted: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Gagal menyimpan progres");
      }

      useLearningStore.getState().markDetailAsComplete(materialDetailId);
      alert("Materi berhasil ditandai selesai!");
    } catch (err: any) {
      console.error("Error marking as complete:", err);
      alert(`Gagal menandai materi: ${err.message}`);
    }
  };

  return { enrollmentId, handleMarkAsComplete, router };
};