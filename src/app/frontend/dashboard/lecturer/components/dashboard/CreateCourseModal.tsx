// src\app\frontend\dashboard\lecturer\components\dashboard\CreateCourseModal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Stack,
  TextInput,
  Textarea,
  Select,
  Button,
  Group,
  LoadingOverlay,
  Text,
  ThemeIcon,
  Box,
  Tabs,
  Alert,
  Tooltip,
  FileInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import {
  IconUpload,
  IconCheck,
  IconInfoCircle,
  IconBook,
  IconSettings,
  IconPhoto,
  IconSparkles,
  IconAlertCircle,
} from "@tabler/icons-react";

import { CategoryOptionType } from "../../types/lecturer";
import { CourseType } from "../../types/course";

interface CreateCourseModalProps {
  opened: boolean;
  onClose: () => void;
  onCourseCreated: (newCourse: CourseType) => void;
}

export default function CreateCourseModal({
  opened,
  onClose,
  onCourseCreated,
}: CreateCourseModalProps) {
  const [categories, setCategories] = useState<CategoryOptionType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>("info");

  const form = useForm({
    initialValues: {
      course_title: "",
      course_description: "",
      course_level: "Beginner",
      category_id: "",
      course_price: 0,
      thumbnail: null as File | null,
    },
    validateInputOnBlur: true,
    validate: {
      course_title: (value) =>
        value.trim().length < 5 ? "Judul kursus minimal 5 karakter" : null,
      course_description: (value) =>
        value.trim().length < 20 ? "Deskripsi minimal 20 karakter" : null,
      category_id: (value) => (value ? null : "Kategori harus dipilih"),
    },
  });

  const isTabValid = (tabName: "info" | "settings") => {
    if (tabName === "info") {
      return !form.errors.course_title && !form.errors.course_description;
    }
    if (tabName === "settings") {
      return (
        !form.errors.course_level &&
        !form.errors.category_id &&
        !form.errors.course_price
      );
    }
    return true;
  };

  useEffect(() => {
    if (opened && categories.length === 0) {
      const fetchCategories = async () => {
        try {
          const response = await fetch("/api/dashboard/lecturer/categories");
          if (!response.ok) throw new Error("Gagal memuat kategori");
          const data = await response.json();
          setCategories(data);
        } catch (error) {
          notifications.show({
            title: "Gagal Memuat Kategori",
            message: "Silakan coba lagi.",
            color: "orange",
          });
        }
      };
      fetchCategories();
    }
  }, [opened, categories.length]);

  const handleSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true);
    const formData = new FormData();

    formData.append("course_title", values.course_title);
    formData.append("course_description", values.course_description);
    formData.append("course_level", values.course_level);
    formData.append("category_id", values.category_id);
    formData.append("course_price", String(values.course_price));

    if (values.thumbnail) {
      formData.append("thumbnail", values.thumbnail);
    }

    try {
      const response = await fetch("/api/dashboard/lecturer/courses", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal membuat kursus");
      }

      notifications.show({
        title: "Kursus Berhasil Dibuat!",
        message: `"${result.course.course_title}" telah ditambahkan ke daftar kursus Anda.`,
        color: "green",
        icon: <IconCheck size={16} />,
        autoClose: 5000,
      });

      onCourseCreated(result.course);
      handleClose();
    } catch (error: any) {
      notifications.show({
        title: "Gagal Membuat Kursus",
        message: error.message,
        color: "red",
        autoClose: 7000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    form.reset();
    setActiveTab("info");
    onClose();
  };

  const getTooltipMessage = () => {
    if (form.isValid()) return "";

    const errors = [];
    if (form.errors.course_title) errors.push("Judul");
    if (form.errors.course_description) errors.push("Deskripsi");
    if (form.errors.category_id) errors.push("Kategori");

    if (errors.length === 0) return "Harap lengkapi semua kolom wajib.";
    return `Harap perbaiki: ${errors.join(", ")}`;
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group>
          <ThemeIcon
            size="lg"
            radius="xl"
            gradient={{ from: "indigo", to: "cyan" }}
          >
            <IconSparkles size={20} />
          </ThemeIcon>
          <div>
            <Text size="lg" fw={600}>
              Buat Kursus Baru
            </Text>
            <Text size="sm" c="dimmed">
              Isi detail kursus Anda di bawah ini
            </Text>
          </div>
        </Group>
      }
      centered
      size="xl"
      radius="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <LoadingOverlay visible={isSubmitting} />

        <Tabs
          value={activeTab}
          onChange={setActiveTab}
          radius="md"
          variant="pills"
        >
          <Tabs.List grow>
            <Tabs.Tab
              value="info"
              leftSection={<IconBook size={16} />}
              rightSection={
                !isTabValid("info") && <IconAlertCircle size={16} color="red" />
              }
            >
              Informasi Dasar
            </Tabs.Tab>
            <Tabs.Tab
              value="settings"
              leftSection={<IconSettings size={16} />}
              rightSection={
                !isTabValid("settings") && (
                  <IconAlertCircle size={16} color="red" />
                )
              }
            >
              Pengaturan
            </Tabs.Tab>
            <Tabs.Tab value="media" leftSection={<IconPhoto size={16} />}>
              Media
            </Tabs.Tab>
          </Tabs.List>

          <Box pt="xl">
            <Tabs.Panel value="info">
              <Stack gap="lg">
                <Alert
                  icon={<IconInfoCircle size={16} />}
                  title="Tips"
                  color="blue"
                  variant="light"
                  radius="md"
                >
                  Gunakan judul yang jelas dan deskripsi yang menarik untuk
                  menarik minat siswa.
                </Alert>
                <TextInput
                  label="Judul Kursus"
                  placeholder="Contoh: Masterclass Next.js - Dari Dasar hingga Deployment"
                  required
                  size="md"
                  radius="md"
                  {...form.getInputProps("course_title")}
                />
                <Textarea
                  label="Deskripsi Kursus"
                  placeholder="Jelaskan secara detail tentang kursus ini..."
                  required
                  minRows={5}
                  size="md"
                  radius="md"
                  {...form.getInputProps("course_description")}
                />
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="settings">
              <Stack gap="lg">
                <Group grow>
                  <Select
                    label="Level Kursus"
                    data={["Beginner", "Intermediate", "Advanced"]}
                    required
                    size="md"
                    radius="md"
                    {...form.getInputProps("course_level")}
                  />
                  <Select
                    label="Kategori Kursus"
                    data={categories}
                    required
                    searchable
                    size="md"
                    radius="md"
                    {...form.getInputProps("category_id")}
                  />
                </Group>
              </Stack>
            </Tabs.Panel>

            <Tabs.Panel value="media">
              <Stack gap="lg">
                <FileInput
                  label="Thumbnail Kursus"
                  description="Ukuran optimal: 1280x720px. Format: JPG atau PNG."
                  placeholder="Pilih gambar thumbnail..."
                  accept="image/png,image/jpeg"
                  leftSection={<IconUpload size={16} />}
                  size="md"
                  radius="md"
                  {...form.getInputProps("thumbnail")}
                />
              </Stack>
            </Tabs.Panel>
          </Box>
        </Tabs>

        <Group
          justify="flex-end"
          mt="xl"
          pt="md"
          style={{ borderTop: "1px solid #e9ecef" }}
        >
          <Button variant="default" onClick={handleClose} radius="md" size="md">
            Batal
          </Button>
          <Tooltip
            label={getTooltipMessage()}
            position="top"
            withArrow
            disabled={form.isValid()}
          >
            <Box>
              <Button
                type="submit"
                loading={isSubmitting}
                size="md"
                radius="md"
                disabled={!form.isValid()}
              >
                Buat Kursus
              </Button>
            </Box>
          </Tooltip>
        </Group>
      </form>
    </Modal>
  );
}
