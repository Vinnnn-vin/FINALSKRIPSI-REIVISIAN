// src\app\frontend\dashboard\lecturer\materi\page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState } from "react";
import { Container, Title, Stack, Grid, Paper, Button, Group, LoadingOverlay, Alert, Stepper, Text, Accordion, Center } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { IconCheck } from "@tabler/icons-react";

import MaterialForm from "../components/materi/MaterialForm";
import ContentForm from "../components/materi/ContentForm";
import QuizBuilder from "../components/materi/QuizBuilder";
import AssignmentForm from "../components/materi/AssignmentForm";
import BabList from "../components/materi/BabList";
import { useQuizBuilder } from "../hooks/useQuizBuilder";
import type { BabType } from "../types/material";

export default function AddMaterialPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ✅ FIX: Mengambil courseId dari URL query parameter
  const courseId = searchParams.get("courseId");

  const [activeStep, setActiveStep] = useState(0);
  const [babs, setBabs] = useState<BabType[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const quizBuilder = useQuizBuilder();

  const nextStep = () => setActiveStep((current) => (current < 2 ? current + 1 : current));
  const prevStep = () => setActiveStep((current) => (current > 0 ? current - 1 : current));

  const handleAddBab = (name: string, description: string) => {
    const newBab: BabType = { id: `bab-${Date.now()}`, name, description, items: [] };
    setBabs((prev) => [...prev, newBab]);
  };

  const handleSaveAll = async () => {
    if (!courseId) {
      notifications.show({ title: "Error Kritis", message: "Course ID tidak ditemukan. Tidak bisa menyimpan.", color: "red" });
      return;
    }
    if (babs.length === 0) {
      notifications.show({ title: "Tidak Valid", message: "Anda harus menambahkan minimal satu bab.", color: "orange" });
      return;
    }
    
    setIsSubmitting(true);
    try {
      // ✅ FIX: Menggunakan endpoint API yang benar dan menyertakan courseId
      const response = await fetch(`/api/dashboard/lecturer/courses/${courseId}/materials`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ babs }), // Payload sudah benar
      });

      if (!response.ok) {
        const result = await response.json();
        throw new Error(result.error || "Gagal menyimpan materi ke server.");
      }
      
      notifications.show({
        title: "Sukses!",
        message: "Semua materi baru telah berhasil disimpan.",
        color: "green",
        icon: <IconCheck size={16} />,
      });

      // ✅ FIX: Mengarahkan pengguna ke halaman lihat materi setelah berhasil
      router.push(`/frontend/dashboard/lecturer/materi/${courseId}`);
    } catch (error: any) {
      notifications.show({ title: "Error", message: error.message, color: "red" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!courseId) {
    return (
      <Container p="lg">
        <Alert color="red" title="Course ID Tidak Ditemukan">
          Halaman ini tidak valid. Silakan kembali ke <Link href="/frontend/dashboard/lecturer">dasbor</Link> dan pilih kursus.
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg" py="xl">
      <LoadingOverlay visible={isSubmitting} />
      <Title order={2} mb="xl">Buat Materi Baru</Title>

      <Stepper active={activeStep} onStepClick={setActiveStep} orientation="horizontal">
        <Stepper.Step label="Langkah 1" description="Buat Daftar Bab">
          <Grid mt="xl">
            <Grid.Col span={{ base: 12, md: 7 }}>
              <MaterialForm onAddBab={handleAddBab} />
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Paper withBorder p="md" radius="md">
                <Title order={4} mb="md">Daftar Bab (Bisa di-drag & drop)</Title>
                <BabList babs={babs} setBabs={setBabs} />
              </Paper>
            </Grid.Col>
          </Grid>
        </Stepper.Step>

        <Stepper.Step label="Langkah 2" description="Isi Konten Setiap Bab">
          <Stack mt="xl">
            {babs.length > 0 ? (
              babs.map((bab) => (
                <Accordion key={bab.id} variant="separated">
                  <Accordion.Item value={bab.id}>
                    <Accordion.Control>{bab.name}</Accordion.Control>
                    <Accordion.Panel>
                      <Stack>
                        <ContentForm onAddContent={(item) => setBabs(prev => prev.map(b => b.id === bab.id ? { ...b, items: [...b.items, item] } : b))} />
                        <QuizBuilder {...quizBuilder} onAddQuiz={(item) => setBabs(prev => prev.map(b => b.id === bab.id ? { ...b, items: [...b.items, item] } : b))} />
                        <AssignmentForm onAddAssignment={(item) => setBabs(prev => prev.map(b => b.id === bab.id ? { ...b, items: [...b.items, item] } : b))} />
                      </Stack>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              ))
            ) : (
              <Alert color="blue">Anda belum membuat bab. Kembali ke Langkah 1 untuk memulai.</Alert>
            )}
          </Stack>
        </Stepper.Step>
        
        <Stepper.Step label="Langkah 3" description="Pratinjau & Simpan">
           <Paper withBorder p="md" radius="md" mt="xl">
              <Stack>
                <Title order={4}>Pratinjau Kurikulum Final</Title>
                <Text size="sm" c="dimmed">Pastikan semua bab dan konten sudah benar sebelum menyimpan.</Text>
                <BabList babs={babs} setBabs={setBabs} />
              </Stack>
            </Paper>
        </Stepper.Step>

        <Stepper.Completed>
            <Center mt="xl">
                <Stack align="center">
                    <IconCheck size={48} color="green"/>
                    <Title order={3}>Selesai Disusun!</Title>
                    <Text c="dimmed">Klik tombol di bawah untuk menyimpan semua materi ke database.</Text>
                </Stack>
            </Center>
        </Stepper.Completed>
      </Stepper>

      <Group justify="center" mt="xl">
        {activeStep > 0 && <Button variant="default" onClick={prevStep}>Kembali</Button>}
        {activeStep < 2 && <Button onClick={nextStep} disabled={babs.length === 0}>Lanjut ke Pengisian Konten</Button>}
        {activeStep === 2 && (
          <Button onClick={handleSaveAll} size="md" loading={isSubmitting} disabled={babs.length === 0}>
            Simpan Semua Materi ke Database
          </Button>
        )}
      </Group>
    </Container>
  );
}