/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Center,
  Loader,
  Alert,
  Breadcrumbs,
  Anchor,
  Modal,
  Tabs,
  Paper,
  TextInput,
  Textarea,
  ActionIcon,
  Box,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconChevronRight,
  IconPlus,
  IconCheck,
  IconEdit,
  IconTrash,
  IconDeviceFloppy,
  IconX,
} from "@tabler/icons-react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ProtectedRoute } from "@/app/frontend/components/auth/ProtectedRoute";
import { useDisclosure } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";

import ContentForm from "../../components/materi/ContentForm";
import QuizBuilder from "../../components/materi/QuizBuilder";
import AssignmentForm from "../../components/materi/AssignmentForm";
import BabList from "../../components/materi/BabList";
import { useQuizBuilder } from "../../hooks/useQuizBuilder";
import {
  BabType,
  ContentItemType,
  MaterialType,
  MaterialDetailType,
  QuizType,
} from "../../types/material";

const ManageMaterialsPage = () => {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;

  const [courseTitle, setCourseTitle] = useState("");
  const [materials, setMaterials] = useState<BabType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newBabName, setNewBabName] = useState("");
  const [newBabDescription, setNewBabDescription] = useState("");
  const [modalOpened, { open: openModal, close: baseCloseModal }] =
    useDisclosure(false);
  const [editingBabId, setEditingBabId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState<ContentItemType | null>(
    null
  );
  const quizBuilder = useQuizBuilder();
  const [activeTabInModal, setActiveTabInModal] = useState<string | null>(
    "lesson"
  );
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [inlineFormData, setInlineFormData] = useState({
    name: "",
    description: "",
  });

  // [FIX] State untuk melacak apakah data berasal dari draf
  const [isDraft, setIsDraft] = useState(false);
  const localStorageKey = `curriculum_draft_${courseId}`;

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(localStorageKey, JSON.stringify(materials));
    }
  }, [materials, isLoading, localStorageKey]);

  const fetchData = useCallback(async () => {
    if (!courseId) return;
    setIsLoading(true);
    const savedDraft = localStorage.getItem(localStorageKey);
    if (savedDraft) {
      try {
        const parsedDraft = JSON.parse(savedDraft);
        if (Array.isArray(parsedDraft) && parsedDraft.length > 0) {
          setMaterials(parsedDraft);
          setIsDraft(true); // Tandai sebagai draf
          const response = await fetch(
            `/api/dashboard/lecturer/materi/${courseId}`
          );
          const data = await response.json();
          setCourseTitle(data.course_title || "Tanpa Judul");
          setIsLoading(false);
          notifications.show({
            title: "Draf Ditemukan",
            message: "Melanjutkan sesi pengerjaan kurikulum.",
            color: "blue",
          });
          return;
        }
      } catch (e) {
        console.error("Gagal memuat draf", e);
      }
    }

    try {
      const response = await fetch(
        `/api/dashboard/lecturer/materi/${courseId}`
      );
      if (!response.ok) throw new Error("Gagal memuat materi.");
      const data = await response.json();
      setCourseTitle(data.course_title || "Tanpa Judul");

      const transformedMaterials = (data.materials || []).map((mat: any) => ({
        id: `bab-${mat.material_id}`,
        name: mat.material_name,
        description: mat.material_description,
        items: [
          ...(mat.details || []).map((detail: any) => ({
            id: `content-${detail.material_detail_id}`,
            type: detail.material_detail_type === 4 ? "assignment" : "lesson",
            name: detail.material_detail_name,
            title: detail.material_detail_name,
            description: detail.material_detail_description,
            instructions: detail.material_detail_description,
            lessonType:
              detail.material_detail_type === 1
                ? "video"
                : detail.material_detail_type === 2
                ? "pdf"
                : "url",
            url: detail.materi_detail_url,
            isFree: detail.is_free,
          })),
          ...(mat.quizzes || []).map((quiz: any) => ({
            id: `quiz-${quiz.quiz_id}`,
            type: "quiz",
            title: quiz.quiz_title,
            name: quiz.quiz_title,
            description: quiz.quiz_description,
            passing_score: quiz.passing_score,
            time_limit: quiz.time_limit,
            max_attempts: quiz.max_attempts,
            questions: (quiz.questions || []).map((q: any) => ({
              id: `question-${q.question_id}`,
              text: q.question_text,
              type: q.type || "multiple_choice",
              options: (q.answerOptions || []).map((opt: any) => ({
                id: `option-${opt.option_id}`,
                text: opt.option_text,
                is_correct: opt.is_correct,
              })),
            })),
          })),
        ],
      }));
      setMaterials(transformedMaterials);
      setIsDraft(false); // Tandai bukan draf karena dari API
      console.log("Quiz data mapped:", JSON.stringify(materials, null, 2));

    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }, [courseId, localStorageKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
    setMaterials((prev) => [...prev, newBab]);
    setIsDraft(true);
    setNewBabName("");
    setNewBabDescription("");
  };

  const handleCloseModal = useCallback(() => {
    baseCloseModal();
    setEditingContent(null);
    setEditingBabId(null);
    setActiveTabInModal("lesson");
  }, [baseCloseModal]);

  const handleOpenContentModal = (babId: string, content?: ContentItemType) => {
    setEditingBabId(babId);

    if (content) {
      setEditingContent(content);

      // otomatis buka tab sesuai tipe konten
      if (content.type === "quiz") {
        setActiveTabInModal("quiz");
      } else if (content.type === "assignment") {
        setActiveTabInModal("assignment");
      } else {
        setActiveTabInModal("lesson");
      }
    } else {
      // jika tambah baru, tetap default ke pelajaran
      setEditingContent(null);
      setActiveTabInModal("lesson");
    }

    openModal();
  };

  const handleAddNewContent = useCallback(
    (newItem: ContentItemType) => {
      setIsDraft(true);
      if (!editingBabId) return;
      setMaterials((prev) =>
        prev.map((b) =>
          b.id === editingBabId ? { ...b, items: [...b.items, newItem] } : b
        )
      );
      handleCloseModal();
    },
    [editingBabId, handleCloseModal]
  );

  const handleUpdateContent = useCallback(
    (updatedItem: ContentItemType) => {
      setIsDraft(true);
      if (!editingBabId) return;
      setMaterials((prevBabs) =>
        prevBabs.map((bab) =>
          bab.id === editingBabId
            ? {
                ...bab,
                items: bab.items.map((item) =>
                  item.id === updatedItem.id ? updatedItem : item
                ),
              }
            : bab
        )
      );
      handleCloseModal();
    },
    [editingBabId, handleCloseModal]
  );

  const handleCreateInitialCurriculum = async () => {
    setIsSubmitting(true);
    notifications.show({
      id: "save-all",
      loading: true,
      title: "Menyimpan...",
      message: "Mengirim data kurikulum ke server.",
      autoClose: false,
      withCloseButton: false,
    });
    try {
      const response = await fetch(
        `/api/dashboard/lecturer/courses/${courseId}/materials`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ babs: materials }),
        }
      );
      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Gagal menyimpan perubahan.");
      }
      localStorage.removeItem(localStorageKey);
      notifications.update({
        id: "save-all",
        color: "green",
        title: "Sukses!",
        message: "Kurikulum berhasil disimpan.",
        icon: <IconCheck size={16} />,
        autoClose: 3000,
      });
      router.refresh();
    } catch (error: any) {
      notifications.update({
        id: "save-all",
        color: "red",
        title: "Error",
        message: error.message,
        icon: <IconAlertCircle size={16} />,
        autoClose: 5000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleStartInlineEdit = (item: BabType | ContentItemType) => {
    setEditingItemId(item.id);
    setInlineFormData({
      name: item.name || (item as ContentItemType).title || "",
      description:
        item.description || (item as ContentItemType).instructions || "",
    });
  };

  const handleCancelInlineEdit = () => {
    setEditingItemId(null);
    setInlineFormData({ name: "", description: "" });
  };

  const handleSaveInlineEdit = async () => {
    setIsDraft(true);
    if (!editingItemId) return;
    const isBab = editingItemId.startsWith("bab-");
    setMaterials((prev) =>
      prev.map((bab) => {
        if (bab.id === editingItemId) {
          return {
            ...bab,
            name: inlineFormData.name,
            description: inlineFormData.description,
          };
        }
        return {
          ...bab,
          items: bab.items.map((item) =>
            item.id === editingItemId
              ? {
                  ...item,
                  name: inlineFormData.name,
                  title: inlineFormData.name,
                  description: inlineFormData.description,
                  instructions: inlineFormData.description,
                }
              : item
          ),
        };
      })
    );
    handleCancelInlineEdit();
    try {
      const endpoint = isBab
        ? `/api/dashboard/lecturer/materials/${editingItemId.replace(
            "bab-",
            ""
          )}`
        : `/api/dashboard/lecturer/materials/material-details/${editingItemId.replace(
            "content-",
            ""
          )}`;
      const payload = isBab
        ? {
            material_name: inlineFormData.name,
            material_description: inlineFormData.description,
          }
        : {
            material_detail_name: inlineFormData.name,
            material_detail_description: inlineFormData.description,
          };
      const response = await fetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Gagal menyimpan perubahan ke server.");
      notifications.show({
        title: "Tersimpan!",
        message: "Perubahan Anda telah disimpan.",
        color: "green",
        icon: <IconCheck size={16} />,
      });
    } catch (e: any) {
      notifications.show({
        title: "Gagal Menyimpan",
        message: e.message,
        color: "red",
      });
      fetchData();
    }
  };

  const handleRemoveBab = async (babId: string) => {
    const numericId = babId.replace("bab-", "");
    if (
      !confirm(
        "Apakah Anda yakin ingin menghapus bab ini beserta seluruh isinya?"
      )
    )
      return;
    setIsDraft(true);
    try {
      const response = await fetch(
        `/api/dashboard/lecturer/materials/material-details/${numericId}`,
        { method: "DELETE" }
      );
      if (!response.ok) throw new Error("Gagal menghapus bab dari server.");
      setMaterials((prev) => prev.filter((b) => b.id !== babId));
      notifications.show({
        title: "Sukses",
        message: "Bab berhasil dihapus.",
        color: "green",
      });
    } catch (e: any) {
      notifications.show({ title: "Error", message: e.message, color: "red" });
    }
  };

  const handleRemoveContent = async (babId: string, contentId: string) => {
    const isQuiz = contentId.startsWith("quiz-");
    const numericId = contentId.replace(isQuiz ? "quiz-" : "content-", "");
    if (!confirm("Apakah Anda yakin ingin menghapus konten ini?")) return;
    setIsDraft(true);
    const endpoint = isQuiz
      ? `/api/dashboard/lecturer/quiz/${numericId}`
      : `/api/dashboard/lecturer/materials/${numericId}`;
    try {
      const response = await fetch(endpoint, { method: "DELETE" });
      if (!response.ok) throw new Error("Gagal menghapus konten dari server.");
      setMaterials((prev) =>
        prev.map((b) =>
          b.id === babId
            ? { ...b, items: b.items.filter((c) => c.id !== contentId) }
            : b
        )
      );
      notifications.show({
        title: "Sukses",
        message: "Konten berhasil dihapus.",
        color: "green",
      });
    } catch (e: any) {
      notifications.show({ title: "Error", message: e.message, color: "red" });
    }
  };

  if (isLoading)
    return (
      <Center h="80vh">
        <Loader />
      </Center>
    );
  if (error)
    return (
      <Container py="xl">
        <Alert color="red" icon={<IconAlertCircle />}>
          {error}
        </Alert>
      </Container>
    );

  return (
    <ProtectedRoute role="lecturer">
      <Modal
        opened={modalOpened}
        onClose={handleCloseModal}
        title={editingContent ? "Edit Konten" : "Tambah Konten Baru"}
        centered
        size="xl"
      >
        <Tabs value={activeTabInModal} onChange={setActiveTabInModal}>
          <Tabs.List>
            <Tabs.Tab value="lesson" disabled={activeTabInModal !== "lesson"}>
              Pelajaran
            </Tabs.Tab>
            <Tabs.Tab value="quiz" disabled={activeTabInModal !== "quiz"}>
              Kuis
            </Tabs.Tab>
            <Tabs.Tab
              value="assignment"
              disabled={activeTabInModal !== "assignment"}
            >
              Tugas
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="lesson" pt="md">
            <ContentForm
              onAddContent={handleAddNewContent}
              onUpdateContent={handleUpdateContent}
              initialData={editingContent}
            />
          </Tabs.Panel>
          <Tabs.Panel value="quiz" pt="md">
            <QuizBuilder
              {...quizBuilder}
              onAddQuiz={handleAddNewContent}
              onUpdateQuiz={handleUpdateContent}
              initialData={editingContent}
            />
          </Tabs.Panel>
          <Tabs.Panel value="assignment" pt="md">
            <AssignmentForm
              onAddAssignment={handleAddNewContent}
              onUpdateAssignment={handleUpdateContent}
              initialData={editingContent}
            />
          </Tabs.Panel>
        </Tabs>
      </Modal>
      <Container size="lg" py="xl">
        <Stack gap="xl">
          <Breadcrumbs separator={<IconChevronRight size={14} />}>
            <Anchor component={Link} href="/frontend/dashboard/lecturer">
              Dashboard
            </Anchor>
            <Text>Curriculum</Text>
          </Breadcrumbs>

          <Group justify="space-between">
            <Stack gap={0}>
              <Title order={2}>Manajemen Kurikulum</Title>
              <Text c="dimmed">Untuk Kursus: {courseTitle}</Text>
            </Stack>
            {isDraft && (
              <Button
                onClick={handleCreateInitialCurriculum}
                loading={isSubmitting}
                leftSection={<IconCheck size={16} />}
              >
                Simpan Draf ke Database
              </Button>
            )}
          </Group>

          <BabList
            babs={materials}
            setBabs={setMaterials}
            onOpenContentModal={handleOpenContentModal}
            onRemoveBab={handleRemoveBab}
            onRemoveContent={handleRemoveContent}
            editingItemId={editingItemId}
            inlineFormData={inlineFormData}
            setInlineFormData={setInlineFormData}
            onStartInlineEdit={handleStartInlineEdit}
            onSaveInlineEdit={handleSaveInlineEdit}
            onCancelInlineEdit={handleCancelInlineEdit}
          />

          <Paper withBorder p="lg" radius="md" mt="xl">
            <Stack>
              <Title order={4}>Tambah Bab Baru</Title>
              <TextInput
                label="Judul Bab"
                placeholder="Contoh: Bab 1 - Pengenalan"
                value={newBabName}
                onChange={(e) => setNewBabName(e.currentTarget.value)}
              />
              <Textarea
                label="Deskripsi Bab (Opsional)"
                placeholder="Jelaskan singkat isi bab ini..."
                value={newBabDescription}
                onChange={(e) => setNewBabDescription(e.currentTarget.value)}
                minRows={2}
              />
              <Button
                onClick={handleAddBab}
                leftSection={<IconPlus size={16} />}
              >
                Tambah Bab
              </Button>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    </ProtectedRoute>
  );
};

export default ManageMaterialsPage;
