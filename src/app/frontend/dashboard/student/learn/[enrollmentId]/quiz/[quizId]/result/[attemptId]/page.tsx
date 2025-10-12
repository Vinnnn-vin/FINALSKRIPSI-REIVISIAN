// src\app\frontend\dashboard\student\learn\[enrollmentId]\quiz\[quizId]\result\[attemptId]\page.tsx
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Title,
  Card,
  Text,
  Badge,
  Stack,
  Loader,
  Alert,
  Group,
  Button,
  Progress,
  Divider,
} from "@mantine/core";
import { IconAlertCircle, IconCheck, IconX, IconArrowLeft, IconRefresh } from "@tabler/icons-react";
import { useLearningDashboard } from "@/app/frontend/dashboard/student/stores/useLearningDashboard";

export default function QuizResultPage() {
  const router = useRouter();
  const { enrollmentId, quizId, attemptId } = useParams() as {
    enrollmentId: string;
    quizId: string;
    attemptId: string;
  };

  const { fetchQuizResult, quizResult, loading, error, clearError } = useLearningDashboard();
  const [retryCount, setRetryCount] = useState(0);

  // Fetch quiz result
  useEffect(() => {
    if (enrollmentId && quizId && attemptId) {
      console.log('Fetching quiz result for:', { enrollmentId, quizId, attemptId });
      fetchQuizResult(enrollmentId, quizId, attemptId);
    }
  }, [enrollmentId, quizId, attemptId, fetchQuizResult, retryCount]);

  // Handle retry
  const handleRetry = () => {
    clearError();
    setRetryCount(prev => prev + 1);
  };

  // Handle back navigation
  const handleBack = () => {
    router.push(`/frontend/dashboard/student/learn/${enrollmentId}`);
  };

  // Handle retake quiz
  const handleRetakeQuiz = () => {
    router.push(`/frontend/dashboard/student/learn/${enrollmentId}/quiz/${quizId}`);
  };

  // Loading state
  if (loading) {
    return (
      <Container py="xl" style={{ textAlign: 'center' }}>
        <Loader size="lg" />
        <Text mt="md" size="lg">Loading quiz results...</Text>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container py="xl">
        <Alert 
          color="red" 
          icon={<IconAlertCircle size={16} />}
          title="Error Loading Results"
        >
          <Text mb="md">{error}</Text>
          <Group gap="sm">
            <Button 
              leftSection={<IconRefresh size={16} />}
              onClick={handleRetry}
              size="sm"
            >
              Retry
            </Button>
            <Button 
              variant="outline"
              leftSection={<IconArrowLeft size={16} />}
              onClick={handleBack}
              size="sm"
            >
              Back to Course
            </Button>
          </Group>
        </Alert>
      </Container>
    );
  }

  // No result state
  if (!quizResult) {
    return (
      <Container py="xl">
        <Alert 
          color="orange" 
          icon={<IconAlertCircle size={16} />}
          title="No Results Found"
        >
          <Text mb="md">Quiz result not found. This might be because:</Text>
          <ul>
            <li>The quiz hasn't been submitted yet</li>
            <li>The attempt ID is invalid</li>
            <li>There was an error during submission</li>
          </ul>
          <Group gap="sm" mt="md">
            <Button 
              leftSection={<IconRefresh size={16} />}
              onClick={handleRetry}
              size="sm"
            >
              Retry
            </Button>
            <Button 
              variant="outline"
              leftSection={<IconArrowLeft size={16} />}
              onClick={handleBack}
              size="sm"
            >
              Back to Course
            </Button>
          </Group>
        </Alert>
      </Container>
    );
  }

  // Calculate additional statistics
  const totalQuestions = quizResult.detailedResults?.length || 0;
  
  // Use the is_correct field from detailedResults if available
  const correctAnswers = quizResult.detailedResults?.filter((q: any) => {
    // If API provides is_correct field directly, use it
    if (q.hasOwnProperty('is_correct')) {
      return q.is_correct;
    }
    
    // Fallback to manual calculation
    if (q.question_type === 'checkbox') {
      // For checkbox questions, check if selected answers match correct answers exactly
      const correctOptions = q.options.filter((opt: any) => opt.is_correct).map((opt: any) => opt.id);
      const selectedOptions = Array.isArray(q.selected_option) ? q.selected_option : [];
      
      return correctOptions.length === selectedOptions.length &&
             correctOptions.every((id: number) => selectedOptions.includes(id));
    } else {
      // For single choice questions
      const selectedOption = q.options.find((opt: any) => opt.id === q.selected_option);
      return selectedOption?.is_correct;
    }
  }).length || 0;
  
  const passingScore = quizResult.quiz.passing_score || 70;
  const passed = quizResult.status === "passed";

  return (
    <Container py="xl" size="lg">
      {/* Navigation */}
      <Group mb="lg">
        <Button
          variant="outline"
          leftSection={<IconArrowLeft size={16} />}
          onClick={handleBack}
        >
          Back to Course
        </Button>
      </Group>

      {/* Header Quiz Results */}
      <Card withBorder shadow="sm" mb="lg" p="xl">
        <Group justify="space-between" align="flex-start" mb="md">
          <div style={{ flex: 1 }}>
            <Title order={1} size="h2" mb="xs">
              {quizResult.quiz.title}
            </Title>
            <Text size="sm" c="dimmed" mb="md">
              Attempt #{quizResult.attemptId} • Completed on{" "}
              {new Date(quizResult.attempt_date).toLocaleString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </Text>
          </div>
          
          <Badge 
            size="xl" 
            color={passed ? "green" : "red"}
            style={{ fontSize: '1.1rem', padding: '12px 20px' }}
          >
            {quizResult.score}%
          </Badge>
        </Group>

        {/* Progress Bar */}
        <Progress
          value={quizResult.score}
          color={passed ? "green" : "red"}
          size="xl"
          mb="md"
          style={{ height: '12px' }}
        />

        {/* Status and Statistics */}
        <Group justify="space-between" align="center">
          <Group gap="lg">
            <div>
              <Text size="sm" c="dimmed">Status</Text>
              <Text
                size="lg"
                fw={600}
                c={passed ? "green" : "red"}
                tt="uppercase"
              >
                {passed ? "PASSED" : "FAILED"}
              </Text>
            </div>
            
            <div>
              <Text size="sm" c="dimmed">Correct Answers</Text>
              <Text size="lg" fw={600}>
                {correctAnswers}/{totalQuestions}
              </Text>
            </div>
            
            <div>
              <Text size="sm" c="dimmed">Passing Score</Text>
              <Text size="lg" fw={600}>
                {passingScore}%
              </Text>
            </div>
          </Group>

          {!passed && (
            <Button
              color="orange"
              onClick={handleRetakeQuiz}
            >
              Retake Quiz
            </Button>
          )}
        </Group>
      </Card>

      {/* Detailed Results */}
      <Card withBorder shadow="sm" p="xl">
        <Title order={2} size="h3" mb="lg">
          Detailed Results
        </Title>

        <Stack gap="lg">
          {quizResult.detailedResults && quizResult.detailedResults.length > 0 ? (
            quizResult.detailedResults.map((question: any, questionIndex: number) => {
              // Use is_correct field from API if available, otherwise calculate manually
              const isCorrect = question.hasOwnProperty('is_correct') 
                ? question.is_correct 
                : (() => {
                    if (question.question_type === 'checkbox') {
                      const correctOptions = question.options.filter((opt: any) => opt.is_correct).map((opt: any) => opt.id);
                      const selectedOptions = Array.isArray(question.selected_option) ? question.selected_option : [];
                      
                      return correctOptions.length === selectedOptions.length &&
                             correctOptions.every((id: number) => selectedOptions.includes(id));
                    } else {
                      const selectedOption = question.options.find((opt: any) => opt.id === question.selected_option);
                      return selectedOption?.is_correct || false;
                    }
                  })();

              return (
                <Card 
                  key={`question-${question.question_id}-${questionIndex}`}
                  withBorder
                  p="lg"
                  style={{
                    borderLeft: `4px solid ${isCorrect ? '#28a745' : '#dc3545'}`,
                    backgroundColor: isCorrect ? '#f8fff9' : '#fff8f8'
                  }}
                >
                  {/* Question Header */}
                  <Group justify="space-between" mb="md">
                    <Group gap="xs">
                      <Text fw={600} size="lg">
                        Question {questionIndex + 1}
                      </Text>
                      {question.question_type === 'checkbox' && (
                        <Badge size="sm" color="blue">Multiple Select</Badge>
                      )}
                    </Group>
                    <Badge color={isCorrect ? "green" : "red"}>
                      {isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                  </Group>

                  {/* Question Text */}
                  <Text mb="lg" style={{ lineHeight: 1.6 }}>
                    {question.text}
                  </Text>

                  <Divider mb="md" />

                  {/* Answer Options */}
                  <Stack gap="sm">
                    {question.options.map((option: any, optionIndex: number) => {
                      const isSelected = question.question_type === 'checkbox' 
                        ? Array.isArray(question.selected_option) && question.selected_option.includes(option.id)
                        : question.selected_option === option.id;
                      const isCorrectOption = option.is_correct;
                      
                      let optionColor = "gray";
                      let optionBg = "#ffffff";
                      let icon = null;
                      
                      if (isCorrectOption) {
                        optionColor = "green";
                        optionBg = "#e8f5e8";
                        icon = <IconCheck size={16} color="#28a745" />;
                      } else if (isSelected && !isCorrectOption) {
                        optionColor = "red";
                        optionBg = "#ffeaea";
                        icon = <IconX size={16} color="#dc3545" />;
                      }

                      return (
                        <div
                          key={`question-${question.question_id}-option-${option.id}-${optionIndex}`}
                          style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: `2px solid ${isSelected || isCorrectOption ? (isCorrectOption ? '#28a745' : '#dc3545') : '#e9ecef'}`,
                            backgroundColor: optionBg,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                          }}
                        >
                          {icon && <span>{icon}</span>}
                          <Text 
                            style={{ 
                              flex: 1,
                              color: isCorrectOption ? '#28a745' : (isSelected && !isCorrectOption ? '#dc3545' : '#333'),
                              fontWeight: (isSelected || isCorrectOption) ? 600 : 400
                            }}
                          >
                            {option.text}
                          </Text>
                          {isSelected && !isCorrectOption && (
                            <Badge color="red" size="sm">Your Answer</Badge>
                          )}
                          {isCorrectOption && (
                            <Badge color="green" size="sm">Correct Answer</Badge>
                          )}
                        </div>
                      );
                    })}
                  </Stack>
                </Card>
              );
            })
          ) : (
            <Alert color="orange" icon={<IconAlertCircle size={16} />}>
              No detailed results available.
            </Alert>
          )}
        </Stack>
      </Card>

      {/* Action Buttons */}
      <Group justify="center" mt="xl">
        <Button
          variant="outline"
          leftSection={<IconArrowLeft size={16} />}
          onClick={handleBack}
          size="lg"
        >
          Back to Course
        </Button>
        
        {!passed && (
          <Button
            color="orange"
            onClick={handleRetakeQuiz}
            size="lg"
          >
            Retake Quiz
          </Button>
        )}
      </Group>
    </Container>
  );
}