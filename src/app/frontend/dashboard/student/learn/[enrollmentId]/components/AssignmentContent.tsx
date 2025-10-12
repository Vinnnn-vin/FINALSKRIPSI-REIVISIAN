// src\app\frontend\dashboard\student\learn\[enrollmentId]\components\AssignmentContent.tsx

"use client";

import { useEffect } from "react";
import { Card, Title, Text, Button, Loader, Alert, Stack } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useLearningStore } from "@/app/frontend/dashboard/student/stores/useDashboardStore";

interface Props {
  enrollmentId: number;
  materialDetailId: number;
}

export default function AssignmentContent({ enrollmentId, materialDetailId }: Props) {
  const {
    assignments,
    fetchAssignment,
    markComplete,
    loadingAssignments,
  } = useLearningStore();

  const assignment = assignments[materialDetailId];
  const loading = loadingAssignments[materialDetailId];

  useEffect(() => {
    if (!assignment) {
      fetchAssignment(enrollmentId, materialDetailId);
    }
  }, [assignment, enrollmentId, materialDetailId, fetchAssignment]);

  if (loading) return <Loader />;
  if (!assignment)
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red">
        Failed to load assignment
      </Alert>
    );

  return (
    <Card shadow="sm" withBorder p="lg">
      <Stack>
        <Title order={3}>{assignment.material_detail_name}</Title>
        <Text c="dimmed">{assignment.material_detail_description}</Text>

        <Button
          onClick={() => markComplete(enrollmentId, assignment.material_detail_id)}
          disabled={assignment.is_completed}
        >
          {assignment.is_completed ? "Completed" : "Mark as Complete"}
        </Button>
      </Stack>
    </Card>
  );
}
