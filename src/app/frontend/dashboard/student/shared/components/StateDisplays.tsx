// src\app\frontend\dashboard\student\shared\components\StateDisplays.tsx
"use client";

import { Center, Loader, Stack, Text, Button, Group } from "@mantine/core";
import { IconAlertCircle, IconMoodEmpty, IconSearch } from "@tabler/icons-react";

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}

interface EmptyStateProps {
  type: 'no-enrolled' | 'no-in-progress' | 'no-available' | 'no-search-results';
  searchTerm?: string;
  onBrowseCourses?: () => void;
  onClearFilters?: () => void;
  onRefresh?: () => void;
}

export function ErrorState({ message, onRetry, onGoHome }: ErrorStateProps) {
  return (
    <Center h="100%" py="xl">
      <Stack align="center" gap="md">
        <IconAlertCircle size={48} stroke={1.5} color="red" />
        <Text c="red">{message || "Something went wrong"}</Text>
        <Group>
          {onRetry && (
            <Button variant="light" color="red" onClick={onRetry}>
              Retry
            </Button>
          )}
          {onGoHome && (
            <Button variant="default" onClick={onGoHome}>
              Go Home
            </Button>
          )}
        </Group>
      </Stack>
    </Center>
  );
}

export function EmptyState({ type, searchTerm, onBrowseCourses, onClearFilters, onRefresh }: EmptyStateProps) {
  const content = {
    'no-enrolled': {
      icon: <IconMoodEmpty size={48} stroke={1.5} />,
      title: "You haven't enrolled in any courses yet.",
      message: "Start your learning journey by browsing our available courses.",
      button: onBrowseCourses && <Button onClick={onBrowseCourses}>Browse Courses</Button>,
    },
    'no-in-progress': {
      icon: <IconMoodEmpty size={48} stroke={1.5} />,
      title: "No courses in progress.",
      message: "Pick up where you left off or find a new course to start.",
      button: onBrowseCourses && <Button onClick={onBrowseCourses}>Browse Courses</Button>,
    },
    'no-available': {
      icon: <IconMoodEmpty size={48} stroke={1.5} />,
      title: "No courses available at the moment.",
      message: "Please check back later or try refreshing the page.",
      button: onRefresh && <Button onClick={onRefresh}>Refresh</Button>,
    },
    'no-search-results': {
      icon: <IconSearch size={48} stroke={1.5} />,
      title: `No results for "${searchTerm}"`,
      message: "Try adjusting your search or clearing the filters.",
      button: onClearFilters && <Button variant="light" onClick={onClearFilters}>Clear Filters</Button>,
    },
  }[type];

  return (
    <Center h="100%" py="xl">
      <Stack align="center" gap="sm">
        {content.icon}
        <Text fw={500}>{content.title}</Text>
        <Text c="dimmed" size="sm" ta="center">{content.message}</Text>
        {content.button}
      </Stack>
    </Center>
  );
}

export function LoadingState({ message }: { message?: string }) {
  return (
    <Center h="100%" py="xl">
      <Stack align="center" gap="sm">
        <Loader size="lg" />
        {message && <Text c="dimmed">{message}</Text>}
      </Stack>
    </Center>
  );
}