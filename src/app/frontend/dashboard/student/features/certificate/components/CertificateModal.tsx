// src\app\frontend\dashboard\student\components\CertificateModal.tsx
// src\app\frontend\dashboard\student\features\certificate\components\CertificateModal.tsx
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  Modal,
  Stack,
  Text,
  Button,
  Alert,
  Paper,
  Group,
} from "@mantine/core";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import {
  IconAlertCircle,
  IconCertificate,
  IconDownload,
  IconCheck,
} from "@tabler/icons-react";

interface CertificateModalProps {
  opened: boolean;
  onClose: () => void;
  enrollmentId: number | null;
  courseId: number | null;
}

export function CertificateModal({
  opened,
  onClose,
  enrollmentId,
}: CertificateModalProps) {
  const [isClaiming, setIsClaiming] = useState(false);
  const [certificate, setCertificate] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Reset state ketika modal dibuka
  const handleModalOpen = () => {
    if (opened) {
      setCertificate(null);
      setError(null);
    }
  };

  // Gunakan useEffect untuk reset state
  React.useEffect(() => {
    handleModalOpen();
  }, [opened]);

  const handleClaimCertificate = async () => {
    if (!enrollmentId) return;

    setIsClaiming(true);
    setError(null);

    try {
      const response = await fetch(
        `/api/dashboard/student/learn/${enrollmentId}/claim-certificate`,
        { method: "POST" }
      );

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to claim certificate");
      }

      const data = await response.json();
      setCertificate(data.certificate);

      notifications.show({
        title: "Congratulations! 🎉",
        message: "Your certificate has been successfully issued.",
        color: "green",
        icon: <IconCheck size={20} />,
      });
    } catch (err: any) {
      setError(err.message);
      notifications.show({
        title: "Error",
        message: err.message,
        color: "red",
        icon: <IconAlertCircle size={20} />,
      });
    } finally {
      setIsClaiming(false);
    }
  };

  // const handleReviewClick = () => {
  //   onClose();
  // };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group gap="xs">
          <IconCertificate size={24} />
          <Text fw={600} size="lg">
            Course Completion
          </Text>
        </Group>
      }
      centered
      size="md"
    >
      <Stack gap="md">
        {!certificate ? (
          <>
            {/* Claim Certificate Section */}
            <Alert
              icon={<IconCertificate size={20} />}
              color="blue"
              title="Congratulations!"
            >
              You've successfully completed this course! Claim your certificate
              to commemorate your achievement.
            </Alert>

            {error && (
              <Alert
                icon={<IconAlertCircle size={20} />}
                color="red"
                title="Error"
              >
                {error}
              </Alert>
            )}

            <Button
              leftSection={<IconCertificate size={20} />}
              onClick={handleClaimCertificate}
              loading={isClaiming}
              size="lg"
              fullWidth
            >
              Claim Your Certificate
            </Button>
          </>
        ) : (
          <>
            {/* Certificate Claimed Section */}
            <Alert
              icon={<IconCheck size={20} />}
              color="green"
              title="Certificate Issued!"
            >
              Your certificate has been successfully generated and is ready to
              download.
            </Alert>

            <Paper withBorder p="md" radius="md">
              <Stack gap="sm">
                <Group justify="space-between">
                  <Text fw={500} c="dimmed" size="sm">
                    Certificate Number
                  </Text>
                  <Text fw={600} size="sm">
                    {certificate.certificate_number}
                  </Text>
                </Group>

                <Group justify="space-between">
                  <Text fw={500} c="dimmed" size="sm">
                    Issued Date
                  </Text>
                  <Text fw={600} size="sm">
                    {new Date(certificate.issued_at).toLocaleDateString(
                      "id-ID",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </Text>
                </Group>
              </Stack>
            </Paper>

            <Button
              component="a"
              href={certificate.certificate_url}
              target="_blank"
              leftSection={<IconDownload size={20} />}
              variant="light"
              fullWidth
            >
              Download Certificate
            </Button>
          </>
        )}
      </Stack>
    </Modal>
  );
}

import React from "react";
