// src\app\frontend\landing\components\CourseCard.tsx
"use client";

import React from "react";
import {
  Card,
  CardSection,
  Box,
  Stack,
  Group,
  Badge,
  Title,
  Text,
  Avatar,
  Divider,
  Button,
  Transition,
} from "@mantine/core";
import { IconStar, IconUsers, IconClock } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { CourseCardProps } from "@/types/landing";

export const CourseCard: React.FC<CourseCardProps> = ({
  course,
  index,
  mounted,
}) => {
  return (
    <Transition
      mounted={mounted}
      transition="slide-up"
      duration={600}
      timingFunction="ease"
      enterDelay={index * 100}
      exitDelay={index * 100}
    >
      {(styles) => (
        <Card
          shadow="xl"
          padding="0"
          radius="xl"
          h="480px"
          style={{
            ...styles,
            overflow: "hidden",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            background: "white",
            cursor: "pointer",
            border: "1px solid #e2e8f0",
            display: "flex",
            flexDirection: "column",
          }}
          component={Link}
          href={`/frontend/landing/listcourse/${course.id}`}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-12px)";
            e.currentTarget.style.boxShadow =
              "0 25px 50px rgba(102, 126, 234, 0.15)";
            e.currentTarget.style.borderColor = "#667eea";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "";
            e.currentTarget.style.borderColor = "#e2e8f0";
          }}
        >
          <CardSection
            style={{
              position: "relative",
              overflow: "hidden",
              height: "220px",
              flexShrink: 0,
            }}
          >
            <Box
              style={{
                position: "relative",
                overflow: "hidden",
                width: "100%",
                height: "100%",
                background: course.image
                  ? "linear-gradient(135deg, #667eea20, #764ba220)"
                  : "linear-gradient(135deg, #667eea, #764ba2)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {course.image ? (
                <>
                  <Image
                    src={course.image}
                    width={300}
                    height={220}
                    alt={course.title}
                    style={{
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                      width: "100%",
                      height: "100%",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "scale(1)";
                    }}
                  />
                  <Box
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      background:
                        "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.1) 100%)",
                    }}
                  />
                </>
              ) : (
                // Placeholder when no image
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "white",
                    textAlign: "center",
                    padding: "20px",
                  }}
                >
                  <Text
                    size="4rem"
                    style={{
                      marginBottom: "10px",
                      filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))",
                    }}
                  >
                    📚
                  </Text>
                  <Text
                    fw={700}
                    size="lg"
                    style={{
                      textShadow: "0 2px 10px rgba(0,0,0,0.3)",
                    }}
                  >
                    {course.category}
                  </Text>
                </Box>
              )}
            </Box>

            <Box
              style={{
                position: "absolute",
                top: "16px",
                left: "16px",
              }}
            >
              <Badge
                variant="filled"
                radius="xl"
                style={{
                  background: "rgba(102, 126, 234, 0.9)",
                  backdropFilter: "blur(10px)",
                  border: "1px solid rgba(255,255,255,0.3)",
                }}
              >
                {course.category}
              </Badge>
            </Box>

            {course.price === "Gratis" && (
              <Box
                style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                }}
              >
                <Badge
                  color="green"
                  variant="filled"
                  radius="xl"
                  style={{
                    background: "rgba(34, 197, 94, 0.9)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  GRATIS
                </Badge>
              </Box>
            )}

            <Box
              style={{
                position: "absolute",
                bottom: "16px",
                right: "16px",
              }}
            >
              <Badge
                variant="filled"
                color="dark"
                radius="xl"
                style={{
                  background: "rgba(0,0,0,0.7)",
                  backdropFilter: "blur(10px)",
                }}
              >
                <Group gap="xs">
                  <IconClock size={12} />
                  {course.duration || "Fleksibel"}
                </Group>
              </Badge>
            </Box>
          </CardSection>

          <Box
            p="lg"
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              height: "260px", // Fixed height for content area
            }}
          >
            <Stack gap="sm" style={{ height: "100%" }}>
              <Badge
                variant="light"
                color="blue"
                size="sm"
                radius="md"
                w="fit-content"
                style={{
                  background: "#667eea10",
                  color: "#667eea",
                }}
              >
                {course.level?.toUpperCase() || "BEGINNER"}
              </Badge>

              <Title
                order={4}
                lineClamp={2}
                style={{
                  minHeight: "48px",
                  color: "#1a365d",
                  fontWeight: 600,
                  flex: "0 0 auto",
                }}
              >
                {course.title}
              </Title>

              <Group gap="xs" style={{ opacity: 0.8, flex: "0 0 auto" }}>
                <Avatar
                  size="sm"
                  radius="xl"
                  style={{
                    background: "linear-gradient(45deg, #667eea, #764ba2)",
                  }}
                >
                  {course.instructorAvatar ||
                    course.instructor?.charAt(0) ||
                    "?"}
                </Avatar>
                <Text size="sm" c="dimmed" truncate fw={500}>
                  {course.instructor || "Instructor"}
                </Text>
              </Group>

              <Group
                justify="space-between"
                align="center"
                py="xs"
                style={{ flex: "0 0 auto" }}
              >
                <Group gap="xs">
                  <Box
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "4px",
                      background: "#ffd43b15",
                      padding: "4px 8px",
                      borderRadius: "8px",
                    }}
                  >
                    <IconStar size={14} fill="#ffd43b" color="#ffd43b" />
                    <Text size="sm" fw={600} style={{ color: "#b45309" }}>
                      {typeof course.rating === "number"
                        ? course.rating.toFixed(1)
                        : course.rating || "4.5"}
                    </Text>
                  </Box>
                </Group>
                <Group
                  gap="xs"
                  style={{
                    background: "#f1f5f9",
                    padding: "4px 8px",
                    borderRadius: "8px",
                  }}
                >
                  <IconUsers size={14} color="#64748b" />
                  <Text size="sm" c="dimmed" fw={500}>
                    {typeof course.students === "number"
                      ? course.students.toLocaleString()
                      : course.students || "0"}
                  </Text>
                </Group>
              </Group>

              <Divider style={{ borderColor: "#e2e8f0", flex: "0 0 auto" }} />

              <Group
                justify="space-between"
                align="center"
                style={{ marginTop: "auto", flex: "0 0 auto" }}
              >
                <Box>
                  <Text size="xl" fw={800} style={{ color: "#667eea" }}>
                    {course.price || "Gratis"}
                  </Text>
                  {course.price !== "Gratis" && course.price && (
                    <Text size="xs" td="line-through" c="dimmed">
                      {course.price}
                    </Text>
                  )}
                </Box>
                <Button
                  variant="gradient"
                  gradient={{ from: "#667eea", to: "#764ba2" }}
                  size="sm"
                  radius="xl"
                  style={{ minWidth: "110px", fontWeight: 600 }}
                >
                  Lihat Detail
                </Button>
              </Group>
            </Stack>
          </Box>
        </Card>
      )}
    </Transition>
  );
};
