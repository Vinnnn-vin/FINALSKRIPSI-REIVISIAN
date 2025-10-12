// src\app\frontend\landing\listcategory\hooks\useCategoryActions.ts
"use client";
import { useCategoryStore } from "../store/categoryStore";
import { useURLSync } from "./useURLSync";

export const useCategoryActions = () => {
  const { 
    setSearchQuery, 
    setSelectedCategory, 
    setSortBy,
    clearFilters: storeClearFilters 
  } = useCategoryStore();
  const { updateURL } = useURLSync();

  // Handle search input change with URL update
  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (value.trim()) {
      setSelectedCategory(value.trim());
      updateURL(value.trim());
    } else {
      setSelectedCategory(null);
      updateURL(null);
    }
  };

  // Handle sort change
  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  // Clear all filters and update URL
  const clearFilters = () => {
    storeClearFilters();
    updateURL(null);
  };

  return {
    handleSearchChange,
    handleSortChange,
    clearFilters,
  };
};