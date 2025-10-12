// src\app\frontend\landing\listcategory\page.tsx
"use client";
import React, { useEffect } from "react";
import { Box, Container, Divider } from "@mantine/core";

// Components
import { CategoryHero } from "./components/CategoryHero";
import { CategorySearchFilter } from "./components/CategorySearchFilter";
import { PopularCategoriesGrid } from "./components/PopularCategoriesGrid";
import { AllCategoriesGrid } from "./components/AllCategoriesGrid";
import { CategoryCTA } from "./components/CategoryCTA";
import { LoadingState } from "./components/LoadingState";
import { ErrorState } from "./components/ErrorState";

// Store and hooks
import { useCategoryStore } from "./store/categoryStore";
import { useURLSync } from "./hooks/useURLSync";

const ListCategoryPage = () => {
  const { 
    isLoading, 
    error, 
    selectedCategory, 
    popularCategories, 
    fetchCategories 
  } = useCategoryStore();
  
  // Initialize URL sync
  useURLSync();

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // Loading state
  if (isLoading) {
    return <LoadingState />;
  }

  // Error state
  if (error) {
    return <ErrorState />;
  }

  return (
    <Box>
      {/* Hero Section */}
      <CategoryHero />

      {/* Search and Filter Section */}
      <Container size="lg" py="xl">
        <CategorySearchFilter />

        {/* Popular Categories Section */}
        {!selectedCategory && popularCategories.length > 0 && (
          <>
            <PopularCategoriesGrid />
            <Divider />
          </>
        )}

        {/* All Categories Section */}
        <AllCategoriesGrid />
      </Container>

      {/* CTA Section */}
      <CategoryCTA />
    </Box>
  );
};

export default ListCategoryPage;