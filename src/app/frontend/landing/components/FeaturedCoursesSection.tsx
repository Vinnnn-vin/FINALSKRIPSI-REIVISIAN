// src\app\frontend\landing\components\FeaturedCoursesSection.tsx
"use client";

import React from "react";
import {
  Container,
  Stack,
  Box,
  Title,
  Text,
  Badge,
  Grid,
  GridCol,
  Center,
  Button,
  Alert,
} from "@mantine/core";
import { IconInfoCircle, IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import { CourseCard } from "./CourseCard";
import { FeaturedCoursesSectionProps } from "@/types/landing";

export const FeaturedCoursesSection: React.FC<FeaturedCoursesSectionProps> = ({
  courses,
  isLoading,
  error,
  mounted,
}) => {
  const validCourses = Array.isArray(courses) ? courses : [];

  const topCourses = validCourses.slice(0, 4);

  return (
    <Container size="xl" py="xl">
      <Stack gap="xl">
        <Box ta="center">
          <Badge
            variant="light"
            color="blue"
            size="lg"
            radius="xl"
            mb="md"
            style={{ background: "#667eea15", color: "#667eea" }}
          >
            KURSUS TERPOPULER
          </Badge>
          <Title
            order={2}
            size="h1"
            fw={700}
            mb="sm"
            style={{ color: "#1a365d" }}
          >
            Program Pembelajaran Terbaik
          </Title>
          <Text
            size="lg"
            c="dimmed"
            maw={600}
            mx="auto"
            style={{ lineHeight: 1.6 }}
          >
            Dipilih khusus untuk Anda berdasarkan kualitas dan feedback siswa
            terbaik
          </Text>
        </Box>

        {error && (
          <Alert
            icon={<IconInfoCircle size={16} />}
            title="Error"
            color="red"
            radius="lg"
          >
            {error}
          </Alert>
        )}

        <Grid>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <GridCol
                key={`skeleton-${index}`}
                span={{ base: 12, sm: 6, lg: 3 }}
              >
                <CardSkeleton />
              </GridCol>
            ))
          ) : topCourses.length === 0 ? (
            <GridCol span={12}>
              <Center py="xl">
                <Stack align="center" gap="md">
                  <Text size="lg" c="dimmed">
                    {error
                      ? "Gagal memuat kursus"
                      : "Tidak ada kursus tersedia"}
                  </Text>
                  {error && (
                    <Button
                      variant="light"
                      onClick={() => window.location.reload()}
                    >
                      Coba Lagi
                    </Button>
                  )}
                </Stack>
              </Center>
            </GridCol>
          ) : (
            topCourses.map((course, index) => (
              <GridCol key={course.id} span={{ base: 12, sm: 6, lg: 3 }}>
                <CourseCard course={course} index={index} mounted={mounted} />
              </GridCol>
            ))
          )}
        </Grid>

        <Center mt="xl">
          <Button
            variant="outline"
            size="lg"
            radius="xl"
            component={Link}
            href="/frontend/landing/listcourse"
            rightSection={<IconChevronRight size={18} />}
            style={{
              borderWidth: "2px",
              borderColor: "#667eea",
              color: "#667eea",
              fontWeight: 600,
            }}
          >
            Jelajahi Semua Kursus
          </Button>
        </Center>
      </Stack>
    </Container>
  );
};

const CardSkeleton = () => (
  <Box
    style={{
      height: "480px",
      background: "white",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      overflow: "hidden",
    }}
  >
    <Box style={{ height: "220px", background: "#f1f5f9" }} />
    <Box p="lg">
      <Stack gap="xs">
        <Box
          style={{
            height: "20px",
            width: "60%",
            background: "#f1f5f9",
            borderRadius: "4px",
          }}
        />
        <Box
          style={{ height: "40px", background: "#f1f5f9", borderRadius: "4px" }}
        />
        <Box
          style={{
            height: "16px",
            width: "50%",
            background: "#f1f5f9",
            borderRadius: "4px",
          }}
        />
        <Box style={{ display: "flex", justifyContent: "space-between" }}>
          <Box
            style={{
              height: "16px",
              width: "40%",
              background: "#f1f5f9",
              borderRadius: "4px",
            }}
          />
          <Box
            style={{
              height: "16px",
              width: "30%",
              background: "#f1f5f9",
              borderRadius: "4px",
            }}
          />
        </Box>
        <Box
          style={{ height: "36px", background: "#f1f5f9", borderRadius: "8px" }}
        />
      </Stack>
    </Box>
  </Box>
);
