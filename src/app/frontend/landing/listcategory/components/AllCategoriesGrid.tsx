// src\app\frontend\landing\listcategory\components\AllCategoriesGrid.tsx
"use client";
import React from "react";
import {
  Stack,
  Title,
  Text,
  Group,
  Grid,
  Card,
  Button,
} from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import { CategoryCard } from "./CategoryCard";
import { useCategoryStore } from "../store/categoryStore";
import { useCategoryActions } from "../hooks/useCategoryActions";

export const AllCategoriesGrid: React.FC = () => {
  const { 
    filteredAndSortedCategories, 
    selectedCategory, 
    categories 
  } = useCategoryStore();
  const { clearFilters } = useCategoryActions();

  return (
    <Stack gap="xl" mt="xl">
      <Group justify="space-between">
        <Stack gap="xs">
          <Title order={2}>
            {selectedCategory
              ? `Hasil untuk "${selectedCategory}"`
              : "Semua Kategori"}
          </Title>
          <Text c="dimmed">
            Menampilkan {filteredAndSortedCategories.length} dari {categories.length} kategori
          </Text>
        </Stack>
      </Group>

      {filteredAndSortedCategories.length === 0 ? (
        <Card shadow="sm" padding="xl" radius="md" withBorder>
          <Stack gap="md" ta="center">
            <IconSearch size={48} color="gray" />
            <Text size="lg" c="dimmed">
              Tidak ada kategori yang ditemukan
            </Text>
            <Text size="sm" c="dimmed">
              {selectedCategory 
                ? `Tidak ditemukan kategori dengan nama "${selectedCategory}"`
                : "Coba gunakan kata kunci yang berbeda atau hapus filter pencarian"}
            </Text>
            <Button variant="outline" onClick={clearFilters}>
              {selectedCategory ? "Hapus Filter" : "Reset Pencarian"}
            </Button>
          </Stack>
        </Card>
      ) : (
        <Grid>
          {filteredAndSortedCategories.map((category) => (
            <Grid.Col
              key={`all-category-${category.id}`}
              span={{ base: 12, sm: 6, md: 4, lg: 3 }}
            >
              <CategoryCard category={category} size="medium" />
            </Grid.Col>
          ))}
        </Grid>
      )}
    </Stack>
  );
};