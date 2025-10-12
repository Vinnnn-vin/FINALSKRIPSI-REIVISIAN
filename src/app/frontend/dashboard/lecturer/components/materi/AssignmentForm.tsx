// src\app\frontend\dashboard\lecturer\components\materi\AssignmentForm.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { 
  Card, 
  Stack, 
  TextInput, 
  Textarea, 
  Button, 
  FileInput,
  Progress,
  Alert,
  Group,
  Text,
  Switch
} from "@mantine/core";
import { IconUpload, IconCheck, IconX, IconFileText } from "@tabler/icons-react";
import type { ContentItemType } from "../../types/material";

interface AssignmentFormProps {
  onAddAssignment: (item: ContentItemType) => void;
}

interface UploadState {
  uploading: boolean;
  progress: number;
  url: string | null;
  error: string | null;
}

export default function AssignmentForm({ onAddAssignment }: AssignmentFormProps) {
  const [title, setTitle] = useState("");
  const [instructions, setInstructions] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [attachmentFile, setAttachmentFile] = useState<File | null>(null);
  const [hasAttachment, setHasAttachment] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    url: null,
    error: null
  });

  const uploadAttachment = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('type', 'assignment');

    setUploadState(prev => ({ ...prev, uploading: true, progress: 0, error: null }));

    try {
      const response = await fetch('/api/dashboard/lecturer/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Upload failed');
      }

      const result = await response.json();
      
      if (!result.success) {
        throw new Error(result.error || 'Upload failed');
      }

      setUploadState(prev => ({ 
        ...prev, 
        uploading: false, 
        progress: 100, 
        url: result.data.url,
        error: null 
      }));

      return result.data.url;
    } catch (error: any) {
      setUploadState(prev => ({ 
        ...prev, 
        uploading: false, 
        progress: 0, 
        error: error.message 
      }));
      throw error;
    }
  };

  const handleAdd = async () => {
    if (!title.trim()) {
      alert("Judul tugas harus diisi");
      return;
    }

    if (!instructions.trim()) {
      alert("Instruksi tugas harus diisi");
      return;
    }

    try {
      let attachmentUrl = "";

      // Upload attachment if provided
      if (hasAttachment && attachmentFile) {
        attachmentUrl = await uploadAttachment(attachmentFile);
      }

      const item: ContentItemType = {
        id: `a-${Date.now()}`,
        type: "assignment",
        title,
        instructions,
        dueDate: dueDate || undefined,
        attachmentUrl: attachmentUrl || undefined,
      };

      onAddAssignment(item);

      // Reset form
      setTitle("");
      setInstructions("");
      setDueDate("");
      setAttachmentFile(null);
      setHasAttachment(false);
      setUploadState({
        uploading: false,
        progress: 0,
        url: null,
        error: null
      });

      alert("Tugas berhasil ditambahkan!");

    } catch (error: any) {
      console.error("Error adding assignment:", error);
      alert(`Gagal menambahkan tugas: ${error.message}`);
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
          onChange={setAttachmentFile}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png"
          leftSection={<IconUpload size={14} />}
          disabled={uploadState.uploading}
          description="File yang akan diberikan kepada student sebagai referensi atau template"
        />
        
        <Text size="xs" c="dimmed">
          Tipe file yang didukung: PDF, DOC, DOCX, XLS, XLSX, TXT, JPG, PNG (Maks. 50MB)
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
              <Text size="sm">File lampiran berhasil diupload</Text>
              <Button 
                size="xs" 
                variant="subtle" 
                component="a" 
                href={uploadState.url} 
                target="_blank"
                leftSection={<IconFileText size={12} />}
              >
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
          placeholder="Jelaskan secara detail apa yang harus dikerjakan mahasiswa, kriteria penilaian, format pengumpulan, dll."
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
          description="Jika kosong, tugas tidak memiliki deadline khusus"
        />

        <Switch
          label="Tambahkan File Lampiran"
          description="Upload file referensi, template, atau contoh untuk membantu student mengerjakan tugas"
          checked={hasAttachment}
          onChange={(e) => {
            setHasAttachment(e.currentTarget.checked);
            if (!e.currentTarget.checked) {
              setAttachmentFile(null);
              setUploadState({
                uploading: false,
                progress: 0,
                url: null,
                error: null
              });
            }
          }}
        />

        {renderAttachmentUpload()}

        <Group justify="space-between" mt="md">
          <Stack gap={0}>
            <Text size="sm" fw={500}>Ringkasan Tugas:</Text>
            <Text size="xs" c="dimmed">
              {title || "Belum ada judul"}
              {dueDate && ` • Deadline: ${new Date(dueDate).toLocaleDateString('id-ID')}`}
              {uploadState.url && " • Ada lampiran"}
            </Text>
          </Stack>
          
          <Button 
            onClick={handleAdd}
            disabled={
              !title.trim() || 
              !instructions.trim() ||
              (hasAttachment && attachmentFile && !uploadState.url) ||
              uploadState.uploading
            }
            loading={uploadState.uploading}
            leftSection={uploadState.uploading ? undefined : <IconCheck size={16} />}
          >
            {uploadState.uploading ? "Uploading..." : "Tambah Tugas ke Daftar Konten"}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}