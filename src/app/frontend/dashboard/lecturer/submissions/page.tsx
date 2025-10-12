// src\app\frontend\dashboard\lecturer\submissions\page.tsx
"use client";

import { useState } from "react";
import {
  Container,
  Title,
  Stack,
  Group,
  Select,
  Table,
  Badge,
  ActionIcon,
  Text,
  Center,
  Loader,
  Card,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconDownload, IconEdit } from "@tabler/icons-react";
import { useSubmissions, Submission } from "../hooks/useSubmissions";
import { GradeModal } from "../components/submissions/GradeModal";

export default function SubmissionsPage() {
  const { submissions, loading, filters, setFilters, handleGradeSubmission } =
    useSubmissions();
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [selectedSubmission, setSelectedSubmission] =
    useState<Submission | null>(null);

  const handleOpenGradeModal = (submission: Submission) => {
    setSelectedSubmission(submission);
    openModal();
  };

  const rows = submissions.map((item) => (
    <Table.Tr key={item.submission_id}>
      <Table.Td>
        <Text fw={500}>{item.student.name}</Text>
        <Text size="xs" c="dimmed">
          {item.student.email}
        </Text>
      </Table.Td>
      <Table.Td>{item.course.course_title}</Table.Td>
      <Table.Td>{item.assignment.name}</Table.Td>
      <Table.Td>{new Date(item.submitted_at).toLocaleString()}</Table.Td>
      <Table.Td>
        <Badge
          color={
            item.status === "approved"
              ? "green"
              : item.status === "rejected"
              ? "red"
              : "yellow"
          }
        >
          {item.status}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          {item.file_path && (
            <ActionIcon
              component="a"
              href={item.file_path}
              download
              target="_blank"
              variant="light"
              aria-label="Download"
            >
              <IconDownload size={16} />
            </ActionIcon>
          )}
          <ActionIcon
            variant="light"
            color="blue"
            aria-label="Grade"
            onClick={() => handleOpenGradeModal(item)}
          >
            <IconEdit size={16} />
          </ActionIcon>
        </Group>
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <>
      <GradeModal
        opened={modalOpened}
        onClose={closeModal}
        submission={selectedSubmission}
        onGrade={handleGradeSubmission}
      />

      <Container size="xl" py="lg">
        <Stack gap="lg">
          <Title order={2}>Assignment Submissions</Title>

          {/* Filter Controls */}
          <Group>
            <Select
              label="Filter by Status"
              value={filters.statusFilter}
              onChange={setFilters.setStatusFilter}
              data={[
                { value: "submitted", label: "Submitted (Need Review)" },
                { value: "approved", label: "Approved" },
                { value: "rejected", label: "Rejected" },
              ]}
              clearable
            />
            {/* Anda bisa menambahkan filter by course di sini jika mau */}
          </Group>

          {/* Table */}
          <Card withBorder p={0}>
            <Table.ScrollContainer minWidth={800}>
              <Table verticalSpacing="sm" highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Student</Table.Th>
                    <Table.Th>Course</Table.Th>
                    <Table.Th>Assignment</Table.Th>
                    <Table.Th>Date Submitted</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Actions</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {loading ? (
                    <Table.Tr>
                      <Table.Td colSpan={6}>
                        <Center>
                          <Loader />
                        </Center>
                      </Table.Td>
                    </Table.Tr>
                  ) : rows.length > 0 ? (
                    rows
                  ) : (
                    <Table.Tr>
                      <Table.Td colSpan={6}>
                        <Center>
                          <Text c="dimmed">No submissions found.</Text>
                        </Center>
                      </Table.Td>
                    </Table.Tr>
                  )}
                </Table.Tbody>
              </Table>
            </Table.ScrollContainer>
          </Card>
        </Stack>
      </Container>
    </>
  );
}
