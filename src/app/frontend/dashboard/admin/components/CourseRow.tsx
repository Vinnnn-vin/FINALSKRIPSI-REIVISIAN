// src\app\frontend\dashboard\admin\components\CourseRow.tsx
"use client";

import { Table, Badge, Group, ActionIcon, Tooltip, Text } from "@mantine/core";
import { IconCheck, IconX, IconEdit, IconTrash } from "@tabler/icons-react";
import { Course } from "../types/dashboard";
import { getInstructorName, getCategoryName } from "../utils/helpers";

interface Props {
  course: Course;
  handleCourseStatusToggle: (id: number, status: number) => void;
  handleCourseEdit: (course: Course) => void;
  setCourseToDelete: (c: Course | null) => void;
}

const CourseRow = ({
  course,
  handleCourseStatusToggle,
  handleCourseEdit,
  setCourseToDelete,
}: Props) => {
  return (
    <Table.Tr key={course.course_id}>
      <Table.Td>
        <Text fw={500}>{course.course_title}</Text>
      </Table.Td>
      <Table.Td>{getInstructorName(course)}</Table.Td>
      <Table.Td>{getCategoryName(course)}</Table.Td>
      <Table.Td>{course.course_level}</Table.Td>
      <Table.Td>
        {course.course_price > 0
          ? `Rp ${course.course_price.toLocaleString("id-ID")}`
          : "Gratis"}
      </Table.Td>
      <Table.Td>
        <Badge color={course.publish_status === 1 ? "green" : "orange"}>
          {course.publish_status === 1 ? "Published" : "Draft"}
        </Badge>
      </Table.Td>
      <Table.Td>
        <Group gap="xs">
          <Tooltip
            label={
              course.publish_status === 1
                ? "Unpublish (jadikan Draft)"
                : "Publish Course"
            }
            withArrow
          >
            <ActionIcon
              color={course.publish_status === 1 ? "red" : "green"}
              variant="light"
              radius="md"
              onClick={() =>
                handleCourseStatusToggle(
                  course.course_id,
                  course.publish_status
                )
              }
            >
              {course.publish_status === 1 ? (
                <IconX size={16} />
              ) : (
                <IconCheck size={16} />
              )}
            </ActionIcon>
          </Tooltip>

          {/* [!] Tombol Edit */}
          <Tooltip label="Edit Course Details" withArrow>
            <ActionIcon
              color="blue"
              variant="light"
              radius="md"
              onClick={() => handleCourseEdit(course)}
            >
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>

          <Tooltip label="Delete Course" withArrow>
            <ActionIcon
              color="red"
              variant="light"
              radius="md"
              onClick={() => setCourseToDelete(course)}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Table.Td>
    </Table.Tr>
  );
};

export default CourseRow;
