// src\app\frontend\dashboard\lecturer\components\submissions\GradeModal.tsx
"use client";

import { Modal, Stack, Title, Text, NumberInput, Textarea, Button, Group, Anchor, Alert, } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { Submission } from '../../hooks/useSubmissions';

interface GradeModalProps {
  opened: boolean;
  onClose: () => void;
  submission: Submission | null;
  onGrade: (submissionId: number, payload: { score: number; feedback: string; status: 'approved' | 'rejected' }) => Promise<boolean>;
}

export function GradeModal({ opened, onClose, submission, onGrade }: GradeModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = useForm({
    initialValues: { score: 75, feedback: '' },
    validate: {
      score: (value) => (value < 0 || value > 100 ? 'Score must be between 0 and 100' : null),
    },
  });

  if (!submission) return null;

  const handleSubmit = async (status: 'approved' | 'rejected') => {
    if (status === 'approved' && form.validate().hasErrors) return;

    setIsSubmitting(true);
    const success = await onGrade(submission.submission_id, {
      status,
      score: status === 'approved' ? form.values.score : 0,
      feedback: form.values.feedback,
    });
    setIsSubmitting(false);

    if (success) {
      onClose();
      form.reset();
    }
  };

  return (
    <Modal opened={opened} onClose={onClose} title="Grade Submission" centered size="lg">
      <Stack>
        <Title order={4}>{submission.assignment.name}</Title>
        <Text>Student: <Text span fw={500}>{submission.student.name}</Text></Text>
        
        {submission.submission_type === 'file' && submission.file_path && (
          <Alert title="Submitted File" color="blue" variant="light">
            <Anchor href={submission.file_path} target="_blank" download>
              Download Submission File
            </Anchor>
          </Alert>
        )}
        
        {submission.submission_type === 'text' && submission.submission_text && (
          <Alert title="Submitted Text" color="gray" variant="light">
            <Text style={{ whiteSpace: 'pre-wrap' }}>{submission.submission_text}</Text>
          </Alert>
        )}

        <NumberInput
          label="Score (0-100)"
          {...form.getInputProps('score')}
          min={0}
          max={100}
        />
        <Textarea
          label="Feedback (Optional)"
          placeholder="Provide constructive feedback for the student..."
          {...form.getInputProps('feedback')}
          minRows={4}
        />
        
        <Group justify="flex-end" mt="md">
          <Button
            variant="outline"
            color="red"
            onClick={() => handleSubmit('rejected')}
            loading={isSubmitting}
          >
            Reject
          </Button>
          <Button
            color="green"
            onClick={() => handleSubmit('approved')}
            loading={isSubmitting}
          >
            Approve & Save Grade
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
}