/* eslint-disable react-hooks/exhaustive-deps */
// src\app\frontend\dashboard\lecturer\components\dashboard\EditCourseModal.tsx
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
"use client";

import { useState, useEffect } from "react";
import {
  Modal,
  Stack,
  TextInput,
  Textarea,
  Select,
  NumberInput,
  FileInput,
  Button,
  Group,
  LoadingOverlay,
  Image,
  Text,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconUpload, IconCheck } from "@tabler/icons-react";
import { CategoryOptionType } from "../../types/lecturer";
import { CourseType } from "../../types/course";

interface EditCourseModalProps {
  opened: boolean;
  onClose: () => void;
  course: CourseType | null;
  onCourseUpdated: (updatedCourse: CourseType) => void;
}

export default function EditCourseModal({
  opened,
  onClose,
  course,
  onCourseUpdated,
}: EditCourseModalProps) {
  const [categories, setCategories] = useState<CategoryOptionType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    initialValues: {
      course_title: "",
      course_description: "",
      course_level: "Beginner",
      category_id: "",
      course_price: 0,
      thumbnail: null as File | null,
    },
    validate: {
      course_title: (value) =>
        value.trim().length < 5 ? "Judul kursus minimal 5 karakter" : null,
      course_description: (value) =>
        value.trim().length < 20 ? "Deskripsi minimal 20 karakter" : null,
      category_id: (value) => (value ? null : "Kategori harus dipilih"),
      course_price: (value) => (value < 0 ? "Harga tidak boleh negatif" : null),
    },
  });

  // Pre-fill form with course data when the modal opens or course changes
  useEffect(() => {
    if (course) {
      form.setValues({
        course_title: course.course_title,
        course_description: course.course_description,
        course_level: course.course_level,
        category_id: String(course.category_id),
        course_price: course.course_price,
        thumbnail: null, // Reset file input
      });
    }
  }, [course]);

  // Fetch categories when the modal opens
  useEffect(() => {
    if (opened && categories.length === 0) {
      const fetchCategories = async () => {
        try {
          const response = await fetch("/api/dashboard/lecturer/categories");
          if (!response.ok) throw new Error("Gagal memuat daftar kategori");
          const data = await response.json();
          setCategories(data);
        } catch (error) {
          notifications.show({
            title: "Gagal Memuat Kategori",
            message: "Silakan tutup dan buka lagi modal ini.",
            color: "orange",
          });
        }
      };
      fetchCategories();
    }
  }, [opened, categories.length]);

  const handleSubmit = async (values: typeof form.values) => {
    if (!course) return;
    setIsSubmitting(true);

    const formData = new FormData();
    // Append all fields, converting numbers to string
    formData.append("course_title", values.course_title);
    formData.append("course_description", values.course_description);
    formData.append("course_level", values.course_level);
    formData.append("category_id", values.category_id);
    formData.append("course_price", String(values.course_price));
    if (values.thumbnail) {
      formData.append("thumbnail", values.thumbnail);
    }

    try {
      // Menggunakan method PUT untuk update
      const response = await fetch(
        `/api/dashboard/lecturer/courses/${course.course_id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || "Gagal memperbarui kursus");
      }

      notifications.show({
        title: "Berhasil!",
        message: "Perubahan kursus telah disimpan.",
        color: "green",
        icon: <IconCheck size={16} />,
      });

      onCourseUpdated(result.course); // Kirim data terbaru ke parent
      onClose(); // Tutup modal
    } catch (error: any) {
      notifications.show({
        title: "Gagal",
        message: error.message,
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Edit Kursus"
      centered
      size="lg"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <LoadingOverlay visible={isSubmitting} />
        <Stack>
          <TextInput
            label="Judul Kursus"
            required
            {...form.getInputProps("course_title")}
          />
          <Textarea
            label="Deskripsi Kursus"
            required
            minRows={3}
            {...form.getInputProps("course_description")}
          />
          <Group grow>
            <Select
              label="Level Kursus"
              data={["Beginner", "Intermediate", "Advanced"]}
              required
              {...form.getInputProps("course_level")}
            />
            <Select
              label="Kategori Kursus"
              data={categories}
              required
              searchable
              {...form.getInputProps("category_id")}
            />
          </Group>
          {course?.thumbnail_url && (
            <div>
              <Text size="sm" fw={500}>
                Thumbnail Saat Ini
              </Text>
              <Image
                src={course.thumbnail_url}
                w={120}
                h="auto"
                mt="xs"
                radius="sm"
              />
            </div>
          )}
          <FileInput
            label="Ganti Thumbnail (Opsional)"
            accept="image/png,image/jpeg"
            leftSection={<IconUpload size={14} />}
            {...form.getInputProps("thumbnail")}
          />

          <Group justify="flex-end" mt="md">
            <Button variant="default" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">Simpan Perubahan</Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}
