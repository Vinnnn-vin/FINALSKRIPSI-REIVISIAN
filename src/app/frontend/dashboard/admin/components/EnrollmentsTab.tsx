// src\app\frontend\dashboard\admin\components\EnrollmentsTab.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Card,
  Table,
  Group,
  Pagination,
  Text,
  Badge,
} from "@mantine/core";
import { EnrollmentData } from "../types/dashboard";
import { getStatusColor, getUserName, getCategoryName } from "../utils/helpers";

interface Props {
  enrollments: EnrollmentData[];
  currentPage: number;
  setCurrentPage: (v: number) => void;
  itemsPerPage: number;
}

const EnrollmentsTab = ({
  enrollments,
  currentPage,
  setCurrentPage,
  itemsPerPage,
}: Props) => {
  // === Pagination ===
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEnrollments = enrollments.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const totalPages = Math.ceil(enrollments.length / itemsPerPage);

  return (
    <Card shadow="sm" p="lg" radius="md" mb="lg">
      <Table striped highlightOnHover withTableBorder withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Student</Table.Th>
            <Table.Th>Course</Table.Th>
            <Table.Th>Category</Table.Th>
            <Table.Th>Level</Table.Th>
            <Table.Th>Status</Table.Th>
            <Table.Th>Enrolled At</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {paginatedEnrollments.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={6}>
                <Text ta="center" c="dimmed">
                  No enrollments found
                </Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            paginatedEnrollments.map((enrollment) => (
              <Table.Tr key={enrollment.enrollment_id}>
                <Table.Td>{getUserName(enrollment.student || enrollment.User)}</Table.Td>
                <Table.Td>
                  {enrollment.course?.course_title ||
                    enrollment.Course?.course_title}
                </Table.Td>
                <Table.Td>
                  {getCategoryName(
                    enrollment.course || (enrollment.Course as any)
                  )}
                </Table.Td>
                <Table.Td>
                  {enrollment.course?.course_level ||
                    enrollment.Course?.course_level}
                </Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(enrollment.status)}>
                    {enrollment.status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  {new Date(enrollment.created_at).toLocaleDateString()}
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      {totalPages > 1 && (
        <Group justify="center" mt="md">
          <Pagination
            value={currentPage}
            onChange={setCurrentPage}
            total={totalPages}
          />
        </Group>
      )}
    </Card>
  );
};

export default EnrollmentsTab;
