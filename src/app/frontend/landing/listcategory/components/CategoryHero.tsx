// src\app\frontend\landing\listcategory\components\CategoryHero.tsx
"use client";
import React from "react";
import { Box, Container, Stack, Title, Text, Group } from "@mantine/core";
import { useCategoryStore } from "../store/categoryStore";

export const CategoryHero: React.FC = () => {
  const { 
    selectedCategory, 
    categories, 
    totalCourses, 
    totalStudents 
  } = useCategoryStore();

  return (
    <Box
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "300px",
        display: "flex",
        alignItems: "center",
        color: "white",
      }}
    >
      <Container size="lg">
        <Stack gap="xl" ta="center">
          <Title size="h1" fw={700}>
            Kategori Kursus
          </Title>
          <Text size="xl" opacity={0.9}>
            {selectedCategory 
              ? `Menampilkan kategori: ${selectedCategory}`
              : "Jelajahi berbagai kategori pembelajaran dan temukan passion Anda"}
          </Text>
          <Group justify="center" gap="xl">
            <Stack align="center" gap={4}>
              <Text size="2xl" fw={700}>
                {categories.length}
              </Text>
              <Text size="sm" opacity={0.8}>
                Kategori
              </Text>
            </Stack>
            <Stack align="center" gap={4}>
              <Text size="2xl" fw={700}>
                {totalCourses}
              </Text>
              <Text size="sm" opacity={0.8}>
                Total Kursus
              </Text>
            </Stack>
            <Stack align="center" gap={4}>
              <Text size="2xl" fw={700}>
                {totalStudents.toLocaleString()}
              </Text>
              <Text size="sm" opacity={0.8}>
                Total Siswa
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
};