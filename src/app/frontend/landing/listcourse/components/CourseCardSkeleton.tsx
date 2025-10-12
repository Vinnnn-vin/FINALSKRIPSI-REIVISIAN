// src\app\frontend\landing\listcourse\components\CourseCardSkeleton.tsx
import React from 'react';
import { Card, Box, Skeleton, Stack, Group } from '@mantine/core';

const CourseCardSkeleton: React.FC = () => (
  <Card
    shadow="md"
    padding={0}
    radius="xl"
    withBorder
    style={{ height: "100%", overflow: "hidden" }}
  >
    <Card.Section>
      <Skeleton height={220} />
    </Card.Section>
    <Box p="xl">
      <Stack gap="md">
        <Skeleton height={12} width="60%" />
        <Skeleton height={24} />
        <Skeleton height={16} width="70%" />
        <Group justify="space-between">
          <Skeleton height={16} width="40%" />
          <Skeleton height={16} width="30%" />
        </Group>
        <Group justify="space-between" mt="md">
          <Skeleton height={20} width="50%" />
          <Skeleton height={32} width={100} />
        </Group>
      </Stack>
    </Box>
  </Card>
);

export default CourseCardSkeleton;