/* eslint-disable @typescript-eslint/no-explicit-any */
// src\app\frontend\landing\listcourse\[id]\components\CourseSidebar.tsx

import React from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import {
  Box,
  Paper,
  Stack,
  Group,
  Text,
  Button,
  Badge,
  Divider,
  ThemeIcon,
  Alert,
} from "@mantine/core";
import {
  IconShoppingCart,
  IconArrowRight,
  IconHeart,
  IconShare,
  IconClock,
  IconFileText,
  IconClipboardList,
  IconTrophy,
  IconInfinity,
  IconDeviceMobile,
  IconDownload,
  IconHeadphones,
  IconLogin,
  IconAlertCircle,
} from "@tabler/icons-react";

interface CourseSidebarProps {
  courseData: any;
  isWishlisted: boolean;
  onWishlistToggle: () => void;
}

export const CourseSidebar: React.FC<CourseSidebarProps> = ({
  courseData,
  isWishlisted,
  onWishlistToggle,
}) => {
  const router = useRouter();
  const { data: session, status } = useSession();

  const formatPrice = (price: number) => {
    if (price === 0) return "Gratis";
    return `Rp ${price?.toLocaleString("id-ID")}`;
  };

  // Get course price from multiple possible fields
  const getCoursePrice = () => {
    const price = courseData?.course_price || courseData?.price || 0;
    return typeof price === 'number' ? price : parseFloat(price) || 0;
  };

  const coursePrice = getCoursePrice();
  const isFree = coursePrice <= 0;

  // Handle "Buy Now" / "Enroll" button click
  const handlePurchase = () => {
    if (status === "unauthenticated") {
      // Redirect to login page with callback URL
      const callbackUrl = encodeURIComponent(window.location.pathname);
      router.push(`/frontend/auth/login?callbackUrl=${callbackUrl}`);
      return;
    }

    if (status === "authenticated") {
      // Redirect to payment page
      const courseId = courseData?.course_id || courseData?.id;
      router.push(`/frontend/payment/${courseId}`);
    }
  };

  // Handle wishlist with authentication check
  const handleWishlistToggle = () => {
    if (status === "unauthenticated") {
      // Redirect to login page with callback URL
      const callbackUrl = encodeURIComponent(window.location.pathname);
      router.push(`/frontend/auth/login?callbackUrl=${callbackUrl}`);
      return;
    }

    if (status === "authenticated") {
      onWishlistToggle();
    }
  };

  return (
    <Box style={{ position: "sticky", top: 20 }}>
      <Paper
        shadow="xl"
        p={30}
        radius="xl"
        withBorder
        style={{
          background: "white",
          border: "2px solid #f1f3f4",
        }}
      >
        <Stack gap="xl">
          {/* Authentication Alert */}
          {status === "unauthenticated" && (
            <Alert
              icon={<IconAlertCircle size="1rem" />}
              color="orange"
              variant="light"
              __size="sm"
              radius="lg"
            >
              Silakan login untuk mengakses fitur kursus
            </Alert>
          )}

          {/* Price Section */}
          <Stack gap="md" ta="center">
            <Group justify="center" align="baseline">
              <Text size="2.5rem" fw={700} c={isFree ? "green.6" : "blue.6"}>
                {formatPrice(coursePrice)}
              </Text>
              {courseData.discount > 0 && (
                <Stack gap={0} align="center">
                  <Text size="lg" td="line-through" c="dimmed">
                    {formatPrice(courseData.originalPrice)}
                  </Text>
                </Stack>
              )}
            </Group>

            {courseData.discount > 0 && (
              <Text size="sm" c="red.6" fw={500} ta="center">
                ⏰ Penawaran terbatas!
              </Text>
            )}
          </Stack>

          {/* Action Buttons */}
          <Stack gap="md">
            <Button
              fullWidth
              size="xl"
              radius="xl"
              leftSection={
                status === "unauthenticated" ? (
                  <IconLogin size={20} />
                ) : isFree ? (
                  <IconArrowRight size={20} />
                ) : (
                  <IconShoppingCart size={20} />
                )
              }
              style={{
                background: 
                  status === "unauthenticated" 
                    ? "linear-gradient(45deg, #f59e0b, #d97706)"
                    : isFree
                    ? "linear-gradient(45deg, #10b981, #059669)"
                    : "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                fontSize: "1.1rem",
                height: "56px",
              }}
              onClick={handlePurchase}
              loading={status === "loading"}
            >
              {status === "unauthenticated" 
                ? "Login untuk Mendaftar" 
                : isFree 
                ? "Daftar Gratis" 
                : "Beli Sekarang"}
            </Button>

            <Group grow>
              <Button
                variant="light"
                leftSection={
                  <IconHeart
                    size={16}
                    color={isWishlisted ? "red" : undefined}
                  />
                }
                onClick={handleWishlistToggle}
                radius="xl"
                disabled={status === "unauthenticated"}
              >
                Wishlist
              </Button>
              <Button
                variant="light"
                leftSection={<IconShare size={16} />}
                radius="xl"
              >
                Share
              </Button>
            </Group>
          </Stack>

          <Divider />

          {/* Course Features */}
          <Stack gap="lg">
            <Text fw={600} size="lg" c="dark.8">
              Yang Anda Dapatkan:
            </Text>

            <Stack gap="md">
              <Group gap="md">
                <ThemeIcon size="md" radius="xl" color="blue" variant="light">
                  <IconClock size={18} />
                </ThemeIcon>
                <Text size="md" c="dark.7">
                  {courseData.duration} video berkualitas HD
                </Text>
              </Group>

              <Group gap="md">
                <ThemeIcon size="md" radius="xl" color="green" variant="light">
                  <IconFileText size={18} />
                </ThemeIcon>
                <Text size="md" c="dark.7">
                  {courseData.lessons} pelajaran terstruktur
                </Text>
              </Group>

              <Group gap="md">
                <ThemeIcon size="md" radius="xl" color="orange" variant="light">
                  <IconClipboardList size={18} />
                </ThemeIcon>
                <Text size="md" c="dark.7">
                  {courseData.quizzes} latihan & kuis
                </Text>
              </Group>

              {courseData.certificate && (
                <Group gap="md">
                  <ThemeIcon
                    size="md"
                    radius="xl"
                    color="yellow"
                    variant="light"
                  >
                    <IconTrophy size={18} />
                  </ThemeIcon>
                  <Text size="md" c="dark.7">
                    Sertifikat resmi kelulusan
                  </Text>
                </Group>
              )}

              {courseData.lifetime && (
                <Group gap="md">
                  <ThemeIcon
                    size="md"
                    radius="xl"
                    color="purple"
                    variant="light"
                  >
                    <IconInfinity size={18} />
                  </ThemeIcon>
                  <Text size="md" c="dark.7">
                    Akses seumur hidup
                  </Text>
                </Group>
              )}

              {courseData.mobile && (
                <Group gap="md">
                  <ThemeIcon size="md" radius="xl" color="cyan" variant="light">
                    <IconDeviceMobile size={18} />
                  </ThemeIcon>
                  <Text size="md" c="dark.7">
                    Akses di mobile & desktop
                  </Text>
                </Group>
              )}

              {courseData.downloadable && (
                <Group gap="md">
                  <ThemeIcon size="md" radius="xl" color="teal" variant="light">
                    <IconDownload size={18} />
                  </ThemeIcon>
                  <Text size="md" c="dark.7">
                    Materi dapat diunduh
                  </Text>
                </Group>
              )}

              <Group gap="md">
                <ThemeIcon size="md" radius="xl" color="pink" variant="light">
                  <IconHeadphones size={18} />
                </ThemeIcon>
                <Text size="md" c="dark.7">
                  Audio berkualitas tinggi
                </Text>
              </Group>
            </Stack>
          </Stack>

          <Divider />

          {/* Course Details */}
          <Stack gap="lg">
            <Text fw={600} size="lg" c="dark.8">
              Detail Kursus:
            </Text>

            <Stack gap="md">
              <Group justify="space-between">
                <Text size="sm" c="dark.6">
                  Level:
                </Text>
                <Badge
                  variant="light"
                  color="blue"
                  size="md"
                  radius="xl"
                  tt="capitalize"
                >
                  {courseData.level}
                </Badge>
              </Group>

              <Group justify="space-between">
                <Text size="sm" c="dark.6">
                  Bahasa:
                </Text>
                <Badge variant="light" color="green" size="md" radius="xl">
                  {courseData.language}
                </Badge>
              </Group>

              <Group justify="space-between">
                <Text size="sm" c="dark.6">
                  Total Siswa:
                </Text>
                <Badge variant="light" color="orange" size="md" radius="xl">
                  {courseData.students?.toLocaleString()}
                </Badge>
              </Group>

              <Group justify="space-between">
                <Text size="sm" c="dark.6">
                  Rating:
                </Text>
                <Badge variant="light" color="yellow" size="md" radius="xl">
                  {courseData.rating}/5 ⭐
                </Badge>
              </Group>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};