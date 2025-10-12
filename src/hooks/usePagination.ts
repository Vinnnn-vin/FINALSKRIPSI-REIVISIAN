// File: hooks/usePagination.ts
// Utility hook untuk mengelola pagination state
import { useState, useCallback } from 'react';

interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface PaginationActions {
  goToPage: (page: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  setItemsPerPage: (items: number) => void;
  updateTotalItems: (total: number) => void;
  reset: () => void;
}

export const usePagination = (initialItemsPerPage = 10): PaginationState & PaginationActions => {
  const [state, setState] = useState<PaginationState>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: initialItemsPerPage,
  });
  
  const goToPage = useCallback((page: number) => {
    setState(prev => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, prev.totalPages)),
    }));
  }, []);
  
  const nextPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, prev.totalPages),
    }));
  }, []);
  
  const prevPage = useCallback(() => {
    setState(prev => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 1),
    }));
  }, []);
  
  const setItemsPerPage = useCallback((items: number) => {
    setState(prev => {
      const totalPages = Math.ceil(prev.totalItems / items);
      return {
        ...prev,
        itemsPerPage: items,
        totalPages,
        currentPage: Math.min(prev.currentPage, totalPages) || 1,
      };
    });
  }, []);
  
  const updateTotalItems = useCallback((total: number) => {
    setState(prev => {
      const totalPages = Math.ceil(total / prev.itemsPerPage);
      return {
        ...prev,
        totalItems: total,
        totalPages,
        currentPage: Math.min(prev.currentPage, totalPages) || 1,
      };
    });
  }, []);
  
  const reset = useCallback(() => {
    setState({
      currentPage: 1,
      totalPages: 1,
      totalItems: 0,
      itemsPerPage: initialItemsPerPage,
    });
  }, [initialItemsPerPage]);
  
  return {
    ...state,
    goToPage,
    nextPage,
    prevPage,
    setItemsPerPage,
    updateTotalItems,
    reset,
  };
};