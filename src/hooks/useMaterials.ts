// File: hooks/useMaterials.ts
// ================================
import { useMaterialStore } from '@/stores/materialStore';
import { useCallback } from 'react';
import { MaterialCreationData, MaterialDetailCreationData } from '@/types';

export const useMaterials = (courseId?: number) => {
  const {
    materials,
    materialDetails,
    selectedMaterial,
    selectedMaterialDetail,
    isLoading,
    error,
    fetchMaterialsByCourse,
    fetchMaterialDetails,
    createMaterial,
    updateMaterial,
    deleteMaterial,
    reorderMaterials,
    createMaterialDetail,
    updateMaterialDetail,
    deleteMaterialDetail,
    reorderMaterialDetails,
    markMaterialDetailComplete,
    clearError,
    setSelectedMaterial,
    setSelectedMaterialDetail,
  } = useMaterialStore();

  const loadMaterials = useCallback(async () => {
    if (courseId) {
      await fetchMaterialsByCourse(courseId);
    }
  }, [courseId, fetchMaterialsByCourse]);

  const loadMaterialDetails = useCallback(async (materialId: number) => {
    await fetchMaterialDetails(materialId);
  }, [fetchMaterialDetails]);

  const handleCreateMaterial = useCallback(async (data: MaterialCreationData) => {
    await createMaterial(data);
  }, [createMaterial]);

  const handleUpdateMaterial = useCallback(async (id: number, data: Partial<MaterialCreationData>) => {
    await updateMaterial(id, data);
  }, [updateMaterial]);

  const handleDeleteMaterial = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to delete this material?')) {
      await deleteMaterial(id);
    }
  }, [deleteMaterial]);

  const handleCreateMaterialDetail = useCallback(async (data: MaterialDetailCreationData) => {
    await createMaterialDetail(data);
  }, [createMaterialDetail]);

  const handleUpdateMaterialDetail = useCallback(async (id: number, data: Partial<MaterialDetailCreationData>) => {
    await updateMaterialDetail(id, data);
  }, [updateMaterialDetail]);

  const handleDeleteMaterialDetail = useCallback(async (id: number) => {
    if (window.confirm('Are you sure you want to delete this material detail?')) {
      await deleteMaterialDetail(id);
    }
  }, [deleteMaterialDetail]);

  const handleReorderMaterials = useCallback(async (materialIds: number[]) => {
    if (courseId) {
      await reorderMaterials(courseId, materialIds);
    }
  }, [courseId, reorderMaterials]);

  const handleReorderMaterialDetails = useCallback(async (materialId: number, detailIds: number[]) => {
    await reorderMaterialDetails(materialId, detailIds);
  }, [reorderMaterialDetails]);

  return {
    materials,
    materialDetails,
    selectedMaterial,
    selectedMaterialDetail,
    isLoading,
    error,
    loadMaterials,
    loadMaterialDetails,
    createMaterial: handleCreateMaterial,
    updateMaterial: handleUpdateMaterial,
    deleteMaterial: handleDeleteMaterial,
    createMaterialDetail: handleCreateMaterialDetail,
    updateMaterialDetail: handleUpdateMaterialDetail,
    deleteMaterialDetail: handleDeleteMaterialDetail,
    reorderMaterials: handleReorderMaterials,
    reorderMaterialDetails: handleReorderMaterialDetails,
    markMaterialDetailComplete,
    clearError,
    setSelectedMaterial,
    setSelectedMaterialDetail,
  };
};