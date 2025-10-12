// src\app\frontend\dashboard\lecturer\components\dashboard\CourseRow.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Table,
  Group,
  Text,
  Badge,
  ActionIcon,
  Box,
  Image,
  Modal,
  Button,
  Stack,
  Tooltip,
  Menu,
  ThemeIcon,
  NumberFormatter
} from "@mantine/core";
import {
  IconPhoto,
  IconCheck,
  IconX,
  IconPlaylistAdd,
  IconBookmark,
  IconEdit,
  IconTrash,
  IconDots,
  IconEye,
  IconUsers,
  IconCurrencyDollar,
  IconTrendingUp
} from "@tabler/icons-react";
import Link from "next/link";
import { notifications } from "@mantine/notifications";
import { CourseType } from "../../types/course";
import { useDisclosure } from "@mantine/hooks";
import { useState } from "react";
import EditCourseModal from "./EditCourseModal";

interface CourseRowProps {
  course: CourseType;
  setCourses: React.Dispatch<React.SetStateAction<CourseType[]>>;
  onCourseUpdated: (updatedCourse: CourseType) => void;
}

export default function CourseRow({ course, setCourses, onCourseUpdated }: CourseRowProps) {
  const [editModalOpened, { open: openEditModal, close: closeEditModal }] = useDisclosure(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Helper functions for consistent display
  const getLevelConfig = (level: string) => {
    switch (level.toLowerCase()) {
      case 'beginner':
        return { label: 'Beginner', color: 'green', icon: '🌱' };
      case 'intermediate': 
        return { label: 'Intermediate', color: 'blue', icon: '📈' };
      case 'advanced':
        return { label: 'Advanced', color: 'orange', icon: '🚀' };
      default:
        return { label: 'Unknown', color: 'gray', icon: '❓' };
    }
  };

  const formatPrice = (price: number) => {
    if (price === 0) {
      return {
        display: "GRATIS",
        color: "green",
        icon: "🎁"
      };
    }
    return {
      display: `Rp ${price.toLocaleString('id-ID')}`,
      color: "blue", 
      icon: "💰"
    };
  };

  const getStatusConfig = (status: number) => {
    if (status === 1) {
      return {
        label: 'PUBLISHED',
        color: 'green',
        variant: 'filled' as const,
        icon: '✅'
      };
    }
    return {
      label: 'DRAFT',
      color: 'gray', 
      variant: 'light' as const,
      icon: '📝'
    };
  };

  const handleTogglePublish = async () => {
    const newStatus = course.publish_status === 1 ? 0 : 1;

    try {
      const response = await fetch(
        `/api/dashboard/lecturer/courses/${course.course_id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ publish_status: newStatus }),
        }
      );

      if (!response.ok) throw new Error("Failed to update course status");

      setCourses((prev) =>
        prev.map((c) =>
          c.course_id === course.course_id
            ? { ...c, publish_status: newStatus }
            : c
        )
      );

      notifications.show({
        title: "Status Berhasil Diubah!",
        message: `Kursus "${course.course_title}" sekarang berstatus ${newStatus === 1 ? 'Published' : 'Draft'}`,
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        title: "Gagal Mengubah Status",
        message: "Terjadi kesalahan saat mengubah status kursus",
        color: "red",
      });
    }
  };

  const handleDeleteCourse = async () => {
    setIsDeleting(true);
    
    try {
      const response = await fetch(
        `/api/dashboard/lecturer/courses/${course.course_id}`,
        { method: "DELETE" }
      );

      if (!response.ok) throw new Error("Gagal menghapus kursus");

      setCourses((prev) => prev.filter((c) => c.course_id !== course.course_id));
      
      notifications.show({
        title: "Kursus Berhasil Dihapus",
        message: `"${course.course_title}" telah dihapus permanen`,
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        title: "Gagal Menghapus",
        message: error.message,
        color: "red",
      });
    } finally {
      setIsDeleting(false);
      closeDeleteModal();
    }
  };

  const levelConfig = getLevelConfig(course.course_level);
  const priceConfig = formatPrice(course.course_price);
  const statusConfig = getStatusConfig(course.publish_status);
  const studentCount = course.student_count || 0;

  return (
    <>
      <EditCourseModal
        opened={editModalOpened}
        onClose={closeEditModal}
        course={course}
        onCourseUpdated={onCourseUpdated}
      />
      
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Konfirmasi Hapus Kursus"
        centered
        size="md"
        radius="xl"
      >
        <Stack gap="lg">
          <Box p="md" style={{ 
            background: "linear-gradient(135deg, #fee2e2, #fef3f3)",
            borderRadius: "12px",
            border: "1px solid #fecaca"
          }}>
            <Text fw={600} mb="xs" c="red.8">
              Menghapus kursus: "{course.course_title}"
            </Text>
            <Group gap="xs" mb="sm">
              <Text size="sm" c="dimmed">Level:</Text>
              <Badge size="xs" color={levelConfig.color}>{levelConfig.label}</Badge>
            </Group>
            <Group gap="xs" mb="sm">
              <Text size="sm" c="dimmed">Siswa terdaftar:</Text>
              <Text size="sm" fw={500}>{studentCount} orang</Text>
            </Group>
            <Group gap="xs">
              <Text size="sm" c="dimmed">Status:</Text>
              <Badge size="xs" color={statusConfig.color}>{statusConfig.label}</Badge>
            </Group>
          </Box>
          
          <Text size="sm" c="red.7" style={{ 
            background: "#fef2f2",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #fecaca"
          }}>
            ⚠️ Tindakan ini tidak dapat dibatalkan. Semua materi, {studentCount} siswa yang terdaftar, dan data terkait akan terpengaruh.
          </Text>
          
          <Group justify="flex-end">
            <Button variant="default" onClick={closeDeleteModal} disabled={isDeleting} radius="xl">
              Batal
            </Button>
            <Button color="red" onClick={handleDeleteCourse} loading={isDeleting} radius="xl">
              Ya, Hapus Kursus
            </Button>
          </Group>
        </Stack>
      </Modal>

      <Table.Tr style={{ 
        borderBottom: "1px solid #e9ecef",
        "&:hover": { backgroundColor: "rgba(0,0,0,0.02)" } 
      }}>
        {/* Course Info */}
        <Table.Td style={{ padding: "16px", minWidth: "300px" }}>
          <Group gap="md" wrap="nowrap" align="flex-start">
            {course.thumbnail_url ? (
              <Image 
                src={course.thumbnail_url} 
                w={70} 
                h={70} 
                radius="lg"
                style={{ border: "2px solid #e9ecef", flexShrink: 0 }}
              />
            ) : (
              <Box 
                w={70} 
                h={70} 
                bg="gray.1" 
                style={{ 
                  borderRadius: "12px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #e9ecef",
                  flexShrink: 0
                }}
              >
                <IconPhoto size={28} color="#adb5bd" />
              </Box>
            )}
            
            <div style={{ flex: 1, minWidth: 0, overflow: "hidden" }}>
              <Text fw={600} size="md" mb={6} title={course.course_title} style={{ 
                overflow: "hidden", 
                textOverflow: "ellipsis", 
                whiteSpace: "nowrap" 
              }}>
                {course.course_title}
              </Text>
              <Text size="sm" c="dimmed" mb={8} lineClamp={2}>
                {course.course_description}
              </Text>
              <Group gap="lg">
                <Group gap={6}>
                  <IconUsers size={14} color="#666" />
                  <Text size="sm" fw={500} c="blue">
                    <NumberFormatter value={studentCount} thousandSeparator="." decimalSeparator="," /> siswa
                  </Text>
                </Group>
                {/* <Group gap={6}>
                  <IconTrendingUp size={14} color="#666" />
                  <Text size="sm" c="dimmed" fw={500}>
                    ID: {course.course_id}
                  </Text>
                </Group> */}
              </Group>
            </div>
          </Group>
        </Table.Td>

        {/* Level - Enhanced Display */}
        <Table.Td style={{ padding: "16px", minWidth: "140px" }}>
          <Stack gap="xs" align="center">
            <Text size="xl">{levelConfig.icon}</Text>
            <Badge 
              variant="light" 
              color={levelConfig.color}
              radius="lg"
              size="lg"
              fw={600}
              style={{ textTransform: 'none', minWidth: "100px", textAlign: "center" }}
            >
              {levelConfig.label}
            </Badge>
            {/* <Text size="xs" c="dimmed" ta="center">
              {course.course_level}
            </Text> */}
          </Stack>
        </Table.Td>

        {/* Students - Enhanced Display */}
        <Table.Td style={{ padding: "16px", minWidth: "140px" }}>
          <Stack gap="xs" align="center">
            <ThemeIcon variant="light" color="blue" size="lg" radius="xl">
              <IconUsers size={18} />
            </ThemeIcon>
            <Text fw={700} size="xl" c="blue.6" ta="center">
              <NumberFormatter value={studentCount} thousandSeparator="." decimalSeparator="," />
            </Text>
            {/* <Text size="xs" c="dimmed" ta="center" fw={500}>
              siswa terdaftar
            </Text> */}
          </Stack>
        </Table.Td>

        {/* Price - Enhanced Display */}
        <Table.Td style={{ padding: "16px", minWidth: "140px" }}>
          <Stack gap="xs" align="center">
            <Text size="xl">{priceConfig.icon}</Text>
            <Text fw={700} size="lg" c={priceConfig.color} ta="center">
              {priceConfig.display}
            </Text>
            {/* {course.course_price > 0 && (
              <Text size="xs" c="dimmed" fw={500} ta="center">
                Berbayar
              </Text>
            )} */}
          </Stack>
        </Table.Td>

        {/* Status - Enhanced Display */}
        <Table.Td style={{ padding: "16px", minWidth: "130px" }}>
          <Stack gap="xs" align="center">
            <Text size="xl">{statusConfig.icon}</Text>
            <Badge 
              color={statusConfig.color}
              variant={statusConfig.variant}
              radius="lg"
              size="lg"
              fw={600}
              style={{ textTransform: 'none', minWidth: "90px", textAlign: "center" }}
            >
              {statusConfig.label}
            </Badge>
            {/* <Text size="xs" c="dimmed" mt={2} fw={500} ta="center">
              {course.publish_status === 1 ? 'Aktif' : 'Non-aktif'}
            </Text> */}
          </Stack>
        </Table.Td>

        {/* Actions */}
        <Table.Td style={{ padding: "16px", minWidth: "120px" }}>
          <Group gap="xs" justify="center" wrap="nowrap">
            {/* <Tooltip label={course.publish_status === 1 ? "Jadikan Draft" : "Publikasikan"}>
              <ActionIcon
                onClick={handleTogglePublish}
                color={course.publish_status === 1 ? "orange" : "green"}
                variant="light"
                size="lg"
                radius="xl"
              >
                {course.publish_status === 1 ? <IconX size={16} /> : <IconCheck size={16} />}
              </ActionIcon>
            </Tooltip> */}

            <Menu position="bottom-end" shadow="lg" radius="xl" width={200}>
              <Menu.Target>
                <ActionIcon variant="light" size="lg" radius="xl">
                  <IconDots size={16} />
                </ActionIcon>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item
                  leftSection={<IconEdit size={14} />}
                  onClick={openEditModal}
                >
                  Edit Kursus
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconPlaylistAdd size={14} />}
                  component={Link}
                  href={`/frontend/dashboard/lecturer/materi?courseId=${course.course_id}`}
                >
                  Tambah Materi
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconBookmark size={14} />}
                  component={Link}
                  href={`/frontend/dashboard/lecturer/materi/${course.course_id}`}
                >
                  Kelola Materi
                </Menu.Item>
                <Menu.Item
                  leftSection={<IconEye size={14} />}
                  component={Link}
                  href={`/frontend/landing/listcourse/${course.course_id}`}
                >
                  Preview Kursus
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  leftSection={<IconTrash size={14} />}
                  color="red"
                  onClick={openDeleteModal}
                >
                  Hapus Kursus
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Table.Td>
      </Table.Tr>
    </>
  );
}