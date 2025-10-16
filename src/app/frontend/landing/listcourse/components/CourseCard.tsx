// src\app\frontend\landing\listcourse\components\CourseCard.tsx
/* eslint-disable @next/next/no-img-element */
// src\app\frontend\landing\listcourse\components\CourseCard.tsx
import React, { useState } from "react";
import {
  Card,
  Box,
  Title,
  Text,
  Badge,
  Avatar,
  Group,
  Stack,
  Rating,
  Button,
  Image,
} from "@mantine/core";
import {
  IconUsers,
  IconClock,
  IconTrophy,
  IconSparkles,
  IconPhoto,
} from "@tabler/icons-react";
import Link from "next/link";
import { CourseDisplayData } from "@/types/landing";

interface CourseCardProps {
  course: CourseDisplayData;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
    setImageError(false);
  };

  const getImageSrc = () => {
    if (imageError || !course.image) {
      return "/SIGNIN.jpg";
    }

    const imageUrl = course.image.trim();

    // Handle different image URL formats
    if (imageUrl.startsWith("data:image/")) {
      return imageUrl;
    }

    if (imageUrl.startsWith("/uploads/")) {
      return imageUrl;
    }

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    if (!imageUrl.startsWith("/")) {
      return `/${imageUrl}`;
    }

    return imageUrl;
  };

  const imageSrc = getImageSrc();

  return (
    <Card
      shadow="md"
      padding={0}
      radius="xl"
      withBorder
      style={{
        overflow: "hidden",
        transition: "all 0.3s ease",
        cursor: "pointer",
        height: "100%",
        borderColor: "#e2e8f0",
      }}
      styles={{
        root: {
          "&:hover": {
            transform: "translateY(-8px)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
          },
        },
      }}
    >
      <Card.Section pos="relative">
        <Box pos="relative" style={{ overflow: "hidden" }}>
          <Box
            style={{
              position: "relative",
              height: "220px",
              backgroundColor: "#f8f9fa",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {/* Fallback/Loading state */}
            {(imageLoading ||
              imageError ||
              !imageSrc ||
              imageSrc === "/SIGNIN.jpg") && (
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#f1f3f4",
                  zIndex: imageError ? 2 : 1,
                }}
              >
                {imageError ? (
                  <Stack align="center" gap="xs">
                    <IconPhoto size={48} color="#9ca3af" />
                    <Text size="xs" c="dimmed">
                      Gambar tidak tersedia
                    </Text>
                  </Stack>
                ) : (
                  <IconPhoto size={48} color="#dee2e6" />
                )}
              </Box>
            )}

            {/* Actual Image */}
            {imageSrc && imageSrc !== "/SIGNIN.jpg" && (
              <img
                src={imageSrc}
                alt={course.title}
                onError={handleImageError}
                onLoad={handleImageLoad}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.3s ease, opacity 0.3s ease",
                  opacity: imageLoading ? 0 : 1,
                  transform: "scale(1)",
                  zIndex: imageError ? 0 : 1,
                }}
                onMouseEnter={(e) => {
                  if (!imageError && !imageLoading) {
                    e.currentTarget.style.transform = "scale(1.05)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!imageError && !imageLoading) {
                    e.currentTarget.style.transform = "scale(1)";
                  }
                }}
              />
            )}

            {imageSrc === "/SIGNIN.jpg" && (
              <Image
                src={course.image || "/SIGNIN.jpg"}
                alt={course.title}
                width={800} 
                height={450} 
                style={{
                  width: "100%",
                  height: "auto", 
                  aspectRatio: "16/9",
                  objectFit: "cover",
                  transition: "transform 0.3s ease",
                  borderRadius: "0.5rem",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
                onError={(e) => {
                  // fallback manual kalau gambar gagal dimuat
                  e.currentTarget.src = "/SIGNIN.jpg";
                }}
              />
            )}

            {/* Link overlay untuk navigasi */}
            <Link
              href={`/frontend/landing/listcourse/${course.id}`}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 10,
              }}
            />
          </Box>

          {/* Overlay Badges */}
          <Group
            pos="absolute"
            top={12}
            left={12}
            gap={8}
            style={{ zIndex: 15 }}
          >
            {course.isBestseller && (
              <Badge
                color="orange"
                variant="filled"
                leftSection={<IconTrophy size={12} />}
                style={{ fontWeight: 600 }}
              >
                Bestseller
              </Badge>
            )}
            {course.isNew && (
              <Badge
                color="green"
                variant="filled"
                leftSection={<IconSparkles size={12} />}
                style={{ fontWeight: 600 }}
              >
                Baru
              </Badge>
            )}
          </Group>

          {/* Level Badge */}
          <Badge
            pos="absolute"
            top={12}
            right={12}
            color="dark"
            variant="light"
            style={{
              fontWeight: 500,
              backdropFilter: "blur(10px)",
              zIndex: 15,
            }}
          >
            {course.level}
          </Badge>

          {/* Category Badge */}
          <Badge
            pos="absolute"
            bottom={12}
            left={12}
            color="blue"
            variant="light"
            style={{
              fontWeight: 500,
              backdropFilter: "blur(10px)",
              background: "rgba(255,255,255,0.9)",
              zIndex: 15,
            }}
          >
            {course.category}
          </Badge>
        </Box>
      </Card.Section>

      <Box p="xl" style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Stack gap="md" style={{ flex: 1 }}>
          {/* Title */}
          <Title
            order={3}
            lineClamp={2}
            style={{
              minHeight: "3rem",
              fontSize: "1.1rem",
              lineHeight: 1.4,
              color: "#1a365d",
            }}
          >
            <Text
              component={Link}
              href={`/frontend/landing/listcourse/${course.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
              }}
              styles={{
                root: {
                  "&:hover": {
                    color: "#667eea",
                  },
                },
              }}
            >
              {course.title}
            </Text>
          </Title>

          {/* Instructor */}
          <Group gap="xs">
            <Avatar
              size="sm"
              radius="xl"
              color="blue"
              style={{
                background: "linear-gradient(45deg, #667eea, #764ba2)",
              }}
            >
              {course.instructorAvatar}
            </Avatar>
            <Text size="sm" c="dimmed" fw={500}>
              {course.instructor}
            </Text>
          </Group>

          {/* Rating and Reviews */}
          <Group justify="space-between" align="center">
            <Group gap="xs">
              <Rating
                value={course.rating}
                fractions={2}
                readOnly
                size="sm"
                color="orange"
              />
              <Text size="sm" fw={600} c="dark">
                {course.rating}
              </Text>
              {course.reviewCount && (
                <Text size="xs" c="dimmed">
                  ({course.reviewCount})
                </Text>
              )}
            </Group>
            <Group gap="xs">
              <IconUsers size={14} color="gray" />
              <Text size="sm" c="dimmed" fw={500}>
                {course.students.toLocaleString()}
              </Text>
            </Group>
          </Group>

          {/* Duration */}
          <Group gap="xs">
            <IconClock size={14} color="gray" />
            <Text size="sm" c="dimmed">
              {course.duration}
            </Text>
          </Group>

          {/* Price and Action */}
          <Group justify="space-between" align="center" mt="auto" pt="md">
            <Stack gap={2}>
              <Text size="xl" fw={700} c="blue.6">
                {course.price}
              </Text>
              {course.originalPrice &&
                course.originalPrice !== course.price && (
                  <Text size="sm" td="line-through" c="dimmed">
                    {course.originalPrice}
                  </Text>
                )}
            </Stack>
            <Button
              component={Link}
              href={`/frontend/landing/listcourse/${course.id}`}
              size="sm"
              radius="md"
              style={{
                background: "linear-gradient(45deg, #667eea, #764ba2)",
              }}
              styles={{
                root: {
                  "&:hover": {
                    background: "linear-gradient(45deg, #5a67d8, #6b46c1)",
                  },
                },
              }}
            >
              Lihat Detail
            </Button>
          </Group>
        </Stack>
      </Box>
    </Card>
  );
};

export default CourseCard;
