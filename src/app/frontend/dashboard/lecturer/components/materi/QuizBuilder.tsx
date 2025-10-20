// src\app\frontend\dashboard\lecturer\components\materi\QuizBuilder.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import {
  Card,
  Stack,
  Group,
  TextInput,
  Select,
  Button,
  Text,
  ActionIcon,
  Textarea,
  Divider,
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import type { QuestionType, ContentItemType } from "../../types/material";

interface QuizBuilderProps {
  onAddQuiz: (item: ContentItemType) => void;
  onUpdateQuiz?: (item: ContentItemType) => void;
  initialData?: ContentItemType | null;

  questions: QuestionType[];
  addQuestion: () => void;
  removeQuestion: (index: number) => void;
  updateQuestionText: (index: number, text: string) => void;
  updateQuestionType: (
    index: number,
    type: "multiple_choice" | "checkbox"
  ) => void;
  addOption: (qIndex: number) => void;
  removeOption: (qIndex: number, oIndex: number) => void;
  toggleCorrectOption: (qIndex: number, oIndex: number) => void;
  updateOptionText: (qIndex: number, oIndex: number, text: string) => void;
  setQuestions: (qs: QuestionType[]) => void;
}

export default function QuizBuilder({
  onAddQuiz,
  onUpdateQuiz,
  initialData,
  questions,
  setQuestions,
  addQuestion,
  removeQuestion,
  updateQuestionText,
  updateQuestionType,
  addOption,
  removeOption,
  toggleCorrectOption,
  updateOptionText,
}: QuizBuilderProps) {
  const isEditMode = !!initialData && initialData.type === "quiz";

  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quiz, setQuiz] = useState<{
    passing_score?: number;
    time_limit?: number;
    max_attempts?: number;
  }>({});

  useEffect(() => {
    if (isEditMode && initialData) {
      setQuizTitle(initialData.title || "");
      setQuizDescription(initialData.description || "");
      setQuestions(initialData.questions || []);
      setQuiz({
        passing_score: initialData.passing_score,
        time_limit: initialData.time_limit,
        max_attempts: initialData.max_attempts,
      });
    } else {
      setQuizTitle("");
      setQuizDescription("");
      setQuestions([]);
      setQuiz({});
    }
  }, [initialData, setQuestions]);

  const handleAddOrUpdate = () => {
    if (!quizTitle.trim()) return;
    if (questions.length === 0) return;

    // basic validation (at least one correct answer per question)
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.text.trim()) return;
      const hasCorrect = q.options.some((o) => o.is_correct);
      if (!hasCorrect) return;
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].text.trim()) return;
      }
    }

    const item: ContentItemType = {
      id: isEditMode ? initialData.id : `q-${Date.now()}`,
      type: "quiz",
      title: quizTitle,
      name: quizTitle, // untuk konsistensi
      description: quizDescription,
      questions: [...questions],
      passing_score: quiz.passing_score,
      time_limit: quiz.time_limit,
      max_attempts: quiz.max_attempts,
    };

    if (isEditMode && onUpdateQuiz) {
      onUpdateQuiz(item);
    } else {
      onAddQuiz(item);
    }

    // onAddQuiz(item);

    // reset
    setQuizTitle("");
    setQuizDescription("");
    setQuestions([]);
    setQuiz({
      passing_score: undefined,
      time_limit: undefined,
      max_attempts: undefined,
    });
  };

  return (
    <Card withBorder radius="md" p="lg">
      <Stack>
        <Text fw={600}>Quiz Builder</Text>

        {/* BAGIAN 1: DETAIL UTAMA KUIS (PINDAHKAN KE SINI) */}
        <TextInput
          label="Judul Kuis"
          placeholder="Contoh: Kuis Bab 1 - Pengenalan"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.currentTarget.value)}
          required
        />
        <Textarea
          label="Instruksi Kuis (Opsional)"
          placeholder="Jelaskan aturan dan topik kuis..."
          value={quizDescription}
          onChange={(e) => setQuizDescription(e.currentTarget.value)}
          minRows={2}
        />
        <Group grow>
          <TextInput
            label="Passing Score (%)"
            type="number"
            placeholder="70"
            value={quiz.passing_score || ""}
            onChange={(e) =>
              setQuiz({
                ...quiz,
                passing_score: parseInt(e.currentTarget.value, 10),
              })
            }
          />
          <TextInput
            label="Batas Waktu (Menit)"
            type="number"
            placeholder="60"
            value={quiz.time_limit || ""}
            onChange={(e) =>
              setQuiz({
                ...quiz,
                time_limit: parseInt(e.currentTarget.value, 10),
              })
            }
          />
          <TextInput
            label="Maksimal Percobaan"
            type="number"
            placeholder="3"
            value={quiz.max_attempts || ""}
            onChange={(e) =>
              setQuiz({
                ...quiz,
                max_attempts: parseInt(e.currentTarget.value, 10),
              })
            }
          />
        </Group>

        <Divider my="xs" label="Pertanyaan Kuis" labelPosition="center" />

        {/* BAGIAN 2: DAFTAR PERTANYAAN */}
        {questions.map((q, qi) => (
          <Card key={q.id} withBorder>
            <Stack>
              <Group justify="space-between">
                <TextInput
                  placeholder={`Teks Pertanyaan ${qi + 1}`}
                  value={q.text}
                  onChange={(e) =>
                    updateQuestionText(qi, e.currentTarget.value)
                  }
                  style={{ flex: 1 }}
                />
                <Select
                  value={q.type}
                  data={[
                    { value: "multiple_choice", label: "Pilihan Ganda" },
                    { value: "checkbox", label: "Checkbox" },
                  ]}
                  onChange={(value) => {
                    if (value)
                      updateQuestionType(
                        qi,
                        value as "multiple_choice" | "checkbox"
                      );
                  }}
                  onDropdownClose={() => {
                    // Trigger ulang update jika user menutup dropdown tanpa mengubah value (klik ulang opsi sama)
                    updateQuestionType(qi, q.type);
                  }}
                />
                <ActionIcon color="red" onClick={() => removeQuestion(qi)}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>

              <Stack>
                {q.options.map((o, oi) => (
                  <Group key={o.id}>
                    <TextInput
                      placeholder={`Opsi ${oi + 1}`}
                      value={o.text}
                      onChange={(e) =>
                        updateOptionText(qi, oi, e.currentTarget.value)
                      }
                      style={{ flex: 1 }}
                    />
                    <Button
                      variant={o.is_correct ? "filled" : "light"}
                      color={o.is_correct ? "green" : "gray"}
                      onClick={() => toggleCorrectOption(qi, oi)}
                    >
                      Benar
                    </Button>
                    <ActionIcon
                      color="red"
                      onClick={() => removeOption(qi, oi)}
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ))}
                <Button
                  variant="light"
                  leftSection={<IconPlus size={14} />}
                  onClick={() => addOption(qi)}
                >
                  Tambah Opsi
                </Button>
              </Stack>
            </Stack>
          </Card>
        ))}

        {/* BAGIAN 3: TOMBOL AKSI */}
        <Button
          leftSection={<IconPlus size={14} />}
          onClick={addQuestion}
          variant="outline"
        >
          Tambah Pertanyaan Baru
        </Button>

        <Divider my="sm" />

        <Button
          onClick={handleAddOrUpdate}
          fullWidth
          size="md"
          disabled={!quizTitle.trim() || questions.length === 0}
        >
          {isEditMode ? "Simpan Perubahan Kuis" : "Tambahkan Kuis"}
        </Button>
      </Stack>
    </Card>
  );
}
