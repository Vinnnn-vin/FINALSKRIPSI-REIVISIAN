// src\app\frontend\dashboard\lecturer\components\materi\ContentForm.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  Stack,
  Select,
  TextInput,
  Switch,
  Button,
  FileInput,
  Textarea,
  Progress,
  Alert,
  Group,
  Text,
} from "@mantine/core";
import { IconUpload, IconCheck, IconX } from "@tabler/icons-react";
import type { ContentItemType } from "../../types/material";

interface ContentFormProps {
  onAddContent: (item: ContentItemType) => void;
  onUpdateContent?: (item: ContentItemType) => void;
  initialData?: ContentItemType | null;
}

interface UploadState {
  uploading: boolean;
  progress: number;
  url: string | null;
  error: string | null;
}

export default function ContentForm({
  onAddContent,
  onUpdateContent,
  initialData,
}: ContentFormProps) {
  const isEditMode = !!initialData && initialData.type === "lesson";
  const [lessonType, setLessonType] = useState<"url" | "video" | "pdf">("url");
  const [lessonName, setLessonName] = useState("");
  const [lessonDescription, setLessonDescription] = useState("");
  const [lessonUrl, setLessonUrl] = useState("");
  const [lessonFile, setLessonFile] = useState<File | null>(null);
  const [isFree, setIsFree] = useState(false);
  const [uploadState, setUploadState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    url: null,
    error: null,
  });

  useEffect(() => {
    if (isEditMode && initialData) {
      setLessonName(initialData.name || "");
      setLessonDescription(initialData.description || "");
      setLessonType(initialData.lessonType || "url");
      setIsFree(initialData.isFree || false);
      if (initialData.lessonType === "url") {
        setLessonUrl(initialData.url || "");
      } else if (initialData.url) {
        setUploadState({
          uploading: false,
          progress: 100,
          url: initialData.url,
          error: null,
        });
      }
    } else {
      // Reset form jika bukan mode edit
      setLessonName("");
      setLessonDescription("");
      setLessonUrl("");
      setLessonFile(null);
      setIsFree(false);
      setLessonType("url");
      setUploadState({ uploading: false, progress: 0, url: null, error: null });
    }
  }, [initialData, isEditMode]);

  const uploadFile = async (file: File, category: string): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "material");
    formData.append("category", category);

    setUploadState((prev) => ({
      ...prev,
      uploading: true,
      progress: 0,
      error: null,
    }));

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
    if (!lessonName.trim()) {
      alert("Judul pelajaran harus diisi");
      return;
    }

    try {
      let finalUrl = "";

      if (lessonType === "url") {
        if (!lessonUrl.trim()) {
          alert("URL materi harus diisi");
          return;
        }
        finalUrl = lessonUrl;
      } else {
        // For file uploads, check if upload completed
        if (!uploadState.url) {
          if (!lessonFile) {
            alert("File harus dipilih");
            return;
          }
          alert("Menunggu upload file selesai...");
          return;
        }
        finalUrl = uploadState.url;
      }

      // const item: ContentItemType = {
      //   id: `c-${Date.now()}`,
      //   type: "lesson",
      //   name: lessonName,
      //   description: lessonDescription,
      //   lessonType,
      //   url: finalUrl,
      //   file: undefined, // Don't store file object, use URL instead
      //   isFree,
      // };

      const item: ContentItemType = {
        id: isEditMode ? initialData.id : `c-${Date.now()}`,
        type: "lesson",
        name: lessonName,
        description: lessonDescription,
        lessonType,
        url: finalUrl,
        isFree,
      };

      if (isEditMode && onUpdateContent) {
        onUpdateContent(item);
      } else {
        onAddContent(item);
      }

      // onAddContent(item);

      // Reset form
      setLessonName("");
      setLessonDescription("");
      setLessonUrl("");
      setLessonFile(null);
      setIsFree(false);
      setLessonType("url");
      setUploadState({
        uploading: false,
        progress: 0,
        url: null,
        error: null,
      });

      alert("Materi berhasil ditambahkan!");
    } catch (error: any) {
      console.error("Error adding content:", error);
      alert(`Gagal menambahkan materi: ${error.message}`);
    }
  };

  const renderFileUpload = () => {
    if (lessonType === "url") return null;

    const acceptTypes = {
      video: "video/*",
      pdf: "application/pdf",
    };

    const maxSizes = {
      video: "500MB",
      pdf: "50MB",
    };

    return (
      <Stack gap="sm">
        <FileInput
          label={`Upload ${lessonType.toUpperCase()}`}
          placeholder={`Pilih file ${lessonType}...`}
          value={lessonFile}
          onChange={async (file) => {
            setLessonFile(file);
            // Auto upload when file is selected
            if (file) {
              try {
                await uploadFile(file, lessonType);
              } catch (error) {
                console.error("Auto upload failed:", error);
              }
            } else {
              // Reset upload state if file is cleared
              setUploadState({
                uploading: false,
                progress: 0,
                url: null,
                error: null,
              });
            }
          }}
          accept={acceptTypes[lessonType as keyof typeof acceptTypes]}
          leftSection={<IconUpload size={14} />}
          disabled={uploadState.uploading}
        />

        <Text size="xs" c="dimmed">
          Maksimal ukuran file: {maxSizes[lessonType as keyof typeof maxSizes]}
        </Text>

        {uploadState.uploading && (
          <Stack gap="xs">
            <Text size="sm">Mengupload file...</Text>
            <Progress value={uploadState.progress} animated />
          </Stack>
        )}

        {uploadState.url && (
          <Alert color="green" icon={<IconCheck size={16} />}>
            File berhasil diupload: {uploadState.url}
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

  const renderPreview = () => {
    if (lessonType === "url" && lessonUrl) {
      // Preview for URL
      const isYoutube =
        lessonUrl.includes("youtube.com") || lessonUrl.includes("youtu.be");
      const isVimeo = lessonUrl.includes("vimeo.com");

      // Get YouTube video ID for embed
      const getYouTubeVideoId = (url: string) => {
        // Handle different YouTube URL formats
        if (url.includes("youtu.be/")) {
          return url.split("youtu.be/")[1]?.split(/[?&]/)[0];
        }
        if (url.includes("youtube.com/watch?v=")) {
          return url.split("v=")[1]?.split(/[?&]/)[0];
        }
        if (url.includes("youtube.com/embed/")) {
          return url.split("embed/")[1]?.split(/[?&]/)[0];
        }
        if (url.includes("youtube.com/v/")) {
          return url.split("v/")[1]?.split(/[?&]/)[0];
        }
        return null;
      };

      // Get Vimeo video ID for embed
      const getVimeoVideoId = (url: string) => {
        // Handle different Vimeo URL formats
        const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
        return match ? match[1] : null;
      };

      return (
        <Card withBorder p="sm">
          <Text size="sm" fw={500}>
            Preview URL:
          </Text>
          <Text size="xs" c="dimmed" style={{ wordBreak: "break-all" }} mb="sm">
            {lessonUrl}
          </Text>

          {isYoutube && (
            <>
              <Text size="xs" c="blue" mb="xs">
                Video platform terdeteksi: YouTube
              </Text>
              {(() => {
                const videoId = getYouTubeVideoId(lessonUrl);
                console.log("YouTube URL:", lessonUrl, "Video ID:", videoId); // Debug log
                if (videoId && videoId.length === 11) {
                  return (
                    <div
                      style={{
                        position: "relative",
                        paddingBottom: "56.25%",
                        height: 0,
                        overflow: "hidden",
                      }}
                    >
                      <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }}
                        allowFullScreen
                        title="YouTube Preview"
                      />
                    </div>
                  );
                } else {
                  return (
                    <div>
                      <Text size="xs" c="orange">
                        URL YouTube tidak valid untuk preview
                      </Text>
                      <Text size="xs" c="gray">
                        Video ID: {videoId || "tidak ditemukan"}
                      </Text>
                    </div>
                  );
                }
              })()}
            </>
          )}

          {isVimeo && (
            <>
              <Text size="xs" c="blue" mb="xs">
                Video platform terdeteksi: Vimeo
              </Text>
              {(() => {
                const videoId = getVimeoVideoId(lessonUrl);
                console.log("Vimeo URL:", lessonUrl, "Video ID:", videoId); // Debug log
                if (videoId) {
                  return (
                    <div
                      style={{
                        position: "relative",
                        paddingBottom: "56.25%",
                        height: 0,
                        overflow: "hidden",
                      }}
                    >
                      <iframe
                        src={`https://player.vimeo.com/video/${videoId}`}
                        style={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          width: "100%",
                          height: "100%",
                          border: "none",
                        }}
                        allowFullScreen
                        title="Vimeo Preview"
                      />
                    </div>
                  );
                } else {
                  return (
                    <div>
                      <Text size="xs" c="orange">
                        URL Vimeo tidak valid untuk preview
                      </Text>
                      <Text size="xs" c="gray">
                        Video ID: {videoId || "tidak ditemukan"}
                      </Text>
                    </div>
                  );
                }
              })()}
            </>
          )}

          {!isYoutube && !isVimeo && (
            <Text size="xs" c="gray">
              Preview tidak tersedia untuk URL ini
            </Text>
          )}
        </Card>
      );
    }

    if (uploadState.url) {
      return (
        <Card withBorder p="sm">
          <Text size="sm" fw={500}>
            File berhasil diupload:
          </Text>
          <Text size="xs" c="green" style={{ wordBreak: "break-all" }}>
            {uploadState.url}
          </Text>
          {lessonType === "video" && (
            <video
              controls
              style={{ width: "100%", maxHeight: "200px", marginTop: "8px" }}
            >
              <source src={uploadState.url} />
              Browser tidak mendukung video preview
            </video>
          )}
          {lessonType === "pdf" && (
            <div style={{ marginTop: "8px" }}>
              <iframe
                src={uploadState.url}
                style={{
                  width: "100%",
                  height: "400px",
                  border: "1px solid #ddd",
                }}
                title="PDF Preview"
              />
            </div>
          )}
        </Card>
      );
    }

    return null;
  };

  return (
    <Card withBorder radius="md" p="lg">
      <Stack>
        <TextInput
          label="Judul Pelajaran"
          value={lessonName}
          onChange={(e) => setLessonName(e.currentTarget.value)}
          placeholder="Contoh: Pengenalan React"
          required
        />

        <Textarea
          label="Deskripsi (opsional)"
          value={lessonDescription}
          onChange={(e) => setLessonDescription(e.currentTarget.value)}
          minRows={2}
          placeholder="Jelaskan isi materi pelajaran..."
        />

        <Select
          label="Tipe Media"
          value={lessonType}
          onChange={(v) => {
            setLessonType((v as any) || "url");
            // Reset upload state when changing type
            setUploadState({
              uploading: false,
              progress: 0,
              url: null,
              error: null,
            });
            setLessonFile(null);
            setLessonUrl("");
          }}
          data={[
            { value: "url", label: "URL (YouTube/Vimeo/Link)" },
            { value: "video", label: "Upload File Video" },
            { value: "pdf", label: "Upload File PDF" },
          ]}
        />

        {lessonType === "url" ? (
          <TextInput
            label="URL Materi"
            value={lessonUrl}
            onChange={(e) => setLessonUrl(e.currentTarget.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            required
          />
        ) : (
          renderFileUpload()
        )}

        {renderPreview()}

        <Switch
          label="Jadikan Gratis (preview untuk student)"
          description="Student dapat mengakses materi ini tanpa membeli course"
          checked={isFree}
          onChange={(e) => setIsFree(e.currentTarget.checked)}
        />

        <Group justify="space-between">
          <Stack gap={0}>
            <Text size="sm" c="dimmed">
              Status:{" "}
              {lessonType === "url"
                ? lessonUrl.trim()
                  ? "URL siap digunakan"
                  : "Masukkan URL"
                : uploadState.uploading
                ? "Sedang upload..."
                : uploadState.url
                ? "File siap digunakan"
                : uploadState.error
                ? "Upload gagal"
                : lessonFile
                ? "File dipilih, sedang upload..."
                : "Pilih file untuk upload"}
            </Text>
            {uploadState.error && (
              <Text size="xs" c="red">
                {uploadState.error}
              </Text>
            )}
          </Stack>

          <Button
            onClick={handleAddOrUpdate}
            disabled={
              !lessonName.trim() ||
              (lessonType === "url" && !lessonUrl.trim()) ||
              (lessonType !== "url" && !uploadState.url) ||
              uploadState.uploading
            }
            loading={uploadState.uploading}
          >
            {isEditMode ? "Simpan Perubahan" : "Tambah Pelajaran"}
          </Button>
        </Group>
      </Stack>
    </Card>
  );
}
