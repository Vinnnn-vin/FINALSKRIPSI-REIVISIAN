// src\app\frontend\dashboard\lecturer\page.tsx

"use client";

import {
  Container,
  Title,
  Group,
  Stack,
  Button,
  LoadingOverlay,
} from "@mantine/core";
import { IconRefresh, IconHome } from "@tabler/icons-react";
import { ProtectedRoute } from "../../components/auth/ProtectedRoute";
import { useLecturerDashboard } from "./hooks/useLecturerDashboard";
import StatsGrid from "./components/dashboard/StatsGrid";
import CourseTable from "./components/dashboard/CourseTable";

export default function LecturerDashboard() {
  const {
    stats,
    courses,
    isLoading,
    isRefreshing,
    fetchDashboardData,
    setCourses,
  } = useLecturerDashboard();

  if (isLoading)
    return <LoadingOverlay visible={true} overlayProps={{ blur: 1 }} />;

  return (
    <ProtectedRoute role="lecturer">
      <Container fluid p="lg">
        <LoadingOverlay visible={isRefreshing} overlayProps={{ blur: 1 }} />

        <Stack gap="xl">
          {/* Header */}
          <Group justify="space-between">
            <Button
              variant="light"
              color="gray"
              leftSection={<IconHome size={16} />}
              component="a"
              href="/frontend/landing"
              size="sm"
            >
              Back to Home
            </Button>

            <Group>
              <Title order={1}>Lecturer Dashboard</Title>
            </Group>

            <Group>
              <Button
                variant="light"
                color="gray"
                size="sm"
                onClick={() => fetchDashboardData(false)}
                leftSection={<IconRefresh size={14} />}
                loading={isRefreshing}
              >
                Refresh
              </Button>
            </Group>
          </Group>

          {/* Stats */}
          {stats && <StatsGrid stats={stats} />}
          <Button component="a" href="/frontend/dashboard/lecturer/submissions">
            View Submissions
          </Button>

          {/* Courses Table */}
          <CourseTable courses={courses} setCourses={setCourses} />
        </Stack>
      </Container>
    </ProtectedRoute>
  );
}
