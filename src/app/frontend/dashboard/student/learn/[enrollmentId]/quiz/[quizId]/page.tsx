// src\app\frontend\dashboard\student\learn\[enrollmentId]\quiz\[quizId]\page.tsx
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Container,
  Card,
  Title,
  Text,
  Button,
  Stack,
  Group,
  SimpleGrid,
  List,
  Anchor,
  Paper,
  Flex,
} from "@mantine/core";

interface AnswerOption {
  option_id: number;
  option_text: string;
}

interface Question {
  question_id: number;
  question_text: string;
  question_type: string;
  points: number;
  answerOptions: AnswerOption[];
}

interface QuizData {
  quiz_id: number;
  quiz_title: string;
  quiz_description: string;
  passing_score: number;
  time_limit: number;
  max_attempts: number;
  course_title: string;
  material_name: string;
  questions: Question[];
}

export default function QuizPage() {
  const router = useRouter();
  const params = useParams();
  const enrollmentId = params?.enrollmentId as string;
  const quizId = params?.quizId as string;

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [started, setStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [questionId: number]: any }>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchQuizData = useCallback(async () => {
    if (!enrollmentId || !quizId) return;
    setLoading(true);
    setError(null);
    try {
      console.log('Fetching quiz data for:', { enrollmentId, quizId });
      
      const response = await fetch(
        `/api/dashboard/student/learn/${enrollmentId}/quiz/${quizId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          cache: 'no-cache',
        }
      );
      
      console.log('Quiz fetch response status:', response.status);
      
      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to load quiz data");
      }
      
      const data: QuizData = await response.json();
      console.log('Quiz data received:', data);
      
      if (!data.questions || data.questions.length === 0) {
        throw new Error("This quiz has no questions available");
      }
      
      setQuizData(data);
      if (data.time_limit > 0) {
        setTimeLeft(data.time_limit * 60);
      }
    } catch (err: any) {
      console.error("Quiz fetch error:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [enrollmentId, quizId]);

  useEffect(() => {
    fetchQuizData();
  }, [fetchQuizData]);

  const handleSubmitQuiz = useCallback(
    async (isAutoSubmit = false) => {
      if (isSubmitting) return;

      if (!isAutoSubmit) {
        const confirmation = confirm(
          "Are you sure you want to submit this quiz? Your answers cannot be changed after submission."
        );
        if (!confirmation) return;
      }

      setIsSubmitting(true);

      try {
        console.log('Submitting quiz with answers:', answers);
        
        const response = await fetch(
          `/api/dashboard/student/learn/${enrollmentId}/quiz/submit`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              quizId: parseInt(quizId), 
              answers: answers 
            }),
          }
        );

        console.log('Submit response status:', response.status);
        const result = await response.json();
        console.log('Submit response data:', result);

        if (!response.ok) {
          throw new Error(result.error || "Failed to submit quiz");
        }

        // FIX: Navigate to result page with proper attemptId
        const attemptId = result.attemptId;
        
        if (!attemptId) {
          throw new Error("No attempt ID received from server");
        }

        console.log('Navigating to result page with attemptId:', attemptId);
        router.push(
          `/frontend/dashboard/student/learn/${enrollmentId}/quiz/${quizId}/result/${attemptId}`
        );
      } catch (err: any) {
        console.error("Quiz submission error:", err);
        setError(err.message || "Failed to submit quiz");
        setIsSubmitting(false);
      }
    },
    [answers, enrollmentId, quizId, router, isSubmitting]
  );

  useEffect(() => {
    if (!started || timeLeft === null || isSubmitting) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev !== null && prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz(true);
          return 0;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [started, timeLeft, isSubmitting, handleSubmitQuiz]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const handleAnswerSelect = (questionId: number, answer: any) => {
    console.log('Answer selected:', { questionId, answer });
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleStartQuiz = () => setStarted(true);

  const goToNextQuestion = () => {
    if (currentQuestionIndex < (quizData?.questions.length || 0) - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleBack = () => {
    if (started && !isSubmitting) {
      const confirmed = confirm(
        "Your quiz progress will be lost. Are you sure you want to go back?"
      );
      if (!confirmed) return;
    }
    router.push(`/frontend/dashboard/student/learn/${enrollmentId}`);
  };

  // Loading state
  if (loading) return <div style={styles.centered}>Loading quiz...</div>;
  
  // Error state
  if (error)
    return (
      <div style={styles.centered}>
        <div style={styles.errorContainer}>
          <h3>Error</h3>
          <p>{error}</p>
          <button style={styles.button} onClick={fetchQuizData}>
            Try Again
          </button>
          <button style={styles.button} onClick={handleBack}>
            Back to Course
          </button>
        </div>
      </div>
    );
    
  // No data state
  if (!quizData)
    return (
      <div style={styles.centered}>
        <p>Quiz not found</p>
      </div>
    );

  // Submitting state
  if (isSubmitting) {
    return (
      <div style={styles.centered}>
        <div style={styles.completionScreen}>
          <h2>Submitting Quiz...</h2>
          <p>Please wait while we process your answers.</p>
          <div style={styles.spinner} />
        </div>
      </div>
    );
  }

  // Start screen
  if (!started) {
    return (
      // [!] Gunakan Flex sebagai pembungkus utama untuk layout fullscreen
      <Flex
        justify="center"
        align="center"
        style={{ minHeight: '100vh', background: 'var(--mantine-color-gray-0)', padding: 'var(--mantine-spacing-md)' }}
      >
        <Card
          withBorder
          shadow="md"
          radius="lg"
          p="xl"
          w="100%"
          maw="700px" // [!] Batasi lebar maksimum kartu agar tidak terlalu lebar di layar besar
        >
          <Stack gap="xl">
            {/* Tombol Kembali */}
            <Anchor onClick={handleBack} size="sm">
              ← Back to Course
            </Anchor>

            {/* Header Kuis */}
            <Stack gap={0} align="center">
              <Title order={1} ta="center">{quizData.quiz_title}</Title>
              <Text c="dimmed">{quizData.course_title} - {quizData.material_name}</Text>
            </Stack>

            {/* Deskripsi Kuis */}
            {quizData.quiz_description && (
              <Paper bg="gray-1" p="md" radius="md">
                <Text ta="center">{quizData.quiz_description}</Text>
              </Paper>
            )}

            {/* Informasi Detail Kuis */}
            <Card withBorder bg="gray-0" radius="md" p="xl">
              <SimpleGrid cols={{ base: 2, sm: 2 }} spacing="lg">
                <Stack gap={0}>
                  <Text size="sm" c="dimmed">Questions</Text>
                  <Text fw={700} size="lg">{quizData.questions.length}</Text>
                </Stack>
                <Stack gap={0}>
                  <Text size="sm" c="dimmed">Passing Score</Text>
                  <Text fw={700} size="lg">{quizData.passing_score}%</Text>
                </Stack>
                <Stack gap={0}>
                  <Text size="sm" c="dimmed">Time Limit</Text>
                  <Text fw={700} size="lg">
                    {quizData.time_limit > 0 ? `${quizData.time_limit} minutes` : 'No limit'}
                  </Text>
                </Stack>
                <Stack gap={0}>
                  <Text size="sm" c="dimmed">Max Attempts</Text>
                  <Text fw={700} size="lg">
                    {quizData.max_attempts > 0 ? quizData.max_attempts : 'Unlimited'}
                  </Text>
                </Stack>
              </SimpleGrid>
            </Card>

            {/* Instruksi */}
            <Stack gap="xs">
              <Title order={4}>Instructions:</Title>
              <List size="sm">
                <List.Item>Read each question carefully.</List.Item>
                <List.Item>Select the best answer for each question.</List.Item>
                <List.Item>You can navigate between questions using the Next/Previous buttons.</List.Item>
                <List.Item>Submit your quiz when you're ready.</List.Item>
                {quizData.time_limit > 0 && (
                  <List.Item><strong>Time limit applies once you start the quiz.</strong></List.Item>
                )}
              </List>
            </Stack>

            {/* Tombol Mulai */}
            <Button color="green" size="lg" fullWidth onClick={handleStartQuiz}>
              Start Quiz
            </Button>
          </Stack>
        </Card>
      </Flex>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quizData.questions.length) * 100;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button style={styles.backButton} onClick={handleBack}>
          ← Exit Quiz
        </button>
        <h2>{quizData.quiz_title}</h2>
        {timeLeft !== null && (
          <div style={styles.timer}>Time: {formatTime(timeLeft)}</div>
        )}
      </div>
      
      <div style={styles.progressContainer}>
        <div style={styles.progressBar}>
          <div style={{ ...styles.progressFill, width: `${progress}%` }} />
        </div>
        <span style={styles.progressText}>
          Question {currentQuestionIndex + 1} of {quizData.questions.length}
        </span>
      </div>
      
      <div style={styles.questionContainer}>
        <div style={styles.questionHeader}>
          <h3>Question {currentQuestionIndex + 1}</h3>
          <span style={styles.points}>{currentQuestion.points} points</span>
        </div>
        <div style={styles.questionText}>{currentQuestion.question_text}</div>
        <div style={styles.optionsContainer}>
          {currentQuestion.question_type === "multiple_choice" &&
            currentQuestion.answerOptions.map((option) => (
              <label key={option.option_id} style={styles.optionLabel}>
                <input
                  type="radio"
                  name={`question_${currentQuestion.question_id}`}
                  value={option.option_id}
                  checked={
                    answers[currentQuestion.question_id] === option.option_id
                  }
                  onChange={() =>
                    handleAnswerSelect(
                      currentQuestion.question_id,
                      option.option_id
                    )
                  }
                  style={styles.radioInput}
                />
                <span style={styles.optionText}>{option.option_text}</span>
              </label>
            ))}
          {currentQuestion.question_type === "checkbox" &&
            currentQuestion.answerOptions.map((option) => {
              const currentAnswers = answers[currentQuestion.question_id] || [];
              return (
                <label key={option.option_id} style={styles.optionLabel}>
                  <input
                    type="checkbox"
                    value={option.option_id}
                    checked={currentAnswers.includes(option.option_id)}
                    onChange={(e) => {
                      const optionId = parseInt(e.target.value);
                      const newAnswers = e.target.checked
                        ? [...currentAnswers, optionId]
                        : currentAnswers.filter(
                            (id: number) => id !== optionId
                          );
                      handleAnswerSelect(
                        currentQuestion.question_id,
                        newAnswers
                      );
                    }}
                    style={styles.checkboxInput}
                  />
                  <span style={styles.optionText}>{option.option_text}</span>
                </label>
              );
            })}
        </div>
      </div>
      
      <div style={styles.navigationContainer}>
        <button
          style={
            currentQuestionIndex === 0 ? styles.buttonDisabled : styles.button
          }
          onClick={goToPrevQuestion}
          disabled={currentQuestionIndex === 0}
        >
          Previous
        </button>
        <div style={styles.questionIndicators}>
          {quizData.questions.map((_, index) => (
            <button
              key={index}
              style={{
                ...styles.questionIndicator,
                ...(index === currentQuestionIndex &&
                  styles.questionIndicatorActive),
                ...(answers[quizData.questions[index].question_id] &&
                  styles.questionIndicatorAnswered),
              }}
              onClick={() => setCurrentQuestionIndex(index)}
            >
              {index + 1}
            </button>
          ))}
        </div>
        {currentQuestionIndex === quizData.questions.length - 1 ? (
          <button
            style={styles.submitButton}
            onClick={() => handleSubmitQuiz()}
          >
            Submit Quiz
          </button>
        ) : (
          <button style={styles.primaryButton} onClick={goToNextQuestion}>
            Next
          </button>
        )}
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  centered: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    fontFamily: "system-ui, sans-serif",
    textAlign: "center",
  },
  container: {
    minHeight: "100vh",
    fontFamily: "system-ui, sans-serif",
    backgroundColor: "#f8f9fa",
    padding: "1rem",
  },
  startScreen: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "2rem",
    backgroundColor: "#fff",
    borderRadius: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
  },
  backButton: {
    background: "none",
    border: "none",
    padding: "0.5rem 0",
    marginBottom: "1rem",
    cursor: "pointer",
    fontSize: "1rem",
    color: "#007bff",
    textDecoration: "underline",
  },
  quizHeader: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  courseInfo: {
    color: "#666",
    fontSize: "0.9rem",
    margin: "0.5rem 0",
  },
  description: {
    backgroundColor: "#f8f9fa",
    padding: "1rem",
    borderRadius: "6px",
    marginBottom: "2rem",
  },
  quizInfo: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: "1rem",
    marginBottom: "2rem",
    padding: "1rem",
    backgroundColor: "#e9ecef",
    borderRadius: "6px",
  },
  infoItem: {
    textAlign: "center",
  },
  instructions: {
    marginBottom: "2rem",
  },
  startButton: {
    width: "100%",
    padding: "1rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontSize: "1.1rem",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background-color 0.2s",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  timer: {
    fontSize: "1.2rem",
    fontWeight: "600",
    color: "#dc3545",
  },
  progressContainer: {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  progressBar: {
    width: "100%",
    height: "8px",
    backgroundColor: "#e9ecef",
    borderRadius: "4px",
    overflow: "hidden",
    marginBottom: "0.5rem",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#007bff",
    transition: "width 0.3s ease",
  },
  progressText: {
    fontSize: "0.9rem",
    color: "#666",
  },
  questionContainer: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    marginBottom: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  questionHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  points: {
    fontSize: "0.9rem",
    color: "#666",
    fontWeight: "500",
  },
  questionText: {
    fontSize: "1.1rem",
    marginBottom: "2rem",
    lineHeight: "1.6",
  },
  optionsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  optionLabel: {
    display: "flex",
    alignItems: "flex-start",
    gap: "0.75rem",
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
    backgroundColor: "#f8f9fa",
  },
  radioInput: {
    marginTop: "0.2rem",
    transform: "scale(1.2)",
  },
  checkboxInput: {
    marginTop: "0.2rem",
    transform: "scale(1.2)",
  },
  optionText: {
    flex: 1,
    lineHeight: "1.5",
  },
  essayInput: {
    width: "100%",
    minHeight: "150px",
    padding: "1rem",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "1rem",
    fontFamily: "inherit",
    resize: "vertical",
  },
  navigationContainer: {
    backgroundColor: "#fff",
    padding: "1rem",
    borderRadius: "8px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "1rem",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  questionIndicators: {
    display: "flex",
    gap: "0.5rem",
    flexWrap: "wrap",
  },
  questionIndicator: {
    width: "40px",
    height: "40px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    color: "#666",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "all 0.2s",
  },
  questionIndicatorActive: {
    backgroundColor: "#007bff",
    color: "white",
    border: "1px solid #007bff",
  },
  questionIndicatorAnswered: {
    backgroundColor: "#28a745",
    color: "white",
    border: "1px solid #28a745",
  },
  button: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#6c757d",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    transition: "background-color 0.2s",
  },
  buttonDisabled: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#e9ecef",
    color: "#6c757d",
    border: "none",
    borderRadius: "6px",
    cursor: "not-allowed",
    fontSize: "1rem",
  },
  primaryButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "500",
    transition: "background-color 0.2s",
  },
  submitButton: {
    padding: "0.75rem 1.5rem",
    backgroundColor: "#28a745",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "1rem",
    fontWeight: "600",
    transition: "background-color 0.2s",
  },
  errorContainer: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "2rem",
    borderRadius: "8px",
    border: "1px solid #f5c6cb",
    textAlign: "center",
  },
  completionScreen: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  spinner: {
    width: "40px",
    height: "40px",
    border: "4px solid #f3f3f3",
    borderTop: "4px solid #007bff",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
    margin: "1rem auto",
  },
};
