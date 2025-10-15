/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/frontend/dashboard/lecturer/components/materi/AssignmentForm.tsx
"use client";

import React, { useState, useEffect } from "react";
import { Card, Stack, TextInput, Textarea, Button, FileInput, Progress, Alert, Group, Text, Switch } from "@mantine/core";
import { IconUpload, IconCheck, IconX, IconFileText } from "@tabler/icons-react";
import type { ContentItemType } from "../../types/material";

interface AssignmentFormProps {
  onAddAssignment: (item: ContentItemType) => void;
  onUpdateAssignment?: (item: ContentItemType) => void;
  initialData?: ContentItemType | null;
}

interface UploadState {
  uploading: boolean;
  progress: number;
  url: string | null;
  error: string | null;
}

export default function AssignmentForm({
  onAddAssignment,
  onUpdateAssignment,
  initialData,
}: AssignmentFormProps) {
  const isEditMode = !!initialData && initialData.type === "assignment";

  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [hasAttachment, setHasAttachment] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    url: null,
    error: null,
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      setTitle(initialData.title || "");
      setInstructions(initialData.instructions || "");
      setDueDate(initialData.dueDate?.split("T")[0] || "");
      if (initialData.attachmentUrl) {
        setHasAttachment(true);
        setUploadState({
          uploading: false,
          progress: 100,
          url: initialData.attachmentUrl,
          error: null,
        });
      } else {
        setHasAttachment(false);
        setUploadState({ uploading: false, progress: 0, url: null, error: null });
      }
    } else {
      setTitle("");
      setInstructions("");
      setDueDate("");
      setHasAttachment(false);
      setUploadState({ uploading: false, progress: 0, url: null, error: null });
    }
  }, [initialData]);

  const uploadAttachment = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "assignment");

    setUploadState((prev) => ({ ...prev, uploading: true, progress: 0, error: null }));

    try {
      const response = await fetch("/api/dashboard/lecturer/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Upload failed");
      }

      setUploadState((prev) => ({
        ...prev,
        uploading: false,
        progress: 100,
        url: result.data.url,
        error: null,
      }));

      return result.data.url;
    } catch (error: any) {
      setUploadState((prev) => ({
        ...prev,
        uploading: false,
        progress: 0,
        error: error.message,
      }));
      throw error;
    }
  };

  const handleAddOrUpdate = async () => {
    if (!title.trim() || !instructions.trim()) {
      alert("Judul dan instruksi tugas harus diisi");
      return;
    }
    if (hasAttachment && !uploadState.url) {
       alert("Harap tunggu hingga file lampiran selesai diunggah.");
       return;
    }
    
    const item: ContentItemType = {
      id: isEditMode ? initialData.id : `a-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: "assignment",
      title,
      instructions,
      name: title,
      description: instructions,
      dueDate: dueDate || undefined,
      attachmentUrl: uploadState.url || undefined,
    };

    if (isEditMode && onUpdateAssignment) {
      onUpdateAssignment(item);
    } else {
      onAddAssignment(item);
    }
  };

  const renderAttachmentUpload = () => {
    if (!hasAttachment) return null;

    return (
      <Stack gap="sm">
        <FileInput
          label="File Lampiran (opsional)"
          placeholder="Pilih file lampiran untuk tugas..."
          value={attachmentFile}
          // [FIX] Tambahkan logika untuk trigger upload otomatis di sini
          onChange={async (file) => {
            setAttachmentFile(file);
            if (file) {
              try {
                await uploadAttachment(file);
              } catch (error) {
                console.error("Auto-upload failed:", error);
              }
            } else {
              // Reset state jika file dibersihkan
              setUploadState({ uploading: false, progress: 0, url: null, error: null });
            }
          }}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
          leftSection={<IconUpload size={14} />}
          disabled={uploadState.uploading}
          description="File akan diunggah secara otomatis setelah dipilih."
        />
        <Text size="xs" c="dimmed">
          Tipe file: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG (Maks. 50MB)
        </Text>
        {uploadState.uploading && (
          <Stack gap="xs">
            <Text size="sm">Mengupload lampiran...</Text>
            <Progress value={uploadState.progress} animated />
          </Stack>
        )}
        {uploadState.url && (
          <Alert color="green" icon={<IconCheck size={16} />}>
            <Group justify="space-between">
              <Text size="sm">File lampiran berhasil diunggah</Text>
              <Button size="xs" variant="subtle" component="a" href={uploadState.url} target="_blank" leftSection={<IconFileText size={12} />}>
                Preview
              </Button>
            </Group>
          </Alert>
        )}
        {uploadState.error && (
          <Alert color="red" icon={<IconX size={16} />}>
            Error upload: {uploadState.error}
          </Alert>
        )}
      </Stack>
    );
  };

  return (
    <Card withBorder radius="md" p="lg">
      <Stack>
        <TextInput
          label="Judul Tugas"
          placeholder="Contoh: Tugas 1 - Membuat Landing Page dengan React"
          value={title}
          onChange={(e) => setTitle(e.currentTarget.value)}
          required
        />
        <Textarea
          label="Instruksi Tugas"
          placeholder="Jelaskan secara detail apa yang harus dikerjakan mahasiswa..."
          minRows={4}
          value={instructions}
          onChange={(e) => setInstructions(e.currentTarget.value)}
          required
        />
        <TextInput
          type="date"
          label="Tanggal Deadline (opsional)"
          value={dueDate}
          onChange={(e) => setDueDate(e.currentTarget.value)}
        />
        <Switch
          label="Tambahkan File Lampiran"
          checked={hasAttachment}
          onChange={(e) => {
            setHasAttachment(e.currentTarget.checked);
            if (!e.currentTarget.checked) {
              setAttachmentFile(null);
              setUploadState({ uploading: false, progress: 0, url: null, error: null });
            }
          }}
        />
        {renderAttachmentUpload()}
        <Group justify="flex-end" mt="md">
          <Button
            onClick={handleAddOrUpdate}
            disabled={!title.trim() || !instructions.trim() || uploadState.uploading}
            loading={uploadState.uploading}
          >
            {isEditMode ? "Simpan Perubahan" : "Tambah Tugas"}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}