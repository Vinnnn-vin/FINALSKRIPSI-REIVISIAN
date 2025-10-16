// src\app\frontend\dashboard\student\components\AvailableCourseCard.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, Image, Text, Group, Badge, Button, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { getLevelColor, formatPrice, getInstructorName, getCourseImageUrl } from '../shared/utils';

export function AvailableCourseCard({ course }: { course: any }) {
  const router = useRouter();

  return (
    <Card withBorder radius="md" p={0}>
      <Card.Section onClick={() => router.push(`/frontend/landing/listcourse/${course.course_id}`)} style={{ cursor: 'pointer' }}>
        <Image src={getCourseImageUrl(course.thumbnail_url)} height={180} alt={course.course_title} />
      </Card.Section>

      <Stack p="md" gap="xs">
        <Text fw={500} size="lg" lineClamp={1}>{course.course_title}</Text>
        <Group>
            <Badge variant="light">{course.category?.category_name || 'Uncategorized'}</Badge>
            <Badge color={getLevelColor(course.course_level)} variant="light">
                {course.course_level}
            </Badge>
        </Group>
        <Text size="sm" c="dimmed" lineClamp={3} h={60}>
            {course.course_description}
        </Text>

        <Group justify="space-between" mt="md">
            <Stack gap={0}>
                <Text size="sm" c="dimmed">By: {getInstructorName(course.instructor)}</Text>
                <Text size="xl" fw={700}>{formatPrice(course.course_price)}</Text>
            </Stack>
            <Button
                onClick={() => router.push(`/frontend/landing/listcourse/${course.course_id}`)}
            >
                View Details
            </Button>
        </Group>
      </Stack>
    </Card>
  );
}