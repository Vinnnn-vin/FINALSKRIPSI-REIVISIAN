// src\app\frontend\landing\listcourse\[id]\components\CourseContent.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Tabs,
  Stack,
  Paper,
  Group,
  Title,
  Text,
  ThemeIcon,
  Grid,
  GridCol,
  List,
  ListItem,
  Box,
  Button,
  Badge,
  Avatar,
  Rating,
  SimpleGrid,
  Alert,
} from "@mantine/core";
import {
  IconEye,
  IconPlayCard,
  IconUsers,
  IconStar,
  IconBookmark,
  IconCheck,
  IconClipboardList,
  IconClock,
  IconArrowRight,
  IconPlayerPause,
  IconFileText,
  IconLogin,
  IconPlayerPlay,
  IconLock,
  IconAlertCircle,
} from "@tabler/icons-react";

interface CourseContentProps {
  courseData: any;
  activeTab: string;
  onTabChange: (value: string) => void;
}

export const CourseContent: React.FC<CourseContentProps> = ({
  courseData,
  activeTab,
  onTabChange,
}) => {
  const [expandedSection, setExpandedSection] = useState<number | null>(0);
  const router = useRouter();
  const { data: session, status } = useSession();

  // Handle preview button click
  const handlePreviewClick = (lessonId?: string, isPreviewAvailable: boolean = false) => {
    if (status === "unauthenticated") {
      // Redirect to login page with callback URL
      const callbackUrl = encodeURIComponent(window.location.pathname);
      router.push(`/frontend/auth/login?callbackUrl=${callbackUrl}`);
      return;
    }

    if (status === "authenticated") {
      // Only allow preview if it's marked as preview available
      if (isPreviewAvailable) {
        const courseId = courseData?.course_id || courseData?.id;
        if (lessonId) {
          router.push(`/frontend/course/lesson/${courseId}/${lessonId}?preview=true`);
        } else {
          router.push(`/frontend/course/preview/${courseId}`);
        }
      }
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case "video":
        return <IconPlayerPause size={16} color="#228be6" />;
      case "text":
      case "document":
        return <IconFileText size={16} color="#fab005" />;
      case "assignment":
        return <IconClipboardList size={16} color="#fa5252" />;
      default:
        return <IconFileText size={16} />;
    }
  };

  // Handle tab change with null check
  const handleTabChange = (value: string | null) => {
    if (value !== null) {
      onTabChange(value);
    }
  };

  return (
    <Tabs value={activeTab} onChange={handleTabChange} radius="lg">
      <Tabs.List mb={30}>
        <Tabs.Tab value="overview" leftSection={<IconEye size={16} />}>
          Overview
        </Tabs.Tab>
        <Tabs.Tab value="curriculum" leftSection={<IconPlayCard size={16} />}>
          Kurikulum
        </Tabs.Tab>
        <Tabs.Tab value="instructor" leftSection={<IconUsers size={16} />}>
          Instruktur
        </Tabs.Tab>
        <Tabs.Tab value="reviews" leftSection={<IconStar size={16} />}>
          Reviews
        </Tabs.Tab>
      </Tabs.List>

      <Tabs.Panel value="overview">
        <Stack gap={30}>
          {/* Course Description */}
          <Paper shadow="sm" p={30} radius="xl" withBorder>
            <Stack gap="lg">
              <Group>
                <ThemeIcon size="lg" radius="xl" color="blue">
                  <IconBookmark size={20} />
                </ThemeIcon>
                <Title order={2} c="dark.8">
                  Tentang Kursus Ini
                </Title>
              </Group>
              <Text size="lg" lh={1.6} c="dark.6">
                {courseData.description || courseData.course_description || "Deskripsi kursus tidak tersedia."}
              </Text>
            </Stack>
          </Paper>

          {/* What You'll Learn */}
          <Paper shadow="sm" p={30} radius="xl" withBorder>
            <Stack gap="lg">
              <Group>
                <ThemeIcon size="lg" radius="xl" color="green">
                  <IconCheck size={20} />
                </ThemeIcon>
                <Title order={2} c="dark.8">
                  Yang Akan Anda Pelajari
                </Title>
              </Group>
              <Grid>
                {courseData.whatYouLearn?.map((item: string, index: number) => (
                  <GridCol key={index} span={{ base: 12, sm: 6 }}>
                    <Group align="flex-start" gap="sm">
                      <ThemeIcon size="sm" radius="xl" color="green" variant="light">
                        <IconCheck size={14} />
                      </ThemeIcon>
                      <Text size="md" c="dark.7">
                        {item}
                      </Text>
                    </Group>
                  </GridCol>
                ))}
              </Grid>
            </Stack>
          </Paper>

          {/* Requirements */}
          <Paper shadow="sm" p={30} radius="xl" withBorder>
            <Stack gap="lg">
              <Group>
                <ThemeIcon size="lg" radius="xl" color="orange">
                  <IconClipboardList size={20} />
                </ThemeIcon>
                <Title order={2} c="dark.8">
                  Persyaratan
                </Title>
              </Group>
              <List spacing="md" size="md" c="dark.6">
                {courseData.requirements?.map((req: string, index: number) => (
                  <ListItem key={index}>{req}</ListItem>
                ))}
              </List>
            </Stack>
          </Paper>
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="curriculum">
        <Stack gap="lg">
          {/* Authentication Alert */}
          {status === "unauthenticated" && (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              color="orange"
              variant="light"
              radius="lg"
            >
              Silakan login untuk mengakses preview pelajaran dan melihat kurikulum lengkap
            </Alert>
          )}

          <Paper shadow="sm" p={20} radius="xl" withBorder bg="blue.0">
            <Group justify="space-between">
              <Title order={2} c="blue.8">
                Konten Kursus
              </Title>
              <Group gap="xl">
                <Text size="sm" fw={500} c="dark.6">
                  <IconPlayCard size={16} style={{ display: "inline", marginRight: 4 }} />
                  {courseData.lessons} pelajaran
                </Text>
                <Text size="sm" fw={500} c="dark.6">
                  <IconClock size={16} style={{ display: "inline", marginRight: 4 }} />
                  {courseData.duration}
                </Text>
              </Group>
            </Group>
          </Paper>

          {courseData.curriculum?.map((section: any, sectionIndex: number) => (
            <Paper
              key={sectionIndex}
              shadow="sm"
              radius="xl"
              withBorder
              style={{ overflow: "hidden" }}
            >
              <Box
                p="lg"
                style={{
                  background: expandedSection === sectionIndex ? "#f8f9ff" : "white",
                  cursor: "pointer",
                  borderBottom: "1px solid #e9ecef",
                }}
                onClick={() =>
                  setExpandedSection(expandedSection === sectionIndex ? null : sectionIndex)
                }
              >
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon size="md" radius="xl" color="blue">
                      <Text size="sm" fw={700} c="white">
                        {sectionIndex + 1}
                      </Text>
                    </ThemeIcon>
                    <Title order={3} size="lg">
                      {section.section}
                    </Title>
                  </Group>
                  <Group gap="lg">
                    <Text size="sm" c="dimmed" fw={500}>
                      {section.lessons} pelajaran • {section.duration}
                    </Text>
                    <IconArrowRight
                      size={16}
                      style={{
                        transform:
                          expandedSection === sectionIndex
                            ? "rotate(90deg)"
                            : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    />
                  </Group>
                </Group>
              </Box>

              {expandedSection === sectionIndex && (
                <Box p="lg" pt={0}>
                  <Stack gap="md">
                    {section.items?.map((item: any, itemIndex: number) => (
                      <Group
                        key={itemIndex}
                        justify="space-between"
                        p="md"
                        style={{ background: "#f8f9fa", borderRadius: "12px" }}
                      >
                        <Group gap="md">
                          {item.free ? (
                            <IconPlayerPlay size={16} color="#10b981" />
                          ) : (
                            <IconLock size={16} color="#6b7280" />
                          )}
                          {getTypeIcon(item.type)}
                          <Text fw={500}>{item.title}</Text>
                          {item.free && (
                            <Badge size="sm" color="green" variant="light" radius="xl">
                              Preview Gratis
                            </Badge>
                          )}
                        </Group>
                        <Group gap="sm">
                          <Text size="sm" c="dimmed" fw={500}>
                            {item.duration}
                          </Text>
                          {item.free && (
                            <Button 
                              size="xs" 
                              variant="light" 
                              radius="xl"
                              leftSection={
                                status === "unauthenticated" ? (
                                  <IconLogin size={14} />
                                ) : (
                                  <IconPlayerPlay size={14} />
                                )
                              }
                              onClick={() => handlePreviewClick(item.id, item.free)}
                              loading={status === "loading"}
                              color={status === "unauthenticated" ? "orange" : "green"}
                            >
                              {status === "unauthenticated" ? "Login" : "Preview"}
                            </Button>
                          )}
                        </Group>
                      </Group>
                    ))}
                  </Stack>
                </Box>
              )}
            </Paper>
          ))}
        </Stack>
      </Tabs.Panel>

      <Tabs.Panel value="instructor">
        <Paper shadow="lg" p={30} radius="xl" withBorder>
          <Stack gap="xl">
            <Group align="flex-start">
              <Avatar
                size={80}
                radius="xl"
                style={{ background: "linear-gradient(45deg, #667eea, #764ba2)" }}
              >
                <Text size="xl" fw={700} c="white">
                  {courseData.instructor?.avatar || courseData.instructor?.name?.charAt(0) || "I"}
                </Text>
              </Avatar>
              <Stack gap="md" style={{ flex: 1 }}>
                <Title order={2}>{courseData.instructor?.name || "Instruktur"}</Title>
                <Text c="dimmed" size="lg" lh={1.5}>
                  {courseData.instructor?.bio || "Bio instruktur tidak tersedia."}
                </Text>

                <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="xl" mt="md">
                  <Paper p="lg" radius="lg" bg="yellow.0" ta="center">
                    <Stack gap="xs">
                      <Group justify="center">
                        <Rating value={courseData.instructor?.rating || 4.5} readOnly size="sm" />
                        <Text fw={700} size="lg">
                          {courseData.instructor?.rating || "4.5"}
                        </Text>
                      </Group>
                      <Text size="sm" c="dimmed">
                        Rating Instruktur
                      </Text>
                    </Stack>
                  </Paper>

                  <Paper p="lg" radius="lg" bg="blue.0" ta="center">
                    <Stack gap="xs">
                      <Text fw={700} size="xl" c="blue.7">
                        {courseData.instructor?.students?.toLocaleString() || "1,000+"}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Total Siswa
                      </Text>
                    </Stack>
                  </Paper>

                  <Paper p="lg" radius="lg" bg="green.0" ta="center">
                    <Stack gap="xs">
                      <Text fw={700} size="xl" c="green.7">
                        {courseData.instructor?.courses || "10+"}
                      </Text>
                      <Text size="sm" c="dimmed">
                        Total Kursus
                      </Text>
                    </Stack>
                  </Paper>
                </SimpleGrid>
              </Stack>
            </Group>
          </Stack>
        </Paper>
      </Tabs.Panel>

      <Tabs.Panel value="reviews">
        <Stack gap="xl">
          <Paper shadow="sm" p={20} radius="xl" withBorder bg="yellow.0">
            <Group justify="center">
              <Stack align="center" gap="xs">
                <Text size="3rem" fw={700} c="yellow.8">
                  {courseData.rating || "4.5"}
                </Text>
                <Rating value={courseData.rating || 4.5} readOnly size="lg" />
                <Text c="dimmed" fw={500}>
                  {courseData.reviewCount?.toLocaleString() || "100"} ulasan
                </Text>
              </Stack>
            </Group>
          </Paper>

          {courseData.reviews?.map((review: any, index: number) => (
            <Paper key={review.id || index} shadow="sm" p={25} radius="xl" withBorder>
              <Group align="flex-start" gap="lg">
                <Avatar
                  size="lg"
                  radius="xl"
                  style={{ background: "linear-gradient(45deg, #667eea, #764ba2)" }}
                >
                  {review.avatar || review.name?.charAt(0) || "U"}
                </Avatar>
                <Stack gap="sm" style={{ flex: 1 }}>
                  <Group justify="space-between">
                    <Text fw={600} size="lg">
                      {review.name || "Anonymous User"}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {review.date ? formatDate(review.date) : "Recently"}
                    </Text>
                  </Group>
                  <Rating value={review.rating || 5} readOnly size="md" />
                  <Text size="md" lh={1.6} c="dark.7">
                    {review.comment || "Kursus yang sangat baik!"}
                  </Text>
                </Stack>
              </Group>
            </Paper>
          )) || (
            <Paper shadow="sm" p={25} radius="xl" withBorder>
              <Text ta="center" c="dimmed">
                Belum ada ulasan untuk kursus ini.
              </Text>
            </Paper>
          )}
        </Stack>
      </Tabs.Panel>
    </Tabs>
  );
};