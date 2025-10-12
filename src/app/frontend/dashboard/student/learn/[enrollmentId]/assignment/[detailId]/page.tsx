// src\app\frontend\dashboard\student\learn\[enrollmentId]\assignment\[detailId]\page.tsx

/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Container,
  Card,
  Text,
  Button,
  Group,
  Stack,
  Title,
  Badge,
  Alert,
  Textarea,
  FileInput,
  Loader,
  Center,
  Divider,
  ActionIcon,
  Anchor,
  Progress,
  Box,
  Timeline,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconAlertCircle,
  IconCheck,
  IconUpload,
  IconFile,
  IconExternalLink,
  IconTrash,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";

interface Material {
  material_id: number;
  material_name: string;
  material_description: string;
}

interface AssignmentData {
  history: never[];
  material_detail_id: number;
  material_detail_name: string;
  material_detail_description: string;
  materi_detail_url: string;
  is_completed: boolean;
  completed_at: string | null;
  course_id: number;
  course_title: string;
  material: Material;
}

interface SubmissionHistory {
  submission_id: number;
  attempt_number: number;
  status: string;
  score: number | null;
  feedback: string | null;
  submitted_at: string;
}

export default function AssignmentPage() {
  const router = useRouter();
  const params = useParams();
  const enrollmentId = params?.enrollmentId as string;
  const detailId = params?.detailId as string;

  // State
  const [assignmentData, setAssignmentData] = useState<AssignmentData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionText, setSubmissionText] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [history, setHistory] = useState<SubmissionHistory[]>([]);

  // Fetch assignment data
  const fetchAssignmentData = useCallback(async () => {
    if (!enrollmentId || !detailId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/dashboard/student/learn/${enrollmentId}/assignment/${detailId}`
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to load assignment data");
      }

      const data: AssignmentData = await response.json();
      setAssignmentData(data);
      setHistory(data.history || []);
    } catch (err: any) {
      console.error("Assignment fetch error:", err);
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  }, [enrollmentId, detailId]);

  // Handle file selection with validation
  const handleFileSelect = (file: File | null) => {
    if (!file) {
      setSelectedFile(null);
      return;
    }

    // File size validation (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      notifications.show({
        title: "File too large",
        message: "File size must be less than 10MB",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    // File type validation
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      notifications.show({
        title: "Invalid file type",
        message: "Please select a PDF, DOC, DOCX, TXT, JPG, or PNG file",
        color: "red",
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    setSelectedFile(file);
    notifications.show({
      title: "File selected",
      message: `${file.name} is ready to upload`,
      color: "green",
      icon: <IconCheck size={16} />,
    });
  };

  // Handle submission with proper validation
  const handleSubmit = async () => {
    if (!assignmentData) return;

    // Validation
    if (!submissionText.trim() && !selectedFile) {
      notifications.show({
        title: "Submission required",
        message: "Please provide either text submission or upload a file",
        color: "orange",
        icon: <IconAlertCircle size={16} />,
      });
      return;
    }

    setSubmitting(true);
    setUploadProgress(0);

    try {
      // 1. Buat objek FormData
      const formData = new FormData();
      if (selectedFile) {
        formData.append("file", selectedFile);
      }
      formData.append("submissionText", submissionText);
      formData.append("enrollmentId", enrollmentId);
      formData.append("courseId", String(assignmentData.course_id));
      formData.append(
        "materialDetailId",
        String(assignmentData.material_detail_id)
      );

      // DEBUG: Lihat data yang akan dikirim di console browser
      console.log("Submitting FormData with the following data:");
      for (const [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      // 2. Kirim request ke API
      const response = await fetch("/api/dashboard/student/submission", {
        method: "POST",
        body: formData,
      });

      const result = await response.json(); // Ambil respons dari server

      if (!response.ok) {
        // Jika server mengembalikan error, tampilkan pesan error dari server
        throw new Error(result.error || "Failed to submit assignment");
      }

      notifications.show({
        title: "Assignment Submitted!",
        message: "Your work has been submitted successfully.",
        color: "green",
      });

      // Muat ulang data halaman untuk menampilkan status 'Completed'
      await fetchAssignmentData();
    } catch (err: any) {
      console.error("Assignment submission error:", err);
      notifications.show({
        title: "Submission Failed",
        message: err.message,
        color: "red",
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Handle back navigation
  const handleBack = () => {
    if (submissionText.trim() || selectedFile) {
      if (
        window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        )
      ) {
        router.push(`/frontend/dashboard/student/learn/${enrollmentId}`);
      }
    } else {
      router.push(`/frontend/dashboard/student/learn/${enrollmentId}`);
    }
  };

  const lastSubmission =
    history.length > 0 ? history[history.length - 1] : null;
  const isRejected = lastSubmission?.status === "rejected";

  // Initial load
  useEffect(() => {
    fetchAssignmentData();
  }, [fetchAssignmentData]);

  // Loading state
  if (loading) {
    return (
      <Container size="md" py="xl">
        <Center>
          <Stack align="center">
            <Loader size="lg" />
            <Text>Loading assignment...</Text>
          </Stack>
        </Center>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container size="md" py="xl">
        <Alert
          color="red"
          icon={<IconAlertCircle size={16} />}
          title="Error Loading Assignment"
        >
          <Text mb="md">{error}</Text>
          <Group>
            <Button onClick={fetchAssignmentData} size="sm">
              Try Again
            </Button>
            <Button variant="outline" onClick={handleBack} size="sm">
              Back to Course
            </Button>
          </Group>
        </Alert>
      </Container>
    );
  }

  // No data state
  if (!assignmentData) {
    return (
      <Container size="md" py="xl">
        <Alert
          color="orange"
          icon={<IconAlertCircle size={16} />}
          title="Assignment Not Found"
        >
          <Text mb="md">The requested assignment could not be found.</Text>
          <Button variant="outline" onClick={handleBack} size="sm">
            Back to Course
          </Button>
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="md" py="md">
      <Stack gap="lg">
        {/* Header */}
        <Card withBorder p="lg">
          <Group justify="space-between" align="flex-start" mb="md">
            <Group>
              <ActionIcon
                variant="subtle"
                color="blue"
                size="lg"
                onClick={handleBack}
                aria-label="Back to course"
              >
                <IconArrowLeft size={18} />
              </ActionIcon>
              <Box>
                <Title order={2}>{assignmentData.material_detail_name}</Title>
                <Text size="sm" c="dimmed">
                  {assignmentData.course_title} •{" "}
                  {assignmentData.material.material_name}
                </Text>
              </Box>
            </Group>

            {assignmentData.is_completed && (
              <Badge
                color="green"
                size="lg"
                leftSection={<IconCheck size={14} />}
              >
                Completed
              </Badge>
            )}
          </Group>
        </Card>

        {/* Assignment Instructions */}
        <Card withBorder p="lg">
          <Stack>
            <Group>
              <IconFile size={20} />
              <Title order={3}>Assignment Instructions</Title>
            </Group>

            <Alert color="blue" variant="light">
              <Text>{assignmentData.material_detail_description}</Text>
            </Alert>

            {assignmentData.material.material_description && (
              <>
                <Divider />
                <Box>
                  <Text fw={500} mb="xs">
                    Material Context
                  </Text>
                  <Text size="sm" c="dimmed">
                    {assignmentData.material.material_description}
                  </Text>
                </Box>
              </>
            )}

            {assignmentData.materi_detail_url && (
              <>
                <Divider />
                <Box>
                  <Text fw={500} mb="xs">
                    Assignment Resources
                  </Text>
                  <Anchor
                    href={assignmentData.materi_detail_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Group gap="xs">
                      <IconExternalLink size={16} />
                      View Assignment Resource
                    </Group>
                  </Anchor>
                </Box>
              </>
            )}
          </Stack>
        </Card>

        {/* Submission Section */}
        {assignmentData.is_completed ? (
          <Card
            withBorder
            p="lg"
            style={{ backgroundColor: "var(--mantine-color-green-0)" }}
          >
            <Center>
              <Stack align="center">
                <IconCheck size={48} color="var(--mantine-color-green-6)" />
                <Title order={3} c="green">
                  Assignment Completed
                </Title>
                <Text ta="center">
                  You have successfully submitted this assignment.
                </Text>
                {assignmentData.completed_at && (
                  <Text size="sm" c="dimmed">
                    Submitted on:{" "}
                    {new Date(assignmentData.completed_at).toLocaleDateString(
                      "en-US",
                      {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </Text>
                )}
              </Stack>
            </Center>
          </Card>
        ) : (
          <Card withBorder p="lg">
            <Stack>
              <Group>
                <IconUpload size={20} />
                <Title order={3}>Submit Your Assignment</Title>
              </Group>

              {/* Text Submission */}
              <Box>
                <Text fw={500} mb="xs">
                  Written Response
                </Text>
                <Textarea
                  placeholder="Type your assignment answer here..."
                  value={submissionText}
                  onChange={(e) => setSubmissionText(e.currentTarget.value)}
                  minRows={6}
                  autosize
                />
              </Box>

              <Text ta="center" c="dimmed" fw={500}>
                OR
              </Text>

              {/* File Upload */}
              <Box>
                <Text fw={500} mb="xs">
                  File Upload
                </Text>
                <FileInput
                  placeholder="Choose file..."
                  value={selectedFile}
                  onChange={handleFileSelect}
                  accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                  leftSection={<IconFile size={16} />}
                  clearable
                />
                {selectedFile && (
                  <Group mt="xs" justify="space-between">
                    <Text size="sm" c="dimmed">
                      Selected: {selectedFile.name} (
                      {Math.round(selectedFile.size / 1024)} KB)
                    </Text>
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      size="sm"
                      onClick={() => setSelectedFile(null)}
                    >
                      <IconTrash size={14} />
                    </ActionIcon>
                  </Group>
                )}
                <Text size="xs" c="dimmed" mt="xs">
                  Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max 10MB)
                </Text>
              </Box>

              {/* Guidelines */}
              <Alert color="yellow" variant="light">
                <Text fw={500} mb="xs">
                  Submission Guidelines:
                </Text>
                <Text size="sm">
                  • Read the assignment instructions carefully
                  <br />
                  • Provide clear and detailed answers
                  <br />
                  • Check your work before submitting
                  <br />
                  • You can provide text answers, upload files, or both
                  <br />• Once submitted, you cannot edit your assignment
                </Text>
              </Alert>

              {/* Upload Progress */}
              {submitting && uploadProgress > 0 && (
                <Box>
                  <Group justify="space-between" mb="xs">
                    <Text size="sm">Uploading...</Text>
                    <Text size="sm">{uploadProgress}%</Text>
                  </Group>
                  <Progress value={uploadProgress} size="sm" />
                </Box>
              )}

              {/* Submit Button */}
              <Button
                size="lg"
                onClick={handleSubmit}
                loading={submitting}
                disabled={
                  submitting || (!submissionText.trim() && !selectedFile)
                }
                leftSection={<IconCheck size={16} />}
              >
                {submitting ? "Submitting Assignment..." : "Submit Assignment"}
              </Button>
            </Stack>
          </Card>
        )}

        {history.length > 0 && (
          <Card withBorder p="lg">
            <Title order={4} mb="md">
              Submission History
            </Title>
            <Timeline active={history.length - 1} bulletSize={24} lineWidth={2}>
              {history.map((item) => (
                <Timeline.Item
                  key={item.submission_id}
                  title={`Attempt #${item.attempt_number}`}
                >
                  <Stack gap={4}>
                    <Text c="dimmed" size="xs">
                      Submitted on{" "}
                      {new Date(item.submitted_at).toLocaleString()}
                    </Text>

                    {/* [!] PERBAIKAN: Pisahkan Text dan Badge menggunakan Group */}
                    <Group gap="xs" align="center">
                      <Text size="sm" m={0}>
                        Status:
                      </Text>
                      <Badge
                        color={
                          item.status === "approved"
                            ? "green"
                            : item.status === "rejected"
                            ? "red"
                            : "yellow"
                        }
                      >
                        {item.status}
                      </Badge>
                    </Group>

                    {item.score !== null && (
                      <Text size="sm">Score: {item.score}</Text>
                    )}
                    {item.feedback && (
                      <Text size="sm">Feedback: {item.feedback}</Text>
                    )}
                  </Stack>
                </Timeline.Item>
              ))}
            </Timeline>
          </Card>
        )}

        {/* Form ini akan selalu muncul jika tugas belum 'approved' */}
        {lastSubmission?.status !== "approved" ? (
          <Card withBorder p="lg">
            <Stack>
              <Title order={3}>
                {isRejected
                  ? "Re-submit Your Assignment"
                  : "Submit Your Assignment"}
              </Title>
              {isRejected && (
                <Alert color="orange" title="Submission Rejected">
                  Your previous submission was rejected. Please review the
                  feedback and submit a revised version.
                </Alert>
              )}
              <Card withBorder p="lg">
                <Stack>
                  <Group>
                    <IconUpload size={20} />
                    <Title order={3}>Submit Your Assignment</Title>
                  </Group>

                  {/* Text Submission */}
                  <Box>
                    <Text fw={500} mb="xs">
                      Written Response
                    </Text>
                    <Textarea
                      placeholder="Type your assignment answer here..."
                      value={submissionText}
                      onChange={(e) => setSubmissionText(e.currentTarget.value)}
                      minRows={6}
                      autosize
                    />
                  </Box>

                  <Text ta="center" c="dimmed" fw={500}>
                    OR
                  </Text>

                  {/* File Upload */}
                  <Box>
                    <Text fw={500} mb="xs">
                      File Upload
                    </Text>
                    <FileInput
                      placeholder="Choose file..."
                      value={selectedFile}
                      onChange={handleFileSelect}
                      accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
                      leftSection={<IconFile size={16} />}
                      clearable
                    />
                    {selectedFile && (
                      <Group mt="xs" justify="space-between">
                        <Text size="sm" c="dimmed">
                          Selected: {selectedFile.name} (
                          {Math.round(selectedFile.size / 1024)} KB)
                        </Text>
                        <ActionIcon
                          color="red"
                          variant="subtle"
                          size="sm"
                          onClick={() => setSelectedFile(null)}
                        >
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Group>
                    )}
                    <Text size="xs" c="dimmed" mt="xs">
                      Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG (Max
                      10MB)
                    </Text>
                  </Box>

                  {/* Guidelines */}
                  <Alert color="yellow" variant="light">
                    <Text fw={500} mb="xs">
                      Submission Guidelines:
                    </Text>
                    <Text size="sm">
                      • Read the assignment instructions carefully
                      <br />
                      • Provide clear and detailed answers
                      <br />
                      • Check your work before submitting
                      <br />
                      • You can provide text answers, upload files, or both
                      <br />• Once submitted, you cannot edit your assignment
                    </Text>
                  </Alert>

                  {/* Upload Progress */}
                  {submitting && uploadProgress > 0 && (
                    <Box>
                      <Group justify="space-between" mb="xs">
                        <Text size="sm">Uploading...</Text>
                        <Text size="sm">{uploadProgress}%</Text>
                      </Group>
                      <Progress value={uploadProgress} size="sm" />
                    </Box>
                  )}

                  {/* Submit Button */}
                  <Button
                    size="lg"
                    onClick={handleSubmit}
                    loading={submitting}
                    disabled={
                      submitting || (!submissionText.trim() && !selectedFile)
                    }
                    leftSection={<IconCheck size={16} />}
                  >
                    {submitting
                      ? "Submitting Assignment..."
                      : "Submit Assignment"}
                  </Button>
                </Stack>
              </Card>
            </Stack>
          </Card>
        ) : (
          <Alert color="green" title="Assignment Approved">
            Congratulations! Your submission has been approved and graded.
          </Alert>
        )}
      </Stack>
    </Container>
  );
}
