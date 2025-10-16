// src\app\frontend\dashboard\student\learn\[enrollmentId]\page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { useRouter, useParams } from "next/navigation";
import {
  AppShell,
  Box,
  Button,
  Card,
  Container,
  Group,
  Image,
  Loader,
  NavLink,
  Paper,
  Progress,
  ScrollArea,
  Stack,
  Text,
  Title,
  Badge,
  Alert,
  Center,
  Divider,
  Anchor,
  SimpleGrid,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconCheck,
  IconFile,
  IconEdit,
  IconQuestionMark,
  IconAlertTriangle,
  IconCircleCheck,
  IconClock,
  IconDownload,
} from "@tabler/icons-react";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";
import { ReviewModal } from "../../features/review/components/ReviewModal";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
  loading: () => <div>Loading player...</div>,
}) as any;

interface MaterialDetail {
  submission: any;
  material_detail_id: number;
  material_detail_name: string;
  material_detail_type: number;
  material_detail_description: string;
  is_completed: boolean;
  materi_detail_url: string;
  is_free: boolean;
}

interface Quiz {
  quiz_id: number;
  quiz_title: string;
  quiz_description: string;
  passing_score: number;
  time_limit: number;
  max_attempts: number;
  last_attempt?: {
    score: number;
    status: string;
    attempt_number: number;
  } | null;
}

interface Material {
  material_id: number;
  material_name: string;
  material_description: string;
  details: MaterialDetail[];
  quizzes: Quiz[];
}

interface Course {
  course_id: number;
  course_title: string;
  course_description: string;
  instructor: { user_id: number; first_name: string; last_name: string };
  materials: Material[];
  progress_percentage: number;
  course_duration?: number;
}

interface LearningData {
  enrollment_id: number;
  course: Course;
  last_accessed?: { id: number; type: "detail" | "quiz" };
  learning_started_at?: string | null;
  access_expires_at?: string | null;
}

interface SelectedItem {
  type: "detail" | "quiz";
  id: number;
  material_id: number;
}

export default function LearnPage() {
  const router = useRouter();
  const params = useParams();
  const enrollmentId = params?.enrollmentId as string;

  const [data, setData] = useState<LearningData | null>(null);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);
  const [completingIds, setCompletingIds] = useState<Set<number>>(new Set());
  const [isStarting, setIsStarting] = useState(false);

  const [
    reviewModalOpened,
    { open: openReviewModal, close: closeReviewModal },
  ] = useDisclosure(false);
  const [certificate, setCertificate] = useState<any>(null);

  const handleClaimCertificate = async () => {
    try {
      const response = await fetch(
        `/api/dashboard/student/learn/${enrollmentId}/claim-certificate`,
        // src\app\api\dashboard\student\learn\[enrollmentId]\claim-certificate
        { method: "POST" }
      );
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to claim certificate");
      }
      const data = await response.json();
      setCertificate(data.certificate);
      notifications.show({
        title: "Congratulations!",
        message: "You have earned a certificate!",
        color: "green",
      });
      openReviewModal(); // Buka modal review setelah berhasil klaim
    } catch (err: any) {
      notifications.show({
        title: "Error",
        message: err.message,
        color: "red",
      });
    }
  };

  const handleResetCourse = async () => {
    if (
      window.confirm(
        "Are you sure you want to reset your progress for this course? This action cannot be undone."
      )
    ) {
      try {
        const response = await fetch(
          `/api/dashboard/student/enrollment/${enrollmentId}/reset`,
          { method: "POST" }
        );
        if (!response.ok) throw new Error("Failed to reset progress");
        notifications.show({
          title: "Success",
          message: "Your progress has been reset.",
          color: "blue",
        });
        window.location.reload();
      } catch (err: any) {
        notifications.show({
          title: "Error",
          message: err.message,
          color: "red",
        });
      }
    }
  };

  // Save last opened item to localStorage
  const saveLastOpenedItem = (item: SelectedItem) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(`last-opened-${enrollmentId}`, JSON.stringify(item));
    }
  };

  // Track item click
  const trackItemClick = (item: SelectedItem) => {
    saveLastOpenedItem(item);
    fetch(`/api/dashboard/student/learn/${enrollmentId}/track`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId: item.id, itemType: item.type }),
    }).catch(console.error);
  };

  // 🔧 PERBAIKAN: Fungsi untuk fetch data (tanpa auto-select item)
  const fetchData = useCallback(async () => {
    if (!enrollmentId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/dashboard/student/learn/${enrollmentId}`
      );

      if (response.status === 403) {
        const errData = await response.json();
        throw new Error(errData.error || "Access has expired.");
      }

      if (!response.ok) throw new Error("Failed to load learning data");

      const result: LearningData = await response.json();
      if (!result?.course) throw new Error("Invalid learning data");

      setData(result);
      return result; // Return data untuk digunakan di useEffect
    } catch (err: any) {
      setError(err.message || "An error occurred");
      return null;
    } finally {
      setLoading(false);
    }
  }, [enrollmentId]);

  // 🔧 PERBAIKAN: useEffect yang menangani initial load dan auto-select
  useEffect(() => {
    if (!enrollmentId) return;

    const loadAndSelect = async () => {
      const result = await fetchData();
      if (!result) return;

      // Hanya auto-select jika belum ada item yang dipilih
      if (!selectedItem) {
        let itemToSelect: SelectedItem | null = null;

        // 1. Cek localStorage
        const storedItemJson = localStorage.getItem(
          `last-opened-${enrollmentId}`
        );
        if (storedItemJson) {
          try {
            itemToSelect = JSON.parse(storedItemJson);
          } catch (e) {
            console.error("Failed to parse stored item:", e);
          }
        }

        // 2. Fallback ke last_accessed dari API
        if (
          !itemToSelect &&
          result.last_accessed?.id &&
          result.last_accessed?.type
        ) {
          const material = result.course.materials.find(
            (m: Material) =>
              m.details?.some(
                (d) => d.material_detail_id === result.last_accessed?.id
              ) ||
              m.quizzes?.some((q) => q.quiz_id === result.last_accessed?.id)
          );

          if (material) {
            itemToSelect = {
              type: result.last_accessed.type,
              id: result.last_accessed.id,
              material_id: material.material_id,
            };
          }
        }

        // 3. Fallback ke item pertama
        if (!itemToSelect && result.course.materials?.length > 0) {
          const firstMaterial = result.course.materials[0];
          if (firstMaterial.details?.length > 0) {
            itemToSelect = {
              type: "detail",
              id: firstMaterial.details[0].material_detail_id,
              material_id: firstMaterial.material_id,
            };
          } else if (firstMaterial.quizzes?.length > 0) {
            itemToSelect = {
              type: "quiz",
              id: firstMaterial.quizzes[0].quiz_id,
              material_id: firstMaterial.material_id,
            };
          }
        }

        if (itemToSelect) {
          setSelectedItem(itemToSelect);
          if (!storedItemJson) {
            saveLastOpenedItem(itemToSelect);
          }
        }
      }
    };

    loadAndSelect();
  }, [enrollmentId]);

  // Timer countdown
  useEffect(() => {
    if (data?.access_expires_at) {
      const intervalId = setInterval(() => {
        const expiryDate = new Date(data.access_expires_at!).getTime();
        const now = new Date().getTime();
        const distance = expiryDate - now;

        if (distance < 0) {
          setTimeLeft("Expired");
          clearInterval(intervalId);
        } else {
          const days = Math.floor(distance / (1000 * 60 * 60 * 24));
          const hours = Math.floor(
            (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          );
          const minutes = Math.floor(
            (distance % (1000 * 60 * 60)) / (1000 * 60)
          );
          setTimeLeft(`${days}d ${hours}h ${minutes}m`);
        }
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [data?.access_expires_at]);

  // 🔧 PERBAIKAN UTAMA: handleStartLearning dengan refresh data
  const handleStartLearning = async () => {
    if (!enrollmentId || !data) {
      notifications.show({
        title: "Error",
        message: "Cannot start, data is not ready.",
        color: "red",
      });
      return;
    }

    try {
      setIsStarting(true);
      const response = await fetch(
        `/api/dashboard/student/learn/${enrollmentId}/start`,
        { method: "POST" }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Server responded with an error.");
      }

      const result = await response.json();
      console.log("✅ Start Learning Response:", result);

      notifications.show({
        title: "Course Started!",
        message: "Your access timer is now running.",
        color: "green",
      });

      // 🎯 PERBAIKAN: Refresh data dari server untuk mendapatkan timestamp yang benar
      const refreshedData = await fetchData();

      if (refreshedData) {
        // Auto-select item pertama setelah start
        if (refreshedData.course.materials?.length > 0) {
          const firstMaterial = refreshedData.course.materials[0];
          let itemToSelect: SelectedItem | null = null;

          if (firstMaterial.details?.length > 0) {
            itemToSelect = {
              type: "detail",
              id: firstMaterial.details[0].material_detail_id,
              material_id: firstMaterial.material_id,
            };
          } else if (firstMaterial.quizzes?.length > 0) {
            itemToSelect = {
              type: "quiz",
              id: firstMaterial.quizzes[0].quiz_id,
              material_id: firstMaterial.material_id,
            };
          }

          if (itemToSelect) {
            console.log("🎯 Auto-selecting first item:", itemToSelect);
            setSelectedItem(itemToSelect);
            saveLastOpenedItem(itemToSelect);

            setTimeout(() => {
              trackItemClick(itemToSelect!);
            }, 100);
          }
        }
      }
    } catch (err: any) {
      console.error("❌ Start Learning Error:", err);
      notifications.show({
        title: "Failed to Start Timer",
        message: err.message,
        color: "red",
      });
    } finally {
      setIsStarting(false);
    }
  };

  const handleMarkAsComplete = async (materialDetailId: number) => {
    if (!data?.course || completingIds.has(materialDetailId)) return;

    setCompletingIds((prev) => new Set(prev.add(materialDetailId)));

    try {
      const response = await fetch("/api/dashboard/student/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          enrollmentId: data.enrollment_id,
          courseId: data.course.course_id,
          materialDetailId: materialDetailId,
          isCompleted: true,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save progress");
      }

      // Update local state
      setData((prevData) => {
        if (!prevData) return prevData;

        const updatedData = {
          ...prevData,
          course: {
            ...prevData.course,
            materials: prevData.course.materials.map((material) => ({
              ...material,
              details: material.details.map((detail) => {
                if (detail.material_detail_id === materialDetailId) {
                  return { ...detail, is_completed: true };
                }
                return detail;
              }),
            })),
          },
        };

        // Recalculate progress
        let totalMaterials = 0;
        let completedMaterials = 0;

        updatedData.course.materials.forEach((material) => {
          material.details.forEach((detail) => {
            totalMaterials++;
            if (detail.is_completed) completedMaterials++;
          });
        });

        updatedData.course.progress_percentage =
          totalMaterials > 0
            ? Math.round((completedMaterials / totalMaterials) * 100)
            : 0;

        return updatedData;
      });
    } catch (err: any) {
      console.error("Error marking as complete:", err);
    } finally {
      setCompletingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(materialDetailId);
        return newSet;
      });
    }
  };

  const getCurrentItem = () => {
    if (!selectedItem || !data?.course?.materials) return null;

    for (const material of data.course.materials) {
      if (selectedItem.type === "detail") {
        const detail = material.details?.find(
          (d) => d.material_detail_id === selectedItem.id
        );
        if (detail) return { ...detail, type: "detail" as const, material };
      } else if (selectedItem.type === "quiz") {
        const quiz = material.quizzes?.find(
          (q) => q.quiz_id === selectedItem.id
        );
        if (quiz) return { ...quiz, type: "quiz" as const, material };
      }
    }
    return null;
  };

  const getFileType = (url: string) => {
    if (!url) return "unknown";
    const extension = url.split(".").pop()?.toLowerCase();
    if (["mp4", "webm", "ogg", "mov"].includes(extension || "")) return "video";
    if (["pdf"].includes(extension || "")) return "pdf";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(extension || ""))
      return "image";

    if (
      url.includes("youtube.com") ||
      url.includes("youtu.be") ||
      url.includes("vimeo.com") ||
      url.includes("twitch.tv") ||
      ["mp4", "webm", "ogg", "mov", "m3u8"].includes(extension || "")
    ) {
      return "video";
    }
    return "unknown";
  };

  const renderVideoPlayer = (url: string) => {
    const isDirectVideo = url.match(/\.(mp4|webm|ogg|mov)$/i);
    const isYouTube = url.includes("youtube.com") || url.includes("youtu.be");
    const isVimeo = url.includes("vimeo.com");

    const getYouTubeVideoId = (url: string) => {
      if (url.includes("youtu.be/")) {
        return url.split("youtu.be/")[1]?.split(/[?&]/)[0];
      }
      if (url.includes("youtube.com/watch?v=")) {
        return url.split("v=")[1]?.split(/[?&]/)[0];
      }
      if (url.includes("youtube.com/embed/")) {
        return url.split("embed/")[1]?.split(/[?&]/)[0];
      }
      if (url.includes("youtube.com/v/")) {
        return url.split("v/")[1]?.split(/[?&]/)[0];
      }
      return null;
    };

    const getVimeoVideoId = (url: string) => {
      const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      return match ? match[1] : null;
    };

    if (isDirectVideo) {
      return (
        <video
          controls
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          <source src={url} />
          Your browser does not support the video tag.
        </video>
      );
    }

    if (isYouTube) {
      const videoId = getYouTubeVideoId(url);
      if (videoId && videoId.length === 11) {
        return (
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            allowFullScreen
            title="YouTube Video"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
        );
      }
    }

    if (isVimeo) {
      const videoId = getVimeoVideoId(url);
      if (videoId) {
        return (
          <iframe
            src={`https://player.vimeo.com/video/${videoId}?title=0&byline=0&portrait=0`}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            allowFullScreen
            title="Vimeo Video"
            allow="autoplay; fullscreen; picture-in-picture"
          />
        );
      }
    }

    try {
      return (
        <ReactPlayer
          url={url}
          width="100%"
          height="100%"
          controls={true}
          playing={false}
          style={{ position: "absolute", top: 0, left: 0 }}
        />
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      return (
        <video
          controls
          src={url}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            top: 0,
            left: 0,
          }}
        >
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  const renderContentByType = (detail: MaterialDetail, fileType: string) => {
    switch (detail.material_detail_type) {
      case 1:
      case 3:
        return (
          <Box pos="relative" style={{ aspectRatio: "16/9" }} bg="dark">
            {renderVideoPlayer(detail.materi_detail_url)}
          </Box>
        );
      case 2:
        if (fileType === "pdf") {
          return (
            <Paper withBorder>
              <iframe
                src={detail.materi_detail_url}
                style={{ width: "100%", height: 600, border: "none" }}
                title={detail.material_detail_name}
              />
              <Group justify="center" p="md">
                <Anchor href={detail.materi_detail_url} target="_blank">
                  Open in New Tab
                </Anchor>
              </Group>
            </Paper>
          );
        } else if (fileType === "image") {
          return (
            <Paper p="md" withBorder ta="center">
              <Image
                src={detail.materi_detail_url}
                alt={detail.material_detail_name}
                style={{ maxWidth: "100%" }}
              />
            </Paper>
          );
        } else {
          return (
            <Paper
              p="xl"
              withBorder
              ta="center"
              style={{ border: "2px dashed var(--mantine-color-gray-4)" }}
            >
              <Stack align="center">
                <IconFile size={48} />
                <Text>Document: {detail.material_detail_name}</Text>
                <Button
                  component="a"
                  href={detail.materi_detail_url}
                  target="_blank"
                >
                  Open Document
                </Button>
              </Stack>
            </Paper>
          );
        }
      case 4:
        const submission = detail.submission;

        return (
          <Card withBorder>
            <Card.Section withBorder inheritPadding py="xs">
              <Group>
                <IconEdit />
                <Text fw={500}>Assignment</Text>
              </Group>
            </Card.Section>

            <Text mt="sm" mb="md">
              {detail.material_detail_description}
            </Text>

            {submission ? (
              // Tampilan JIKA TUGAS SUDAH DIKUMPULKAN
              <Stack>
                <Divider label="Your Submission" labelPosition="center" />
                <Alert
                  variant="light"
                  color={
                    submission.status === "approved"
                      ? "green"
                      : submission.status === "rejected"
                      ? "red"
                      : "yellow"
                  }
                  title={`Status: ${
                    submission.status.charAt(0).toUpperCase() +
                    submission.status.slice(1)
                  }`}
                >
                  <Text size="sm">
                    Submitted on:{" "}
                    {new Date(submission.submitted_at).toLocaleString()}
                  </Text>
                </Alert>

                {/* Tampilkan Nilai & Feedback jika sudah dinilai */}
                {(submission.status === "approved" ||
                  submission.status === "rejected") && (
                  <Paper withBorder p="md" radius="md">
                    <Group justify="space-between">
                      <Stack gap={0}>
                        <Text size="sm" c="dimmed">
                          Score
                        </Text>
                        <Text
                          size="xl"
                          fw={700}
                          c={submission.score >= 75 ? "green" : "red"}
                        >
                          {submission.score}
                        </Text>
                      </Stack>
                      <Stack gap={0} style={{ flex: 1 }}>
                        <Text size="sm" c="dimmed">
                          Lecturer Feedback
                        </Text>
                        <Text size="sm">
                          {submission.feedback || "No feedback provided."}
                        </Text>
                      </Stack>
                    </Group>
                  </Paper>
                )}

                {/* Tombol Download */}
                {submission.file_path && (
                  <Button
                    component="a"
                    href={submission.file_path}
                    target="_blank"
                    download
                    variant="outline"
                    leftSection={<IconDownload size={16} />}
                  >
                    Download Your Submission
                  </Button>
                )}

                {submission.status === "rejected" && (
                  <>
                    <Divider my="sm" label="Action" labelPosition="center" />
                    <Button
                      onClick={() =>
                        router.push(
                          `/frontend/dashboard/student/learn/${enrollmentId}/assignment/${detail.material_detail_id}`
                        )
                      }
                      color="orange"
                    >
                      Re-submit Assignment
                    </Button>
                  </>
                )}
              </Stack>
            ) : (
              <Button
                onClick={() =>
                  router.push(
                    `/frontend/dashboard/student/learn/${enrollmentId}/assignment/${detail.material_detail_id}`
                  )
                }
              >
                Open Assignment
              </Button>
            )}
          </Card>
        );

      default:
        if (fileType === "video") {
          return (
            <Box pos="relative" style={{ aspectRatio: "16/9" }} bg="dark">
              {renderVideoPlayer(detail.materi_detail_url)}
            </Box>
          );
        } else {
          return (
            <Paper p="xl" withBorder ta="center">
              <Stack align="center">
                <Text>This content cannot be displayed in the browser.</Text>
                <Button
                  component="a"
                  href={detail.materi_detail_url}
                  target="_blank"
                >
                  Open File
                </Button>
              </Stack>
            </Paper>
          );
        }
    }
  };

  const renderContent = () => {
    if (error) {
      return (
        <Center h="calc(100vh - 200px)">
          <Alert
            color="red"
            title="Akses Bermasalah"
            icon={<IconAlertTriangle />}
          >
            <Text>{error}</Text>
            {error.toLowerCase().includes("expired") && (
              <Button
                mt="md"
                variant="default"
                onClick={() => router.push("/frontend/dashboard/student")}
              >
                Back to Dashboard
              </Button>
            )}
          </Alert>
        </Center>
      );
    }

    if (loading && !data) {
      return (
        <Center h="calc(100vh - 200px)">
          <Loader />
        </Center>
      );
    }

    // 🔧 PERBAIKAN: Cek learning_started_at dengan lebih teliti
    if (data && !data.learning_started_at) {
      return (
        <Center h="calc(100vh - 200px)">
          <Stack align="center">
            <Title>Ready to Start This Course?</Title>
            <Text c="dimmed" ta="center">
              Your access timer of **{data.course.course_duration || "N/A"}{" "}
              days** will begin once you click start.
            </Text>
            <Button
              size="lg"
              onClick={handleStartLearning}
              loading={isStarting}
            >
              {isStarting ? "Starting..." : "Start Learning"}
            </Button>
          </Stack>
        </Center>
      );
    }

    const currentItem = getCurrentItem();

    if (!currentItem) {
      return (
        <Center h={400}>
          <Stack align="center">
            <Title order={3} c="dimmed">
              Select material to start learning
            </Title>
            <Text c="dimmed">
              Choose a material or quiz from the sidebar to begin.
            </Text>
          </Stack>
        </Center>
      );
    }

    if (currentItem.type === "detail") {
      const detail = currentItem as MaterialDetail & {
        type: "detail";
        material: Material;
      };
      const isCompleting = completingIds.has(detail.material_detail_id);
      const fileType = getFileType(detail.materi_detail_url);

      return (
        <Stack>
          <Group align="center" gap="sm">
            <IconFile size={24} />
            <Title order={2}>{detail.material_detail_name}</Title>
          </Group>
          {detail.material_detail_description && (
            <Text c="dimmed" size="sm">
              {detail.material_detail_description}
            </Text>
          )}

          {renderContentByType(detail, fileType)}

          <Group justify="center" mt="xl">
            {!detail.is_completed && (
              <Button
                color="green"
                loading={isCompleting}
                onClick={() => handleMarkAsComplete(detail.material_detail_id)}
                leftSection={<IconCheck size={16} />}
              >
                {isCompleting ? "Marking Complete..." : "Mark as Complete"}
              </Button>
            )}

            {detail.is_completed && (
              <Badge
                color="green"
                size="lg"
                leftSection={<IconCheck size={14} />}
              >
                Completed
              </Badge>
            )}
          </Group>
        </Stack>
      );
    }

    if (currentItem.type === "quiz") {
      const quiz = currentItem as Quiz & {
        type: "quiz";
        material: Material;
      };

      const hasAttempt = quiz.last_attempt;
      const hasPassed = hasAttempt && quiz.last_attempt?.status === "passed";
      const hasFailed = hasAttempt && !hasPassed;
      const canRetake =
        !hasPassed &&
        (quiz.max_attempts === 0 ||
          (quiz.last_attempt?.attempt_number || 0) < quiz.max_attempts);

      const handleStart = () => {
        router.push(
          `/frontend/dashboard/student/learn/${enrollmentId}/quiz/${quiz.quiz_id}`
        );
      };

      return (
        <Stack gap="xl" align="center">
          <Stack gap={4} align="center" ta="center">
            <Title order={1}>{quiz.quiz_title}</Title>
            <Text c="dimmed" maw={600}>
              {quiz.quiz_description ||
                "Kerjakan kuis dengan benar, perhatikan setiap aturan yang diberikan."}
            </Text>
          </Stack>

          <Card
            withBorder
            p="xl"
            radius="lg"
            w="100%"
            style={{ backgroundColor: "var(--mantine-color-gray-1)" }}
          >
            {hasAttempt ? (
              <Stack align="center">
                <Title order={4} c="dimmed">
                  Your Last Score
                </Title>
                <Badge
                  size="xl"
                  radius="sm"
                  color={hasPassed ? "green" : "red"}
                >
                  {quiz.last_attempt?.status.toUpperCase()}
                </Badge>
                <Text size="4rem" fw={700} c={hasPassed ? "green" : "red"}>
                  {quiz.last_attempt?.score}
                </Text>
                <Text c="dimmed" mt={-10}>
                  out of 100
                </Text>
                <Text size="xs" c="dimmed">
                  Attempt #{quiz.last_attempt?.attempt_number}
                </Text>
              </Stack>
            ) : (
              <Stack align="center">
                <Title order={4} c="dimmed" mb="lg">
                  Informasi Kuis
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" w="100%">
                  <Stack align="center" gap={0}>
                    <Text size="sm" c="dimmed">
                      Passing Score
                    </Text>
                    <Text size="xl" fw={700}>
                      {quiz.passing_score}%
                    </Text>
                  </Stack>
                  <Stack align="center" gap={0}>
                    <Text size="sm" c="dimmed">
                      Time Limit
                    </Text>
                    <Text size="xl" fw={700}>
                      {quiz.time_limit > 0
                        ? `${quiz.time_limit} Menit`
                        : "No limit"}
                    </Text>
                  </Stack>
                  <Stack align="center" gap={0}>
                    <Text size="sm" c="dimmed">
                      Max Attempts
                    </Text>
                    <Text size="xl" fw={700}>
                      {quiz.max_attempts > 0 ? quiz.max_attempts : "Unlimited"}
                    </Text>
                  </Stack>
                </SimpleGrid>
              </Stack>
            )}
          </Card>

          <Group mt="md">
            {!hasAttempt && (
              <Button color="green" size="lg" onClick={handleStart}>
                Start Quiz
              </Button>
            )}
            {hasFailed && canRetake && (
              <Button color="orange" size="lg" onClick={handleStart}>
                Retake Quiz (Attempt #
                {(quiz.last_attempt?.attempt_number || 0) + 1})
              </Button>
            )}
            {hasPassed && (
              <Button color="gray" size="lg" disabled>
                Passed ✓
              </Button>
            )}
            {hasFailed && !canRetake && (
              <Button color="red" size="lg" disabled>
                Max Attempts Reached
              </Button>
            )}
          </Group>
        </Stack>
      );
    }

    return null;
  };

  if (loading && !data) {
    return (
      <Center h="100vh">
        <Stack align="center">
          <Loader size="lg" />
          <Text>Loading learning data...</Text>
        </Stack>
      </Center>
    );
  }

  if (error && !data) {
    return (
      <Center h="100vh">
        <Alert
          color="red"
          title="Failed to Load Data"
          icon={<IconAlertTriangle />}
        >
          <Text>{error}</Text>
          <Button mt="md" onClick={() => fetchData()}>
            Try Again
          </Button>
        </Alert>
      </Center>
    );
  }

  if (!data) {
    return (
      <Center h="100vh">
        <Text c="dimmed">No learning data found</Text>
      </Center>
    );
  }

  return (
    <>
      <ReviewModal
        opened={reviewModalOpened}
        onClose={closeReviewModal}
        courseId={data?.course.course_id || null}
      />
      <AppShell navbar={{ width: 350, breakpoint: "md" }}>
        <AppShell.Navbar>
          <ScrollArea>
            <Stack p="md">
              <Button
                variant="subtle"
                leftSection={<IconArrowLeft size={16} />}
                onClick={() => router.push("/frontend/dashboard/student")}
              >
                Back to Dashboard
              </Button>

              <Stack gap="xs">
                <Title order={3}>{data.course.course_title}</Title>
                <Text size="sm" c="dimmed">
                  By:{" "}
                  {`${data.course.instructor?.first_name || ""} ${
                    data.course.instructor?.last_name || ""
                  }`.trim()}
                </Text>

                <Box>
                  <Text size="sm" mb={5}>
                    Progress: {data.course.progress_percentage}%
                  </Text>
                  <Progress
                    value={data.course.progress_percentage}
                    color="green"
                  />
                </Box>
              </Stack>

              {timeLeft && (
                <Box p="md">
                  <Badge
                    fullWidth
                    variant="light"
                    color={timeLeft === "Expired" ? "red" : "blue"}
                    leftSection={<IconClock size={14} />}
                  >
                    Time Left: {timeLeft}
                  </Badge>
                </Box>
              )}

              <Divider my="md" />

              {/* [!] BLOK KONDISIONAL BARU DI SIDEBAR */}
              {data?.course.progress_percentage === 100 ? (
                <Stack>
                  <Button
                    color="teal"
                    onClick={handleClaimCertificate}
                    disabled={!!certificate}
                  >
                    {certificate ? "Certificate Claimed" : "Claim Certificate"}
                  </Button>
                </Stack>
              ) : data?.access_expires_at === "Expired" ? (
                <Stack>
                  <Alert color="red" title="Access Expired">
                    Your access has expired. Reset to start over.
                  </Alert>
                  <Button color="orange" onClick={handleResetCourse}>
                    Reset Course
                  </Button>
                </Stack>
              ) : null}

              {data?.course.materials?.map((material) => (
                <Stack key={material.material_id} gap={4}>
                  <Text fw={600} size="sm">
                    {material.material_name}
                  </Text>
                  {material.material_description && (
                    <Text size="xs" c="dimmed" fs="italic">
                      {material.material_description}
                    </Text>
                  )}

                  {material.details?.map((detail) => {
                    const isSelected =
                      selectedItem?.id === detail.material_detail_id &&
                      selectedItem?.type === "detail";
                    return (
                      <NavLink
                        key={detail.material_detail_id}
                        active={isSelected}
                        label={
                          <Text size="sm">{detail.material_detail_name}</Text>
                        }
                        leftSection={
                          detail.is_completed ? (
                            <IconCircleCheck size={16} color="green" />
                          ) : (
                            <IconFile size={16} />
                          )
                        }
                        onClick={() => {
                          const newItem: SelectedItem = {
                            type: "detail",
                            id: detail.material_detail_id,
                            material_id: material.material_id,
                          };
                          setSelectedItem(newItem);
                          trackItemClick(newItem);
                        }}
                      />
                    );
                  })}

                  {material.quizzes?.map((quiz: any) => {
                    const isSelected =
                      selectedItem?.id === quiz.quiz_id &&
                      selectedItem?.type === "quiz";
                    const hasPassed = quiz.last_attempt?.status === "passed";
                    return (
                      <NavLink
                        key={quiz.quiz_id}
                        active={isSelected}
                        disabled={hasPassed}
                        label={
                          <Stack gap={0}>
                            <Text size="sm">{quiz.quiz_title}</Text>
                            {quiz.last_attempt ? (
                              <Text size="xs" c={hasPassed ? "green" : "red"}>
                                Score: {quiz.last_attempt.score}%
                              </Text>
                            ) : (
                              <Text size="xs" c="dimmed">
                                Min Score: {quiz.passing_score}%
                              </Text>
                            )}
                          </Stack>
                        }
                        leftSection={
                          hasPassed ? (
                            <IconCircleCheck size={16} color="green" />
                          ) : (
                            <IconQuestionMark size={16} />
                          )
                        }
                        onClick={() => {
                          if (!hasPassed) {
                            const newItem: SelectedItem = {
                              type: "quiz",
                              id: quiz.quiz_id,
                              material_id: material.material_id,
                            };
                            setSelectedItem(newItem);
                            trackItemClick(newItem);
                          }
                        }}
                      />
                    );
                  })}
                </Stack>
              ))}
            </Stack>
          </ScrollArea>
        </AppShell.Navbar>

        <AppShell.Main>
          <Container size="lg" py="xl">
            {renderContent()}
          </Container>
        </AppShell.Main>
      </AppShell>
    </>
  );
}
