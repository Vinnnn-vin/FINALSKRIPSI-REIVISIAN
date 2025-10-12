// src\app\frontend\dashboard\student\components\EnrolledCourseCard.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card, Image, Text, Group, Badge, Button, Progress, Stack } from '@mantine/core';
import { useRouter } from 'next/navigation';
import { getLevelColor } from '../utils';

interface EnrolledCourseCardProps {
  course: any;
  onViewCertificate: (courseId: number) => void;
  onWriteReview: (courseId: number) => void;
}

export function EnrolledCourseCard({ course, onViewCertificate, onWriteReview }: EnrolledCourseCardProps) {
  const router = useRouter();
  const progress = course.course?.progress || 0;
  const hasReviewed = course.course?.has_reviewed || false;
  const courseId = course.course?.course_id;

  const renderButtons = () => {
    // Jika progres belum 100%
    if (progress < 100) {
      const buttonText = progress === 0 ? "Start Learning" : "Continue Learning";
      const buttonColor = progress === 0 ? "blue" : "green";
      
      return (
        <Button
          color={buttonColor}
          fullWidth
          mt="sm"
          onClick={() => router.push(`/frontend/dashboard/student/learn/${course.enrollment_id}`)}
        >
          {buttonText}
        </Button>
      );
    }

    // Jika sudah 100%, tampilkan tombol certificate dan review
    return (
      <Stack gap="xs" mt="sm">
        {/* Tombol View Certificate - selalu bisa diklik */}
        <Button
          color="teal"
          fullWidth
          onClick={() => onViewCertificate(courseId)}
        >
          View Certificate
        </Button>

        {/* Tombol Write Review - disabled jika sudah review */}
        {!hasReviewed ? (
          <Button
            color="orange"
            variant="light"
            fullWidth
            onClick={() => onWriteReview(courseId)}
          >
            Write a Review
          </Button>
        ) : (
          <Button
            color="gray"
            variant="light"
            fullWidth
            disabled
          >
            ✓ Already Reviewed
          </Button>
        )}
      </Stack>
    );
  };

  return (
    <Card withBorder radius="md" p={0} shadow="sm">
      <Card.Section>
        <Image 
          src={course.course?.thumbnail_url || '/default-thumbnail.jpg'} 
          height={180} 
          alt={course.course?.course_title || 'Course'} 
        />
      </Card.Section>

      <Stack p="md" gap="xs">
        <Group justify="space-between" wrap="nowrap">
          <Text fw={500} size="lg" lineClamp={1}>
            {course.course?.course_title || 'Untitled Course'}
          </Text>
        </Group>
        
        <Group gap="xs">
          <Badge variant="light">
            {course.course?.category?.category_name || 'Uncategorized'}
          </Badge>
          <Badge 
            color={getLevelColor(course.course?.course_level)} 
            variant="light"
          >
            {course.course?.course_level || 'N/A'}
          </Badge>
        </Group>
        
        <Text size="sm" c="dimmed" lineClamp={2} style={{ minHeight: '40px' }}>
          {course.course?.course_description || 'No description available'}
        </Text>
        
        <Stack mt="md" gap="xs">
          <Group justify="space-between">
            <Text size="xs" c="dimmed">
              {progress}% Completed
            </Text>
            {progress === 100 && (
              <Badge color="green" size="sm" variant="dot">
                Completed
              </Badge>
            )}
          </Group>
          <Progress 
            value={progress} 
            color={progress === 100 ? "green" : "blue"}
            size="sm"
          />
          {renderButtons()}
        </Stack>
      </Stack>
    </Card>
  );
}