// src\app\frontend\components\PaymentSuccessModal.tsx
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  Container,
  Stack,
  Title,
  Text,
  Loader,
  Paper,
  ThemeIcon,
  Center,
} from '@mantine/core';
import {
  IconCheck,
  IconAlertCircle,
} from '@tabler/icons-react';

interface PaymentSuccessHandlerProps {
  courseId: string;
  courseTitle?: string;
}

export const PaymentSuccessHandler: React.FC<PaymentSuccessHandlerProps> = ({
  courseId,
  courseTitle,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [checking, setChecking] = useState(true);
  const [attempts, setAttempts] = useState(0);

  const paymentStatus = searchParams.get('payment');
  const isPaymentSuccess = paymentStatus === 'success';
  const isPaymentFailed = paymentStatus === 'failed';

  useEffect(() => {
    if (isPaymentSuccess) {
      checkEnrollmentAndRedirect();
    } else if (isPaymentFailed) {
      setChecking(false);
    }
  }, [isPaymentSuccess, isPaymentFailed]);

  const checkEnrollmentAndRedirect = async () => {
    try {
      // Wait a bit for webhook to process
      if (attempts === 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      const response = await fetch(`/api/enrollment/check/${courseId}`);
      const data = await response.json();
      
      if (data.success && data.enrolled) {
        // Success! Redirect to student dashboard
        console.log("Payment successful, redirecting to dashboard...");
        router.push('/dashboard/student');
        return;
      } else {
        // Still processing, try again
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        
        if (newAttempts < 5) { // Max 5 attempts (about 15 seconds total)
          setTimeout(() => checkEnrollmentAndRedirect(), 3000);
          return;
        } else {
          // Max attempts reached, redirect anyway with a message
          router.push('/dashboard/student?message=enrollment_processing');
          return;
        }
      }
    } catch (error) {
      console.error('Error checking enrollment:', error);
      const newAttempts = attempts + 1;
      setAttempts(newAttempts);
      
      if (newAttempts < 3) {
        setTimeout(() => checkEnrollmentAndRedirect(), 3000);
      } else {
        // Redirect anyway after failed attempts
        router.push('/dashboard/student?message=check_enrollment');
      }
    }
  };

  // Don't render anything if no payment status
  if (!isPaymentSuccess && !isPaymentFailed) {
    return null;
  }

  // Payment failed
  if (isPaymentFailed) {
    return (
      <Container size="sm" py="xl">
        <Paper shadow="md" p="xl" radius="lg" withBorder>
          <Center>
            <Stack align="center">
              <ThemeIcon size={60} radius="50%" color="red" variant="light">
                <IconAlertCircle size={30} />
              </ThemeIcon>
              <Title order={3} c="red" ta="center">
                Pembayaran Gagal
              </Title>
              <Text ta="center" c="dimmed">
                Pembayaran tidak dapat diproses. Silakan coba lagi.
              </Text>
            </Stack>
          </Center>
        </Paper>
      </Container>
    );
  }

  // Payment success - checking enrollment
  return (
    <Container size="sm" py="xl">
      <Paper shadow="md" p="xl" radius="lg" withBorder>
        <Center>
          <Stack align="center" gap="lg">
            <ThemeIcon size={60} radius="50%" color="green" variant="light">
              <IconCheck size={30} />
            </ThemeIcon>
            <Title order={3} c="green" ta="center">
              Pembayaran Berhasil!
            </Title>
            <Text ta="center" size="lg" fw={500}>
              {courseTitle || 'Kursus'}
            </Text>
            
            {checking && (
              <>
                <Loader size="md" />
                <Text ta="center" c="dimmed">
                  Mengonfirmasi pendaftaran dan mengarahkan ke dashboard...
                </Text>
                <Text ta="center" size="sm" c="dimmed">
                  Percobaan {attempts + 1} dari 5
                </Text>
              </>
            )}
          </Stack>
        </Center>
      </Paper>
    </Container>
  );
};