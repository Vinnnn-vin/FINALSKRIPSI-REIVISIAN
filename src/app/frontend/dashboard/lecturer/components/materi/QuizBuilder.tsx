// src\app\frontend\dashboard\lecturer\components\materi\QuizBuilder.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
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
} from "@mantine/core";
import { IconPlus, IconTrash } from "@tabler/icons-react";
import type { QuestionType, ContentItemType } from "../../types/material";

interface QuizBuilderProps {
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
  onAddQuiz: (item: ContentItemType) => void;
}

export default function QuizBuilder({
  questions,
  addQuestion,
  removeQuestion,
  updateQuestionText,
  updateQuestionType,
  addOption,
  removeOption,
  toggleCorrectOption,
  updateOptionText,
  setQuestions,
  onAddQuiz,
}: QuizBuilderProps) {
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDescription, setQuizDescription] = useState("");
  const [quiz, setQuiz] = useState({
    passing_score: undefined as number | undefined,
    time_limit: undefined as number | undefined,
    max_attempts: undefined as number | undefined,
  });

  const handleAddQuizToList = () => {
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
      id: `c-${Date.now()}`,
      type: "quiz",
      title: quizTitle,
      description: quizDescription,
      questions: [...questions],
      passing_score: quiz.passing_score,
      time_limit: quiz.time_limit,
      max_attempts: quiz.max_attempts,
    };

    onAddQuiz(item);

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
        <Group justify="space-between">
          <Text fw={600}>Quiz Builder</Text>
          <Button leftSection={<IconPlus size={14} />} onClick={addQuestion}>
            Tambah Pertanyaan
          </Button>
        </Group>

        <TextInput
          label="Judul Kuis"
          value={quizTitle}
          onChange={(e) => setQuizTitle(e.currentTarget.value)}
        />
        <Textarea
          label="Instruksi (opsional)"
          value={quizDescription}
          onChange={(e) => setQuizDescription(e.currentTarget.value)}
          minRows={2}
        />

        {questions.map((q, qi) => (
          <Card key={q.id} withBorder>
            <Stack>
              <Group justify="space-between">
                <TextInput
                  placeholder={`Pertanyaan ${qi + 1}`}
                  value={q.text}
                  onChange={(e) =>
                    updateQuestionText(qi, e.currentTarget.value)
                  }
                />
                <Select
                  value={q.type}
                  onChange={(v) => updateQuestionType(qi, v as any)}
                  data={[
                    { value: "multiple_choice", label: "Pilihan Ganda" },
                    { value: "checkbox", label: "Checkbox" },
                  ]}
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
              {/* Added quiz configuration fields */}
              <TextInput
                label="Passing Score"
                type="number"
                value={quiz.passing_score || ""}
                onChange={(e) =>
                  setQuiz({
                    ...quiz,
                    passing_score: parseInt(e.currentTarget.value, 10),
                  })
                }
              />
              <TextInput
                label="Time Limit (minutes)"
                type="number"
                value={quiz.time_limit || ""}
                onChange={(e) =>
                  setQuiz({
                    ...quiz,
                    time_limit: parseInt(e.currentTarget.value, 10),
                  })
                }
              />
              <TextInput
                label="Max Attempts"
                type="number"
                value={quiz.max_attempts || ""}
                onChange={(e) =>
                  setQuiz({
                    ...quiz,
                    max_attempts: parseInt(e.currentTarget.value, 10),
                  })
                }
              />
            </Stack>
          </Card>
        ))}

        <Button onClick={handleAddQuizToList} fullWidth>
          Tambah Kuis ke Daftar Konten
        </Button>
      </Stack>
    </Card>
  );
}
