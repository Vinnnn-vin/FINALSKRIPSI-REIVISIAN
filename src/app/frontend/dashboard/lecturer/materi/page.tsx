// src\app\frontend\dashboard\lecturer\materi\page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import {
  Container,
  Title,
  Stack,
  Grid,
  Paper,
  Button,
  Group,
  LoadingOverlay,
  Alert,
  Stepper,
  Text,
  Accordion,
  Center,
  Textarea,
  TextInput,
  Modal,
  Tabs,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { IconCheck } from "@tabler/icons-react";

// Impor komponen-komponen yang sudah Anda buat
import ContentForm from "../components/materi/ContentForm";
import QuizBuilder from "../components/materi/QuizBuilder";
import AssignmentForm from "../components/materi/AssignmentForm";
import BabList from "../components/materi/BabList";
import { useQuizBuilder } from "../hooks/useQuizBuilder";
import type { BabType } from "../types/material";

export default function AddMaterialPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ FIX: Mengambil courseId dari URL query parameter
  const courseId = searchParams.get("courseId");

  // const [activeStep, setActiveStep] = useState(0);
  const [babs, setBabs] = useState<BabType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBabName, setNewBabName] = useState("");
  const [newBabDescription, setNewBabDescription] = useState("");
  const [modalOpened, { open: openModal, close: closeModal }] =
    useDisclosure(false);
  const [editingBabId, setEditingBabId] = useState<string | null>(null);
  const quizBuilder = useQuizBuilder();

  // const nextStep = () => setActiveStep((current) => (current < 2 ? current + 1 : current));
  // const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current));

  const handleAddBab = () => {
    if (!newBabName.trim()) {
      notifications.show({
        title: "Nama Bab Kosong",
        message: "Judul bab tidak boleh kosong.",
        color: "orange",
      });
      return;
    }
    const newBab: BabType = {
      id: `bab-${Date.now()}`,
      name: newBabName,
      description: newBabDescription,
      items: [],
    };
    setBabs((prev) => [...prev, newBab]);
    // Reset form
    setNewBabName("");
    setNewBabDescription("");
  };

  const handleSaveAll = async () => {
    if (!courseId) {
      notifications.show({
        title: "Error Kritis",
        message: "Course ID tidak ditemukan. Tidak bisa menyimpan.",
        color: "red",
      });
      return;
    }
    if (babs.length === 0) {
      notifications.show({
        title: "Tidak Valid",
        message: "Anda harus menambahkan minimal satu bab.",
        color: "orange",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // ✅ FIX: Menggunakan endpoint API yang benar dan menyertakan courseId
      const response = await fetch(
        `/api/dashboard/lecturer/courses/${courseId}/materials`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ babs }), // Payload sudah benar
        }
      );

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Gagal menyimpan materi ke server.");
      }

      notifications.show({
        title: "Sukses!",
        message: "Semua materi baru telah berhasil disimpan.",
        color: "green",
        icon: <IconCheck size={16} />,
      });

      // ✅ FIX: Mengarahkan pengguna ke halaman lihat materi setelah berhasil
      router.push(`/frontend/dashboard/lecturer/materi/${courseId}`);
    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message,
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenContentModal = (babId: string) => {
    setEditingBabId(babId);
    openModal();
  };

  if (!courseId) {
    return (
      <Container p="lg">
        <Alert color="red" title="Course ID Tidak Ditemukan">
          Halaman ini tidak valid. Silakan kembali ke{" "}
          <Link href="/frontend/dashboard/lecturer">dasbor</Link> dan pilih
          kursus.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <LoadingOverlay visible={isSubmitting} />
      <Title order={2} mb="xl">
        Buat Materi Baru
      </Title>

      <Stack gap="xl">
        {/* Header Halaman */}
        <Group justify="space-between">
          <Title order={2}>Curriculum Builder</Title>
          <Button
            onClick={handleSaveAll}
            loading={isSubmitting}
            disabled={babs.length === 0}
            size="sm"
          >
            Simpan Semua Perubahan
          </Button>
        </Group>

        {/* Daftar Bab (Komponen Inti) */}
        <BabList
          babs={babs}
          setBabs={setBabs}
          onOpenContentModal={handleOpenContentModal}
          onRemoveBab={(babId) =>
            setBabs((prev) => prev.filter((b) => b.id !== babId))
          }
          onRemoveContent={(babId, contentId) =>
            setBabs((prev) =>
              prev.map((b) =>
                b.id === babId
                  ? {
                      ...b,
                      items: b.items.filter((item) => item.id !== contentId),
                    }
                  : b
              )
            )
          }
          editingItemId={null}
          inlineFormData={{ name: "", description: "" }}
          setInlineFormData={() => {}}
          onSaveInlineEdit={() => {}}
          onCancelInlineEdit={() => {}}
          onStartInlineEdit={() => {}}
        />

        {/* Form untuk Menambah Bab Baru */}
        <Paper withBorder p="lg" radius="md" mt="xl">
          <Stack>
            <Title order={4}>Tambah Bab Baru</Title>
            <TextInput
              label="Judul Bab"
              placeholder="Contoh: Bab 1 - Pengenalan React"
              value={newBabName}
              onChange={(e) => setNewBabName(e.currentTarget.value)}
              required
            />
            <Textarea
              label="Deskripsi Bab (Opsional)"
              placeholder="Jelaskan singkat isi bab ini..."
              value={newBabDescription}
              onChange={(e) => setNewBabDescription(e.currentTarget.value)}
              minRows={2}
            />
            <Button onClick={handleAddBab} fullWidth>
              + Tambah Bab ke Kurikulum
            </Button>
          </Stack>
        </Paper>
      </Stack>
      <Modal
        opened={modalOpened}
        onClose={closeModal}
        title="Tambah Konten Baru"
        centered
        size="lg"
      >
        <Tabs defaultValue="lesson">
          <Tabs.List>
            <Tabs.Tab value="lesson">Pelajaran</Tabs.Tab>
            <Tabs.Tab value="quiz">Kuis</Tabs.Tab>
            <Tabs.Tab value="assignment">Tugas</Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="lesson" pt="md">
            <ContentForm
              onAddContent={(item) => {
                if (!editingBabId) return;
                setBabs((prev) =>
                  prev.map((b) =>
                    b.id === editingBabId
                      ? { ...b, items: [...b.items, item] }
                      : b
                  )
                );
                closeModal();
              }}
            />
          </Tabs.Panel>

          <Tabs.Panel value="quiz" pt="md">
            <QuizBuilder
              {...quizBuilder}
              onAddQuiz={(item) => {
                if (!editingBabId) return;
                setBabs((prev) =>
                  prev.map((b) =>
                    b.id === editingBabId
                      ? { ...b, items: [...b.items, item] }
                      : b
                  )
                );
                closeModal();
              }}
            />
          </Tabs.Panel>

          <Tabs.Panel value="assignment" pt="md">
            <AssignmentForm
              onAddAssignment={(item) => {
                if (!editingBabId) return;
                setBabs((prev) =>
                  prev.map((b) =>
                    b.id === editingBabId
                      ? { ...b, items: [...b.items, item] }
                      : b
                  )
                );
                closeModal();
              }}
            />
          </Tabs.Panel>
        </Tabs>
      </Modal>
    </Container>
  );
}
