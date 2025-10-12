// src\app\frontend\dashboard\student\learn\[enrollmentId]\components\QuizContent.tsx

"use client";

import { useRouter } from "next/navigation";
import {
  Card,
  Title,
  Text,
  Loader,
  Alert,
  Stack,
  Button,
  Group,
  Badge,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useLearningStore } from "@/app/frontend/dashboard/student/stores/useDashboardStore";
import { useEffect } from "react";

interface Props {
  enrollmentId: number;
  quizId: number;
}

export default function QuizContent({ enrollmentId, quizId }: Props) {
  const { quizzes, fetchQuiz, loadingQuizzes } = useLearningStore();
  const router = useRouter();

  const quiz = quizzes[quizId];
  const loading = loadingQuizzes[quizId];

  useEffect(() => {
    if (!quiz) {
      fetchQuiz(enrollmentId, quizId);
    }
  }, [quiz, enrollmentId, quizId, fetchQuiz]);

  if (loading) return <Loader />;
  if (!quiz)
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red">
        Failed to load quiz
      </Alert>
    );

  return (
    <Card shadow="sm" withBorder p="lg">
      <Stack>
        <Group justify="space-between">
          <Title order={3}>{quiz.quiz_title}</Title>
          <Badge color="blue">{quiz.time_limit} min</Badge>
        </Group>
        <Text c="dimmed">{quiz.quiz_description}</Text>

        <Button
          variant="light"
          color="green"
          onClick={() =>
            router.push(
              `/frontend/dashboard/student/learn/${enrollmentId}/quiz/${quiz.quiz_id}`
            )
          }
        >
          Start Quiz
        </Button>
      </Stack>
    </Card>
  );
}
