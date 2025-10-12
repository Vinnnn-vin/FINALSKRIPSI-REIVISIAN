// src\app\frontend\dashboard\lecturer\components\dashboard\CreateCourseModal.tsx
/* eslint-disable react/no-unescaped-entities */
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
  NumberInput,
  FileInput,
  Button,
  Group,
  LoadingOverlay,
  Paper,
  Text,
  ThemeIcon,
  Box,
  Stepper,
  Progress,
  Alert,
  Divider
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
  IconCurrencyDollar
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
  const [activeStep, setActiveStep] = useState(0);

  const form = useForm({
    initialValues: {
      course_title: "",
      course_description: "",
      course_level: "beginner",
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

  // Calculate form completion progress
  const calculateProgress = () => {
    const fields = ['course_title', 'course_description', 'category_id'];
    const completed = fields.filter(field => 
      form.values[field as keyof typeof form.values]
    ).length;
    return Math.round((completed / fields.length) * 100);
  };

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
            message: "Silakan coba muat ulang halaman.",
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
      form.reset();
      setActiveStep(0);
      onClose();
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

  const nextStep = () => setActiveStep((current) => (current < 2 ? current + 1 : current));
  const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current));

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group>
          <ThemeIcon size="lg" radius="xl" style={{ 
            background: "linear-gradient(45deg, #667eea, #764ba2)" 
          }}>
            <IconSparkles size={20} color="white" />
          </ThemeIcon>
          <div>
            <Text size="lg" fw={600}>Buat Kursus Baru</Text>
            <Text size="sm" c="dimmed">Berbagi pengetahuan Anda dengan dunia</Text>
          </div>
        </Group>
      }
      centered
      size="xl"
      radius="xl"
      closeOnClickOutside={false}
      styles={{
        header: { padding: "24px" },
        body: { padding: "0 24px 24px 24px" }
      }}
    >
      <Box>
        {/* Progress Bar */}
        <Paper p="md" mb="xl" radius="xl" style={{ 
          background: "linear-gradient(135deg, #f8f9ff, #f0f4ff)" 
        }}>
          <Group justify="space-between" mb="xs">
            <Text size="sm" fw={500}>Progress Pengisian</Text>
            <Text size="sm" fw={600} c="blue">{calculateProgress()}%</Text>
          </Group>
          <Progress value={calculateProgress()} radius="xl" size="sm" />
        </Paper>

        {/* Stepper */}
        <Stepper active={activeStep} onStepClick={setActiveStep} mb="xl" radius="xl">
          <Stepper.Step 
            label="Informasi Dasar" 
            description="Judul dan deskripsi"
            icon={<IconBook size={18} />}
          >
            <Stack gap="lg" mt="xl">
              <Alert 
                icon={<IconInfoCircle size={16} />} 
                title="Tips Membuat Judul Menarik"
                color="blue" 
                variant="light"
                radius="xl"
              >
                Gunakan kata kunci yang jelas dan spesifik. Contoh: "Masterclass React.js untuk Pemula" 
                lebih baik dari "Belajar Programming"
              </Alert>

              <TextInput
                label="Judul Kursus"
                placeholder="Contoh: Masterclass Next.js - Dari Dasar hingga Deployment"
                required
                size="md"
                radius="xl"
                styles={{
                  input: {
                    border: "2px solid #e9ecef",
                    "&:focus": { borderColor: "#667eea" }
                  }
                }}
                {...form.getInputProps("course_title")}
              />

              <Textarea
                label="Deskripsi Kursus"
                placeholder="Jelaskan secara detail tentang kursus ini, siapa target audiensnya, dan apa saja yang akan dipelajari siswa..."
                required
                minRows={4}
                size="md"
                radius="xl"
                styles={{
                  input: {
                    border: "2px solid #e9ecef",
                    "&:focus": { borderColor: "#667eea" }
                  }
                }}
                {...form.getInputProps("course_description")}
              />
            </Stack>
          </Stepper.Step>

          <Stepper.Step 
            label="Pengaturan Kursus" 
            description="Level, kategori, dan harga"
            icon={<IconSettings size={18} />}
          >
            <Stack gap="lg" mt="xl">
              <Group grow>
                <Select
                  label="Level Kursus"
                  data={[
                    { value: "beginner", label: "Beginner - Untuk pemula" },
                    { value: "intermediate", label: "Intermediate - Sudah ada dasar" },
                    { value: "advanced", label: "Advanced - Tingkat lanjut" }
                  ]}
                  required
                  size="md"
                  radius="xl"
                  styles={{
                    input: {
                      border: "2px solid #e9ecef",
                      "&:focus": { borderColor: "#667eea" }
                    }
                  }}
                  {...form.getInputProps("course_level")}
                />

                <Select
                  label="Kategori Kursus"
                  placeholder="Pilih kategori yang sesuai"
                  data={categories}
                  required
                  searchable
                  size="md"
                  radius="xl"
                  nothingFoundMessage="Kategori tidak ditemukan..."
                  styles={{
                    input: {
                      border: "2px solid #e9ecef",
                      "&:focus": { borderColor: "#667eea" }
                    }
                  }}
                  {...form.getInputProps("category_id")}
                />
              </Group>

              <Paper p="lg" radius="xl" style={{ 
                background: "linear-gradient(135deg, #fff7ed, #fef3c7)" 
              }}>
                <Group mb="md">
                  <ThemeIcon color="yellow" variant="light" size="sm" radius="xl">
                    <IconCurrencyDollar size={14} />
                  </ThemeIcon>
                  <Text fw={500}>Penetapan Harga</Text>
                </Group>
                {/* <NumberInput
                  label="Harga Kursus (Rupiah)"
                  placeholder="Masukkan 0 untuk kursus gratis"
                  min={0}
                  step={50000}
                  required
                  size="md"
                  radius="xl"
                  styles={{
                    input: {
                      border: "2px solid #fbbf24",
                      "&:focus": { borderColor: "#f59e0b" }
                    }
                  }}
                  {...form.getInputProps("course_price")}
                /> */}
                <Text size="xs" c="dimmed" mt="xs">
                  Tip: Kursus gratis mendapat lebih banyak siswa, tapi kursus berbayar menunjukkan value
                </Text>
              </Paper>
            </Stack>
          </Stepper.Step>

          <Stepper.Step 
            label="Media & Publikasi" 
            description="Thumbnail dan final"
            icon={<IconPhoto size={18} />}
          >
            <Stack gap="lg" mt="xl">
              <Paper p="lg" radius="xl" style={{ 
                background: "linear-gradient(135deg, #f3e8ff, #ede9fe)" 
              }}>
                <Group mb="md">
                  <ThemeIcon color="violet" variant="light" size="sm" radius="xl">
                    <IconPhoto size={14} />
                  </ThemeIcon>
                  <Text fw={500}>Thumbnail Kursus</Text>
                </Group>
                <FileInput
                  placeholder="Pilih gambar thumbnail..."
                  accept="image/png,image/jpeg"
                  leftSection={<IconUpload size={16} />}
                  size="md"
                  radius="xl"
                  styles={{
                    input: {
                      border: "2px dashed #a855f7",
                      "&:focus": { borderColor: "#9333ea" }
                    }
                  }}
                  {...form.getInputProps("thumbnail")}
                />
                <Text size="xs" c="dimmed" mt="xs">
                  Ukuran optimal: 1280x720px. Format: JPG atau PNG. Maksimal 5MB.
                </Text>
              </Paper>

              <Alert 
                icon={<IconCheck size={16} />}
                title="Siap untuk Publikasi!" 
                color="green" 
                variant="light"
                radius="xl"
              >
                Kursus akan dibuat dalam status "Draft". Anda dapat mengeditnya kapan saja 
                dan mempublikasikannya setelah menambahkan materi pembelajaran.
              </Alert>
            </Stack>
          </Stepper.Step>
        </Stepper>

        <Divider my="xl" />

        {/* Navigation Buttons */}
        <Group justify="space-between">
          <Button 
            variant="default" 
            onClick={prevStep}
            disabled={activeStep === 0}
            radius="xl"
            size="md"
          >
            Sebelumnya
          </Button>

          <Group>
            <Button 
              variant="default" 
              onClick={onClose} 
              disabled={isSubmitting}
              radius="xl"
              size="md"
            >
              Batal
            </Button>
            
            {activeStep === 2 ? (
              <Button 
                onClick={() => form.onSubmit(handleSubmit)()} 
                loading={isSubmitting}
                leftSection={<IconSparkles size={16} />}
                size="md"
                radius="xl"
                style={{
                  background: "linear-gradient(45deg, #667eea, #764ba2)"
                }}
              >
                Buat Kursus
              </Button>
            ) : (
              <Button 
                onClick={nextStep}
                size="md"
                radius="xl"
                style={{
                  background: "linear-gradient(45deg, #667eea, #764ba2)"
                }}
              >
                Selanjutnya
              </Button>
            )}
          </Group>
        </Group>

        <LoadingOverlay
          visible={isSubmitting}
          zIndex={1000}
          overlayProps={{ radius: "xl", blur: 2 }}
          loaderProps={{ color: "blue", type: "bars" }}
        />
      </Box>
    </Modal>
  );
}
