// src\app\frontend\landing\listcourse\components\CourseFilters.tsx
import React from 'react';
import { Card, Stack, Group, TextInput, Select, Text, Button } from '@mantine/core';
import { IconSearch, IconFilter, IconStack, IconSortDescending } from '@tabler/icons-react';
import { useCourseStore } from '../stores/courseStore';
import { CourseFiltersProps } from '@/types/landing/list';

const CourseFilters: React.FC<CourseFiltersProps> = ({
  categories,
  coursesLength,
  totalCourses,
}) => {
  const {
    searchQuery, setSearchQuery, selectedCategory, setSelectedCategory,
    selectedLevel, setSelectedLevel, sortBy, setSortBy, resetFilters
  } = useCourseStore();

  const levels = [
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ];

  const sortOptions = [
    { value: 'newest', label: 'Terbaru' },
    { value: 'popularity', label: 'Paling Populer' },
    { value: 'rating', label: 'Rating Tertinggi' },
    { value: 'price-low', label: 'Harga Terendah' },
    { value: 'price-high', label: 'Harga Tertinggi' },
  ];

  return (
    <Card shadow="lg" padding="xl" radius="xl" withBorder>
      <Stack gap="lg">
        <Group grow>
          <TextInput
            placeholder="Cari kursus..."
            leftSection={<IconSearch size={18} />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            size="md"
            radius="md"
          />
          <Select
            placeholder="Semua Kategori"
            data={categories}
            value={selectedCategory}
            onChange={setSelectedCategory}
            leftSection={<IconFilter size={16} />}
            size="md"
            radius="md"
            clearable
          />
          <Select
            placeholder="Semua Level"
            data={levels}
            value={selectedLevel}
            onChange={setSelectedLevel}
            leftSection={<IconStack size={16} />}
            size="md"
            radius="md"
            clearable
          />
          <Select
            data={sortOptions}
            value={sortBy}
            onChange={(value) => setSortBy(value || 'newest')}
            leftSection={<IconSortDescending size={16} />}
            size="md"
            radius="md"
          />
        </Group>
        
        <Group justify="space-between" align="center">
          <Text c="dimmed" fw={500}>
            Menampilkan {coursesLength} dari {totalCourses} kursus
          </Text>
          <Button variant="light" size="sm" onClick={resetFilters} radius="md">
            Reset Filter
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

export default CourseFilters;