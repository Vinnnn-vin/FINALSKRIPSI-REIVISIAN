// File: hooks/useAssignments.ts
// Hook untuk mengelola tugas dan pengumpulan
import { useAssignmentStore } from '@/stores/assignmentStore';

export const useAssignments = () => {
  const store = useAssignmentStore();
  return store;
};
