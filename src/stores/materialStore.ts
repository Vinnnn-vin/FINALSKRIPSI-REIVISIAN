// src\stores\materialStore.ts

import { create } from 'zustand';
import { Material, MaterialDetail, MaterialCreationData, MaterialDetailCreationData } from '@/types';

interface MaterialState {
  materials: Material[];
  materialDetails: MaterialDetail[];
  selectedMaterial: Material | null;
  selectedMaterialDetail: MaterialDetail | null;
  isLoading: boolean;
  error: string | null;
}

interface MaterialActions {
  // Material management
  fetchMaterialsByCourse: (courseId: number) => Promise<void>;
  createMaterial: (data: MaterialCreationData) => Promise<void>;
  updateMaterial: (id: number, data: Partial<MaterialCreationData>) => Promise<void>;
  deleteMaterial: (id: number) => Promise<void>;
  reorderMaterials: (courseId: number, materialIds: number[]) => Promise<void>;
  
  // Material details management
  fetchMaterialDetails: (materialId: number) => Promise<void>;
  createMaterialDetail: (data: MaterialDetailCreationData) => Promise<void>;
  updateMaterialDetail: (id: number, data: Partial<MaterialDetailCreationData>) => Promise<void>;
  deleteMaterialDetail: (id: number) => Promise<void>;
  reorderMaterialDetails: (materialId: number, detailIds: number[]) => Promise<void>;
  markMaterialDetailComplete: (materialDetailId: number, courseId: number) => Promise<void>;
  
  // Utility functions
  clearError: () => void;
  setSelectedMaterial: (material: Material | null) => void;
  setSelectedMaterialDetail: (detail: MaterialDetail | null) => void;
}

export const useMaterialStore = create<MaterialState & MaterialActions>((set, get) => ({
  materials: [],
  materialDetails: [],
  selectedMaterial: null,
  selectedMaterialDetail: null,
  isLoading: false,
  error: null,

  fetchMaterialsByCourse: async (courseId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/courses/${courseId}/materials`);
      if (!response.ok) throw new Error('Failed to fetch materials');
      
      const data = await response.json();
      set({
        materials: data.materials,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch materials',
        isLoading: false,
      });
    }
  },

  createMaterial: async (data: MaterialCreationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/materials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create material');
      
      get().fetchMaterialsByCourse(data.course_id);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create material',
        isLoading: false,
      });
    }
  },

  updateMaterial: async (id: number, data: Partial<MaterialCreationData>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update material');
      
      const result = await response.json();
      
      set((state) => ({
        materials: state.materials.map(m => 
          m.material_id === id ? result.material : m
        ),
        selectedMaterial: state.selectedMaterial?.material_id === id ? result.material : state.selectedMaterial,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update material',
        isLoading: false,
      });
    }
  },

  deleteMaterial: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/materials/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete material');
      
      set((state) => ({
        materials: state.materials.filter(m => m.material_id !== id),
        selectedMaterial: state.selectedMaterial?.material_id === id ? null : state.selectedMaterial,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete material',
        isLoading: false,
      });
    }
  },

  reorderMaterials: async (courseId: number, materialIds: number[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/courses/${courseId}/materials/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ materialIds }),
      });
      
      if (!response.ok) throw new Error('Failed to reorder materials');
      
      get().fetchMaterialsByCourse(courseId);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reorder materials',
        isLoading: false,
      });
    }
  },

  fetchMaterialDetails: async (materialId: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/materials/${materialId}/details`);
      if (!response.ok) throw new Error('Failed to fetch material details');
      
      const data = await response.json();
      set({
        materialDetails: data.materialDetails,
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch material details',
        isLoading: false,
      });
    }
  },

  createMaterialDetail: async (data: MaterialDetailCreationData) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch('/api/material-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to create material detail');
      
      if (data.material_id) {
        get().fetchMaterialDetails(data.material_id);
      }
      
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create material detail',
        isLoading: false,
      });
    }
  },

  updateMaterialDetail: async (id: number, data: Partial<MaterialDetailCreationData>) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/material-details/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) throw new Error('Failed to update material detail');
      
      const result = await response.json();
      
      set((state) => ({
        materialDetails: state.materialDetails.map(md => 
          md.material_detail_id === id ? result.materialDetail : md
        ),
        selectedMaterialDetail: state.selectedMaterialDetail?.material_detail_id === id ? 
          result.materialDetail : state.selectedMaterialDetail,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update material detail',
        isLoading: false,
      });
    }
  },

  deleteMaterialDetail: async (id: number) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/material-details/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete material detail');
      
      set((state) => ({
        materialDetails: state.materialDetails.filter(md => md.material_detail_id !== id),
        selectedMaterialDetail: state.selectedMaterialDetail?.material_detail_id === id ? 
          null : state.selectedMaterialDetail,
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete material detail',
        isLoading: false,
      });
    }
  },

  reorderMaterialDetails: async (materialId: number, detailIds: number[]) => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`/api/materials/${materialId}/details/reorder`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ detailIds }),
      });
      
      if (!response.ok) throw new Error('Failed to reorder material details');
      
      get().fetchMaterialDetails(materialId);
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to reorder material details',
        isLoading: false,
      });
    }
  },

  markMaterialDetailComplete: async (materialDetailId: number, courseId: number) => {
    try {
      const response = await fetch('/api/student-progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          material_detail_id: materialDetailId,
          course_id: courseId,
          is_completed: true,
        }),
      });
      
      if (!response.ok) throw new Error('Failed to mark material as complete');
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to mark material as complete',
      });
    }
  },

  clearError: () => set({ error: null }),
  setSelectedMaterial: (material: Material | null) => set({ selectedMaterial: material }),
  setSelectedMaterialDetail: (detail: MaterialDetail | null) => set({ selectedMaterialDetail: detail }),
}));