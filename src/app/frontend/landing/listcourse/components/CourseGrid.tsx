// src\app\frontend\landing\listcourse\components\CourseGrid.tsx

import React from 'react';
import { SimpleGrid, Box, Stack, Text, Button } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import CourseCard from './CourseCard';
import CourseCardSkeleton from './CourseCardSkeleton';
import { CourseDisplayData } from '@/types/landing';

interface CourseGridProps {
  courses: CourseDisplayData[];
  isLoading: boolean;
  error: string | null;
  onResetFilters: () => void;
}

const CourseGrid: React.FC<CourseGridProps> = ({
  courses,
  isLoading,
  error,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
        {Array.from({ length: 6 }).map((_, index) => (
          <CourseCardSkeleton key={`skeleton-${index}`} />
        ))}
      </SimpleGrid>
    );
  }

  if (courses.length === 0) {
    return (
      <Box ta="center" py="xl">
        <Stack align="center" gap="lg">
          <IconSearch size={64} color="gray" />
          <Stack gap="xs" align="center">
            <Text size="xl" fw={600} c="dimmed">
              {error ? 'Gagal memuat data kursus' : 'Tidak ada kursus yang ditemukan'}
            </Text>
            <Text c="dimmed" ta="center">
              Coba gunakan kata kunci yang berbeda atau hapus filter pencarian
            </Text>
          </Stack>
          <Button variant="outline" onClick={onResetFilters}>
            Reset Filter
          </Button>
        </Stack>
      </Box>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
      {courses.map((course) => (
        <CourseCard key={course.id} course={course} />
      ))}
    </SimpleGrid>
  );
};

export default CourseGrid;