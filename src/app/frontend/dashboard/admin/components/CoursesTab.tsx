// src\app\frontend\dashboard\admin\components\CoursesTab.tsx
"use client";

import { useState, useMemo } from "react";
import {
  Card,
  Table,
  TextInput,
  Select,
  Group,
  Button,
  Pagination,
  Text,
  Accordion,
  Badge,
  SegmentedControl,
} from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import { Course } from "../types/dashboard";
import CourseRow from "./CourseRow";
import { getInstructorName, getCategoryName } from "../utils/helpers";

interface Props {
  courses: Course[];
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filterStatus: string | null;
  setFilterStatus: (v: string | null) => void;
  currentPage: number;
  setCurrentPage: (v: number) => void;
  itemsPerPage: number;
  handleCourseStatusToggle: (id: number, status: number) => void;
  handleCourseEdit: (course: Course) => void;
  setSelectedCourse: (c: Course | null) => void;
  setCourseToDelete: (c: Course | null) => void;
}

const CoursesTab = ({
  courses,
  searchTerm,
  setSearchTerm,
  filterStatus,
  setFilterStatus,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  handleCourseStatusToggle,
  handleCourseEdit,
  setSelectedCourse,
  setCourseToDelete,
}: Props) => {
  // [!] State baru untuk mode grouping
  const [groupBy, setGroupBy] = useState('none'); // 'none', 'category', 'lecturer'

  // Logika filter data (tetap sama)
  const filteredCourses = useMemo(() => courses.filter((c) => {
    const matchSearch = c.course_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus !== null ? String(c.publish_status) === filterStatus : true;
    return matchSearch && matchStatus;
  }), [courses, searchTerm, filterStatus]);

  // [!] Logika untuk mengelompokkan data
  const groupedData = useMemo(() => {
    if (groupBy === 'none') {
      return null;
    }
    return filteredCourses.reduce((acc, course) => {
      const key = groupBy === 'category' ? getCategoryName(course) : getInstructorName(course);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(course);
      return acc;
    }, {} as Record<string, Course[]>);
  }, [filteredCourses, groupBy]);

  // Logika pagination untuk mode 'none'
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(filteredCourses.length / itemsPerPage);

  const renderTableContent = (courseList: Course[]) => (
    <Table.Tbody>
      {courseList.length === 0 ? (
        <Table.Tr>
          <Table.Td colSpan={7}>
            <Text ta="center" c="dimmed">No courses found for this group.</Text>
          </Table.Td>
        </Table.Tr>
      ) : (
        courseList.map((course) => (
          <CourseRow
            key={course.course_id}
            course={course}
            handleCourseStatusToggle={handleCourseStatusToggle}
            handleCourseEdit={handleCourseEdit}
            setCourseToDelete={setCourseToDelete}
          />
        ))
      )}
    </Table.Tbody>
  );

  return (
    <Card shadow="sm" withBorder radius="md" p="lg" mb="lg">
      <Group justify="space-between" mb="md">
        <Group>
          <TextInput
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
          />
          <Select
            placeholder="Filter by status"
            value={filterStatus}
            onChange={setFilterStatus}
            data={[{ value: "1", label: "Published" }, { value: "0", label: "Unpublished" }]}
            clearable
          />
        </Group>
        <Button
          leftSection={<IconPlus size={16} />}
          color="blue"
          radius="md"
          onClick={() => setSelectedCourse({} as Course)} // Membuka modal create
        >
          Create Course
        </Button>
      </Group>

      {/* [!] Kontrol untuk memilih mode grouping */}
      <Group mb="md">
        <Text size="sm" fw={500}>Group By:</Text>
        <SegmentedControl
          value={groupBy}
          onChange={setGroupBy}
          data={[
            { label: 'None', value: 'none' },
            { label: 'Category', value: 'category' },
            { label: 'Lecturer', value: 'lecturer' },
          ]}
        />
      </Group>

      {/* [!] Tampilan kondisional: Akordeon atau Tabel Biasa */}
      {groupBy === 'none' ? (
        <>
          <Table striped highlightOnHover withTableBorder withColumnBorders>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Title</Table.Th>
                <Table.Th>Instructor</Table.Th>
                <Table.Th>Category</Table.Th>
                <Table.Th>Level</Table.Th>
                <Table.Th>Price</Table.Th>
                <Table.Th>Status</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            {renderTableContent(paginatedCourses)}
          </Table>
          {totalPages > 1 && (
            <Group justify="center" mt="md">
              <Pagination value={currentPage} onChange={setCurrentPage} total={totalPages} radius="md" />
            </Group>
          )}
        </>
      ) : (
        <Accordion variant="separated">
          {groupedData && Object.entries(groupedData).map(([groupName, groupCourses]) => (
            <Accordion.Item key={groupName} value={groupName}>
              <Accordion.Control>
                <Group>
                  <Text fw={500}>{groupName}</Text>
                  <Badge>{groupCourses.length} courses</Badge>
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                <Table striped highlightOnHover withTableBorder withColumnBorders>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>Title</Table.Th>
                      <Table.Th>Instructor</Table.Th>
                      <Table.Th>Category</Table.Th>
                      <Table.Th>Level</Table.Th>
                      <Table.Th>Price</Table.Th>
                      <Table.Th>Status</Table.Th>
                      <Table.Th>Actions</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  {renderTableContent(groupCourses)}
                </Table>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
      )}
    </Card>
  );
};

export default CoursesTab;