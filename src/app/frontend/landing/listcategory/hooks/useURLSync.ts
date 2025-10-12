// src\app\frontend\landing\listcategory\hooks\useURLSync.ts
"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useCategoryStore } from "../store/categoryStore";

export const useURLSync = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { 
    setSelectedCategory, 
    setSearchQuery,
    clearFilters 
  } = useCategoryStore();

  // Sync URL params to store on mount and URL changes
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      const decodedCategory = decodeURIComponent(categoryParam);
      setSelectedCategory(decodedCategory);
      setSearchQuery(decodedCategory);
    } else {
      clearFilters();
    }
  }, [searchParams, setSelectedCategory, setSearchQuery, clearFilters]);

  // Function to update URL when filters change
  const updateURL = (newCategory: string | null) => {
    const params = new URLSearchParams();
    if (newCategory && newCategory.trim()) {
      params.set('category', encodeURIComponent(newCategory));
    }
    
    const newUrl = params.toString() 
      ? `/frontend/landing/listcategory?${params.toString()}`
      : '/frontend/landing/listcategory';
    
    router.replace(newUrl, { scroll: false });
  };

  return { updateURL };
};