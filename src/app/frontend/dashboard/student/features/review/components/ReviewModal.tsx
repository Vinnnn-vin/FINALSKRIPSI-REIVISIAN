// src\app\frontend\dashboard\student\components\ReviewModal.tsx
// src\app\frontend\dashboard\student\features\review\components\ReviewModal.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Modal, Stack, Text, Button, Textarea, Rating, Group, Paper, Alert } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useState } from "react";
import { notifications } from "@mantine/notifications";
import { IconStar, IconStarFilled, IconInfoCircle } from "@tabler/icons-react";

interface ReviewModalProps {
  opened: boolean;
  onClose: () => void;
  courseId: number | null;
}

export function ReviewModal({ opened, onClose, courseId }: ReviewModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    initialValues: { 
      rating: 0, 
      review_text: "" 
    },
    validate: {
      rating: (value) => (value === 0 ? "Please provide a rating" : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    if (!courseId) {
      notifications.show({
        title: "Error",
        message: "Course ID is missing",
        color: "red",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await fetch(
        `/api/dashboard/student/course/${courseId}/review`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        }
      );
      
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || "Failed to submit review");
      }
      
      notifications.show({
        title: "Thank You! 🎉",
        message: "Your review has been submitted successfully.",
        color: "green",
      });
      
      // Reset form dan tutup modal
      form.reset();
      onClose(); // Ini akan trigger refresh di parent component
      
    } catch (err: any) {
      notifications.show({
        title: "Error",
        message: err.message,
        color: "red",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form ketika modal dibuka
  const handleModalClose = () => {
    form.reset();
    onClose();
  };

  return (
    <Modal 
      opened={opened} 
      onClose={handleModalClose} 
      title={
        <Group gap="xs">
          <IconStarFilled size={24} color="#FFA500" />
          <Text fw={600} size="lg">Write a Review</Text>
        </Group>
      }
      centered
      size="md"
    >
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack gap="md">
          <Alert icon={<IconInfoCircle size={20} />} color="blue" variant="light">
            Your review will help other students make informed decisions about this course.
          </Alert>

          <Paper withBorder p="md" radius="md" bg="gray.0">
            <Stack gap="xs">
              <Text fw={500} size="sm">
                How would you rate this course?
              </Text>
              <Group justify="center" py="xs">
                <Rating 
                  {...form.getInputProps("rating")} 
                  size="xl"
                  emptySymbol={<IconStar size={32} />}
                  fullSymbol={<IconStarFilled size={32} />}
                />
              </Group>
              {form.errors.rating && (
                <Text size="xs" c="red" ta="center">
                  {form.errors.rating}
                </Text>
              )}
            </Stack>
          </Paper>
          
          <Textarea
            label="Your Review (Optional)"
            description="Share your experience with this course"
            placeholder="What did you like? What could be improved? Would you recommend this course to others?"
            minRows={4}
            maxRows={8}
            {...form.getInputProps("review_text")}
          />

          <Alert icon={<IconInfoCircle size={16} />} color="gray" variant="light">
            <Text size="xs">
              Note: You can only submit one review per course. Make sure your review is honest and helpful!
            </Text>
          </Alert>
          
          <Group justify="flex-end" gap="sm">
            <Button 
              variant="light" 
              onClick={handleModalClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              loading={isSubmitting}
              leftSection={<IconStar size={20} />}
            >
              Submit Review
            </Button>
          </Group>
        </Stack>
      </form>
    </Modal>
  );
}