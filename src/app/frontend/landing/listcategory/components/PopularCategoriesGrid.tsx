// src\app\frontend\landing\listcategory\components\PopularCategoriesGrid.tsx
"use client";
import React from "react";
import { Stack, Title, Text, Group, Grid } from "@mantine/core";
import { CategoryCard } from "./CategoryCard";
import { useCategoryStore } from "../store/categoryStore";

export const PopularCategoriesGrid: React.FC = () => {
  const { popularCategories } = useCategoryStore();

  if (popularCategories.length === 0) {
    return null;
  }

  return (
    <Stack gap="xl" mb="xl">
      <Group justify="space-between">
        <Stack gap="xs">
          <Title order={2}>Kategori dengan Kursus Tersedia</Title>
          <Text c="dimmed">Kategori yang sudah memiliki kursus</Text>
        </Stack>
      </Group>

      <Grid>
        {popularCategories.map((category) => (
          <Grid.Col
            key={`popular-category-${category.id}`}
            span={{ base: 12, sm: 6, md: 4 }}
          >
            <CategoryCard category={category} size="large" />
          </Grid.Col>
        ))}
      </Grid>
    </Stack>
  );
};