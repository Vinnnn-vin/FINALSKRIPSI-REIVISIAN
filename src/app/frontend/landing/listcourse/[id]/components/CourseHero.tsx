// src\app\frontend\landing\listcourse\[id]\components\CourseHero.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Container,
  Grid,
  GridCol,
  Title,
  Text,
  Button,
  Badge,
  Group,
  Stack,
  Card,
  Avatar,
  Rating,
  Box,
  Image,
  Anchor,
  ThemeIcon,
} from "@mantine/core";
import {
  IconArrowLeft,
  IconUsers,
  IconCalendar,
  IconPlayerPause,
  IconTrophy,
  IconLogin,
  IconPlayerPlay,
  } from "@tabler/icons-react";

interface CourseHeroProps {
  courseData: any;
}

export const CourseHero: React.FC<CourseHeroProps> = ({ courseData }) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Handle preview click with authentication check
  const handlePreviewClick = () => {
    if (status === "unauthenticated") {
      // Redirect to login page with callback URL
      const callbackUrl = encodeURIComponent(window.location.pathname);
      router.push(`/frontend/auth/login?callbackUrl=${callbackUrl}`);
      return;
    }

    if (status === "authenticated") {
      // Redirect to course preview
      const courseId = courseData?.course_id || courseData?.id;
      router.push(`/frontend/course/preview/${courseId}`);
    }
  };

  return (
    <Box
      style={{
        background:
          "linear-gradient(135deg, #1e3a8a 0%, #3b82f6 50%, #06b6d4 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage:
            "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%)",
        }}
      />

      <Container size="xl" py={60} style={{ position: "relative" }}>
        <Button
          leftSection={<IconArrowLeft size={16} />}
          variant="white"
          color="dark"
          mb="xl"
          radius="xl"
          onClick={() => router.back()}
        >
          Kembali ke Daftar Kursus
        </Button>

        <Grid>
          <GridCol span={{ base: 12, md: 7 }}>
            <Stack gap="xl" c="white">
              <Group>
                <Badge
                  variant="white"
                  color="blue"
                  size="lg"
                  radius="xl"
                  leftSection={<IconTrophy size={14} />}
                >
                  {courseData.category}
                </Badge>
                <Badge
                  variant="light"
                  color="yellow"
                  size="lg"
                  radius="xl"
                  tt="capitalize"
                >
                  {courseData.level}
                </Badge>
              </Group>

              <Title order={1} size="2.5rem" fw={700} lh={1.2}>
                {courseData.title || courseData.course_title}
              </Title>

              <Text size="xl" opacity={0.9} lh={1.4}>
                {courseData.subtitle || courseData.description || courseData.course_description}
              </Text>

              <Group gap="xl">
                <Group gap="xs">
                  <Rating
                    value={courseData.rating || 4.5}
                    fractions={2}
                    readOnly
                    size="md"
                    color="yellow"
                  />
                  <Text size="lg" fw={600}>
                    {courseData.rating || "4.5"}
                  </Text>
                  <Text size="sm" opacity={0.8}>
                    ({courseData.reviewCount?.toLocaleString() || "100"} ulasan)
                  </Text>
                </Group>

                <Group gap="xs">
                  <IconUsers size={20} />
                  <Text size="lg" fw={500}>
                    {courseData.students?.toLocaleString() || "1,000"} siswa
                  </Text>
                </Group>
              </Group>

              <Group>
                <Avatar
                  size="lg"
                  radius="xl"
                  color="white"
                  style={{ background: "rgba(255,255,255,0.2)" }}
                >
                  {courseData.instructor?.avatar || courseData.instructor?.name?.charAt(0) || "I"}
                </Avatar>
                <Stack gap={0}>
                  <Text fw={600} size="lg">
                    Dibuat oleh{" "}
                    <Anchor c="yellow.3" fw={700}>
                      {courseData.instructor?.name || "Instruktur"}
                    </Anchor>
                  </Text>
                  <Group gap="sm" opacity={0.8}>
                    <Text size="sm">
                      <IconCalendar
                        size={14}
                        style={{ display: "inline", marginRight: 4 }}
                      />
                      Diperbarui {courseData.lastUpdated ? formatDate(courseData.lastUpdated) : "Baru-baru ini"}
                    </Text>
                  </Group>
                </Stack>
              </Group>
            </Stack>
          </GridCol>

          <GridCol span={{ base: 12, md: 5 }}>
            <Card
              radius="xl"
              shadow="xl"
              padding={0}
              style={{
                overflow: "hidden",
                border: "2px solid rgba(255,255,255,0.2)",
                backdropFilter: "blur(10px)",
                background: "rgba(255,255,255,0.1)",
                cursor: "pointer",
              }}
              onClick={handlePreviewClick}
            >
              <Card.Section pos="relative">
                <Image
                  src={courseData.image || courseData.thumbnail || "/SIGNIN.jpg"}
                  alt={courseData.title || courseData.course_title}
                  height={280}
                  fit="cover"
                  fallbackSrc="/SIGNIN.jpg"
                />
                <Box
                  pos="absolute"
                  top="50%"
                  left="50%"
                  style={{ transform: "translate(-50%, -50%)" }}
                >
                  <ThemeIcon
                    size={80}
                    radius="50%"
                    color="white"
                    style={{
                      background: "rgba(255,255,255,0.9)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {status === "unauthenticated" ? (
                      <IconLogin size={32} color="#1e3a8a" />
                    ) : (
                      <IconPlayerPlay size={32} color="#1e3a8a" />
                    )}
                  </ThemeIcon>
                </Box>
                <Badge
                  pos="absolute"
                  top={16}
                  right={16}
                  color="dark"
                  variant="filled"
                  size="lg"
                  radius="xl"
                  style={{ backdropFilter: "blur(10px)" }}
                >
                  {status === "unauthenticated" ? "Login untuk Preview" : "Preview"}
                </Badge>
              </Card.Section>
            </Card>
            
            {/* Preview instruction text */}
            <Text ta="center" mt="md" size="sm" c="white" opacity={0.8}>
              {status === "unauthenticated" 
                ? "Klik untuk login dan melihat preview kursus"
                : "Klik untuk melihat preview kursus"}
            </Text>
          </GridCol>
        </Grid>
      </Container>
    </Box>
  );
};