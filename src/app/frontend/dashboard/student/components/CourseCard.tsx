// src\app\frontend\dashboard\student\components\CourseCard.tsx

"use client";

import Link from "next/link";
import {
  Card,
  Text,
  Button,
  Group,
  Badge,
  Progress,
  Stack,
  Image,
  Divider,
} from "@mantine/core";
import type { Course, EnrolledCourse } from "@/types/course";
import {
  getLevelColor,
  formatPrice,
  getInstructorName,
  getCourseImageUrl,
  getCourseFallbackUrl,
} from "../utils";

interface CourseCardProps {
  course: Course;
  enrollment?: EnrolledCourse;
  onEnroll?: (id: number) => void;
  loading?: boolean;
  variant?: "default" | "compact";
}

export default function CourseCard({
  course,
  enrollment,
  onEnroll,
  loading = false,
  variant = "default",
}: CourseCardProps) {
  const isCompact = variant === "compact";

  // Gunakan course dari enrollment bila tersedia agar progress & meta konsisten
  const displayedCourse = enrollment?.course ?? course;

  // Pastikan course valid
  if (!displayedCourse || !displayedCourse.course_id) {
    return (
      <Card shadow="sm" p="lg" radius="md" withBorder h="100%">
        <Text c="red" ta="center">
          Invalid course data
        </Text>
      </Card>
    );
  }

  // Ambil progress (prefer dari enrollment)
  const progress =
    enrollment?.course?.progress ??
    enrollment?.progress ??
    displayedCourse.progress ??
    0;

  const instructorName = getInstructorName(displayedCourse.instructor);

  return (
    <Card
      shadow="sm"
      p={isCompact ? "md" : "lg"}
      radius="md"
      withBorder
      h="100%"
    >
      <Card.Section>
        <Image
          src={getCourseImageUrl(displayedCourse.thumbnail_url)}
          height={isCompact ? 120 : 160}
          alt={displayedCourse.course_title || "Course image"}
          fallbackSrc={getCourseFallbackUrl()}
        />
      </Card.Section>

      <Group justify="space-between" mt="md" mb="xs">
        <Text fw={500} size={isCompact ? "xs" : "sm"} lineClamp={2} flex={1}>
          {displayedCourse.course_title || "Untitled Course"}
        </Text>
        <Badge
          color={getLevelColor(displayedCourse.course_level)}
          variant="light"
          size={isCompact ? "xs" : "sm"}
        >
          {displayedCourse.course_level || "Unknown"}
        </Badge>
      </Group>

      <Text size="xs" c="dimmed" lineClamp={isCompact ? 2 : 3} mb="md">
        {displayedCourse.course_description || "No description available"}
      </Text>

      {!isCompact && (
        <Stack gap="xs" mb="md">
          <Text size="xs" c="dimmed">
            By: {instructorName}
          </Text>
          <Text size="xs" c="dimmed">
            Category:{" "}
            {displayedCourse.category?.category_name || "Uncategorized"}
          </Text>
          {displayedCourse.course_duration && (
            <Text size="xs" c="dimmed">
              Duration: {displayedCourse.course_duration} hours
            </Text>
          )}
        </Stack>
      )}

      {enrollment && (
        <>
          <Progress value={progress} mb="xs" />
          <Text size="xs" c="dimmed" mb="md">
            {progress}% Complete
          </Text>
        </>
      )}

      <Divider mb="md" />

      {enrollment ? (
        // Sudah terdaftar → lanjut belajar
        <Button
          variant="light"
          color="blue"
          fullWidth
          radius="md"
          component={Link}
          href={`/frontend/dashboard/student/learn/${enrollment.enrollment_id}`}
          size={isCompact ? "xs" : "sm"}
          aria-label={`Continue Learning ${displayedCourse.course_title}`}
        >
          Continue Learning
        </Button>
      ) : (
        // Belum terdaftar → bisa enroll atau lihat detail
        <Group justify="space-between" align="center">
          <Text fw={700} size={isCompact ? "xs" : "sm"}>
            {formatPrice(displayedCourse.course_price ?? 0)}
          </Text>

          {onEnroll ? (
            <Button
              variant="filled"
              color="blue"
              radius="md"
              size={isCompact ? "xs" : "sm"}
              onClick={() => onEnroll(displayedCourse.course_id)}
              loading={loading}
              disabled={loading}
              aria-label={`Enroll in ${displayedCourse.course_title}`}
              component={Link}
              href={`/frontend/landing/listcourse/${course.course_id}`}
            >
              {loading ? "Enrolling..." : "Enroll Now"}
            </Button>
          ) : (
            <Button
              variant="filled"
              color="blue"
              radius="md"
              size={isCompact ? "xs" : "sm"}
              component={Link}
              href={`/frontend/landing/listcourse/${displayedCourse.course_id}`}
              aria-label={`View ${displayedCourse.course_title}`}
            >
              View Course
            </Button>
          )}
        </Group>
      )}
    </Card>
  );
}
