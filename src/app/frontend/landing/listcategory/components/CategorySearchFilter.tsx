// src\app\frontend\landing\listcategory\components\CategorySearchFilter.tsx
"use client";
import React from "react";
import {
  Card,
  Grid,
  TextInput,
  Select,
  Group,
  Badge,
  ActionIcon,
} from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useCategoryStore } from "../store/categoryStore";
import { useCategoryActions } from "../hooks/useCategoryActions";

const sortOptions = [
  { value: "popular", label: "Paling Populer" },
  { value: "newest", label: "Terbaru" },
  { value: "most-courses", label: "Terbanyak Kursus" },
  { value: "most-students", label: "Terbanyak Siswa" },
  { value: "alphabetical", label: "A-Z" },
];

export const CategorySearchFilter: React.FC = () => {
  const { searchQuery, selectedCategory, sortBy } = useCategoryStore();
  const { handleSearchChange, handleSortChange, clearFilters } = useCategoryActions();

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
      <Grid align="end">
        <Grid.Col span={{ base: 12, sm: 8 }}>
          <TextInput
            placeholder="Cari kategori berdasarkan nama atau deskripsi..."
            leftSection={<IconSearch size={16} />}
            rightSection={
              selectedCategory && (
                <ActionIcon 
                  variant="subtle" 
                  color="gray" 
                  onClick={clearFilters}
                  style={{ cursor: 'pointer' }}
                >
                  <IconX size={16} />
                </ActionIcon>
              )
            }
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.currentTarget.value)}
            size="md"
          />
          {selectedCategory && (
            <Group gap="xs" mt="sm">
              <Badge 
                variant="light" 
                color="blue"
                rightSection={
                  <ActionIcon 
                    size={16} 
                    color="blue" 
                    variant="transparent"
                    onClick={clearFilters}
                  >
                    <IconX size={12} />
                  </ActionIcon>
                }
              >
                Filter: {selectedCategory}
              </Badge>
            </Group>
          )}
        </Grid.Col>
        <Grid.Col span={{ base: 12, sm: 4 }}>
          <Select
            placeholder="Urutkan berdasarkan"
            data={sortOptions}
            value={sortBy}
            onChange={(value) => handleSortChange(value || "popular")}
            size="md"
          />
        </Grid.Col>
      </Grid>
    </Card>
  );
};