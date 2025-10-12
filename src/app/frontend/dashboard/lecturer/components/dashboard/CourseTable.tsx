// src\app\frontend\dashboard\lecturer\components\dashboard\CourseTable.tsx

import {
  Card,
  Group,
  Title,
  Text,
  Table,
  Center,
  Stack,
  Button,
  Box,
  Badge,
  Tabs,
  TextInput,
  ActionIcon,
  Flex,
  ThemeIcon
} from "@mantine/core";
import { IconBook, IconPlus, IconSearch, IconFilter, IconSortDescending } from "@tabler/icons-react";
import { CourseType } from "../../types/course";
import CourseRow from "./CourseRow";
import { useDisclosure } from "@mantine/hooks";
import CreateCourseModal from "./CreateCourseModal";
import { useState } from "react";

interface CourseTableProps {
  courses: CourseType[];
  setCourses: React.Dispatch<React.SetStateAction<CourseType[]>>;
}

export default function CourseTable({ courses, setCourses }: CourseTableProps) {
  const [modalOpened, { open: openModal, close: closeModal }] = useDisclosure(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>("all");

  const handleCourseCreated = (newCourse: CourseType) => {
    setCourses((prevCourses) => [newCourse, ...prevCourses]);
  };

  const handleCourseUpdated = (updatedCourse: CourseType) => {
    setCourses((prevCourses) =>
      prevCourses.map((c) => (c.course_id === updatedCourse.course_id ? updatedCourse : c))
    );
  };

  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.course_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
      (filterStatus === "published" && course.publish_status === 1) ||
      (filterStatus === "draft" && course.publish_status === 0);
    
    return matchesSearch && matchesStatus;
  });

  const publishedCount = courses.filter(c => c.publish_status === 1).length;
  const draftCount = courses.filter(c => c.publish_status === 0).length;

  return (
    <>
      <CreateCourseModal
        opened={modalOpened}
        onClose={closeModal}
        onCourseCreated={handleCourseCreated}
      />
      
      <Card 
        withBorder 
        shadow="lg" 
        radius="xl" 
        padding="xl"
        style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
          backdropFilter: "blur(10px)"
        }}
      >
        {/* Header */}
        <Group justify="space-between" mb="xl">
          <div>
            <Title order={2} mb={4} style={{ 
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent"
            }}>
              Manajemen Kursus
            </Title>
            <Text c="dimmed">Kelola semua kursus Anda dalam satu tempat</Text>
          </div>
          <Button 
            onClick={openModal} 
            leftSection={<IconPlus size={18} />}
            size="md"
            radius="xl"
            style={{
              background: "linear-gradient(45deg, #667eea, #764ba2)",
              border: "none"
            }}
            styles={{
              root: {
                "&:hover": {
                  background: "linear-gradient(45deg, #5a67d8, #6b46c1)",
                  transform: "translateY(-2px)"
                }
              }
            }}
          >
            Buat Kursus Baru
          </Button>
        </Group>

        {/* Search and Filter */}
        <Box mb="xl">
          <Flex gap="md" align="center" mb="md">
            <TextInput
              placeholder="Cari kursus..."
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ flex: 1 }}
              radius="xl"
            />
            <ActionIcon size="lg" variant="light" radius="xl">
              <IconFilter size={16} />
            </ActionIcon>
            <ActionIcon size="lg" variant="light" radius="xl">
              <IconSortDescending size={16} />
            </ActionIcon>
          </Flex>

          <Tabs value={filterStatus} onChange={setFilterStatus} radius="xl">
            <Tabs.List>
              <Tabs.Tab value="all">
                Semua ({courses.length})
              </Tabs.Tab>
              <Tabs.Tab value="published">
                <Badge color="green" size="xs" mr={8}>●</Badge>
                Published ({publishedCount})
              </Tabs.Tab>
              <Tabs.Tab value="draft">
                <Badge color="gray" size="xs" mr={8}>●</Badge>
                Draft ({draftCount})
              </Tabs.Tab>
            </Tabs.List>
          </Tabs>
        </Box>

        {/* Content */}
        {filteredCourses.length === 0 ? (
          <Center py={60}>
            <Stack align="center" gap="lg">
              <ThemeIcon size={80} radius="50%" variant="light" color="blue">
                <IconBook size={40} />
              </ThemeIcon>
              <Stack align="center" gap="xs">
                <Text size="lg" fw={600} c="dimmed">
                  {courses.length === 0 ? "Belum Ada Kursus" : "Tidak Ada Hasil"}
                </Text>
                <Text c="dimmed" ta="center" size="sm">
                  {courses.length === 0 
                    ? "Mulai berbagi pengetahuan Anda dengan membuat kursus pertama"
                    : "Coba ubah kata kunci pencarian atau filter"
                  }
                </Text>
              </Stack>
              <Button 
                onClick={openModal} 
                leftSection={<IconPlus size={16} />}
                variant="light"
                size="lg"
                radius="xl"
              >
                {courses.length === 0 ? "Buat Kursus Pertama" : "Buat Kursus Baru"}
              </Button>
            </Stack>
          </Center>
        ) : (
          <Table.ScrollContainer minWidth={1000} type="native">
            <Table 
              highlightOnHover 
              verticalSpacing="md"
              horizontalSpacing="lg"
              styles={{
                th: {
                  fontWeight: 600,
                  fontSize: "14px",
                  color: "#495057",
                  borderBottom: "2px solid #e9ecef"
                }
              }}
            >
              <Table.Thead>
                <Table.Tr>
                  <Table.Th>Kursus</Table.Th>
                  <Table.Th>Level</Table.Th>
                  <Table.Th>Siswa</Table.Th>
                  <Table.Th>Harga</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Aksi</Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filteredCourses.map((course) => (
                  <CourseRow
                    key={course.course_id}
                    course={course}
                    setCourses={setCourses}
                    onCourseUpdated={handleCourseUpdated}
                  />
                ))}
              </Table.Tbody>
            </Table>
          </Table.ScrollContainer>
        )}
      </Card>
    </>
  );
}