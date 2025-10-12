// src\app\frontend\payment\[courseId]\page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client";

import { useState, useEffect, FC } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Container,
  Title,
  Text,
  Button,
  Paper,
  Stack,
  Loader,
  Center,
  Alert,
  Group,
  Divider,
  Image,
} from "@mantine/core";
import {
  IconAlertCircle,
  IconShoppingCart,
  IconArrowLeft,
  IconCreditCard,
} from "@tabler/icons-react";
import { useSession } from "next-auth/react";

interface Course {
  course_id: number;
  course_title?: string;
  course_price?: number;
  price?: number;
  title?: string;
  image?: string;
  thumbnail?: string;
  instructor?: {
    name: string;
  };
}

const PaymentPage: FC = () => {
  const params = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const courseId = params.courseId as string;

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState<boolean>(false);

  useEffect(() => {
    if (status === "authenticated" && courseId) {
      fetchCourseDetails();
    } else if (status === "unauthenticated") {
      router.push(`/frontend/auth/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
    }
  }, [courseId, status, router]);

  const fetchCourseDetails = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/landing/listcourse/${courseId}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch course: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data.success && data.data) {
        setCourse(data.data);
        
        const coursePrice = data.data.course_price || data.data.price;
        if (!coursePrice || coursePrice <= 0) {
          setError("This course is free and doesn't require payment.");
        }
      } else {
        throw new Error("Course data not found");
      }
    } catch (err: any) {
      console.error("Error fetching course:", err);
      setError(err.message || "Failed to load course details");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!course || !session || processing) return;

    setProcessing(true);
    setError(null);

    try {
      const response = await fetch("/api/payment/create-invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ courseId: parseInt(courseId) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment");
      }

      if (data.invoice_url) {
        // Redirect to Xendit payment page
        window.location.href = data.invoice_url;
      } else {
        throw new Error("No payment URL received");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError(err.message || "Failed to process payment");
    } finally {
      setProcessing(false);
    }
  };

  if (loading || status === "loading") {
    return (
      <Center h="80vh">
        <Stack align="center">
          <Loader size="lg" />
          <Text>Loading course details...</Text>
        </Stack>
      </Center>
    );
  }

  if (status === "unauthenticated") {
    return null; // Will redirect in useEffect
  }

  const courseTitle = course?.course_title || course?.title || "Unknown Course";
  const coursePrice = course?.course_price || course?.price || 0;
  const instructorName = course?.instructor?.name || "Unknown Instructor";
  const courseImage = course?.image || course?.thumbnail || "/SIGNIN.jpg";

  return (
    <Container size="sm" my="xl">
      <Button
        variant="subtle"
        leftSection={<IconArrowLeft size={16} />}
        onClick={() => router.back()}
        mb="xl"
      >
        Back to Course
      </Button>

      <Paper withBorder shadow="lg" p="xl" radius="lg">
        <Stack>
          <Title order={2} ta="center" c="blue">
            <IconCreditCard size={28} style={{ marginRight: 8 }} />
            Checkout
          </Title>

          <Divider />

          {error ? (
            <Alert color="red" icon={<IconAlertCircle />} title="Error">
              {error}
            </Alert>
          ) : !course ? (
            <Alert color="yellow" title="Warning">
              Course details could not be loaded. Please try again.
            </Alert>
          ) : (
            <Stack>
              {/* Course Details */}
              <Group align="flex-start">
                <Image
                  src={courseImage}
                  alt={courseTitle}
                  w={120}
                  h={80}
                  radius="md"
                  fit="cover"
                  fallbackSrc="/SIGNIN.jpg"
                />
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Text fw={600} size="lg">
                    {courseTitle}
                  </Text>
                  <Text c="dimmed" size="sm">
                    by {instructorName}
                  </Text>
                </Stack>
              </Group>

              <Divider />

              {/* Price Details */}
              <Group justify="space-between">
                <Text size="lg" fw={600}>
                  Total Amount
                </Text>
                <Text size="xl" fw={700} c="blue">
                  {coursePrice > 0 
                    ? `Rp ${coursePrice.toLocaleString("id-ID")}`
                    : "Free"
                  }
                </Text>
              </Group>

              {/* Payment Button */}
              <Button
                fullWidth
                size="xl"
                mt="md"
                onClick={handlePayment}
                loading={processing}
                disabled={!coursePrice || coursePrice <= 0}
                leftSection={<IconShoppingCart size={20} />}
                style={{
                  background: "linear-gradient(45deg, #3b82f6, #1d4ed8)",
                  height: "60px",
                }}
              >
                {processing ? "Creating Payment..." : "Pay with Xendit"}
              </Button>

              {/* Security Notice */}
              <Text size="sm" c="dimmed" ta="center">
                🔒 Secure payment powered by Xendit
              </Text>

              {coursePrice <= 0 && (
                <Text size="sm" c="orange" ta="center">
                  This course is free and doesn't require payment.
                </Text>
              )}
            </Stack>
          )}
        </Stack>
      </Paper>
    </Container>
  );
};

export default PaymentPage;