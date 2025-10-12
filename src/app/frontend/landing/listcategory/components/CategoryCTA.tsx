// src\app\frontend\landing\listcategory\components\CategoryCTA.tsx
"use client";
import React from "react";
import { Box, Container, Stack, Title, Text, Group, Button } from "@mantine/core";

export const CategoryCTA: React.FC = () => {
  return (
    <Box
      style={{
        background: "linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)",
        color: "white",
      }}
      py="xl"
    >
      <Container size="lg">
        <Stack gap="xl" ta="center">
          <Stack gap="md">
            <Title order={2}>Tidak Menemukan Kategori yang Anda Cari?</Title>
            <Text size="lg" opacity={0.9}>
              Hubungi kami untuk request kategori baru atau dapatkan
              rekomendasi kursus personal
            </Text>
          </Stack>
          <Group justify="center">
            <Button size="lg" color="white" variant="white" c="red">
              Request Kategori Baru
            </Button>
            <Button size="lg" variant="outline" color="white">
              Dapatkan Rekomendasi
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
};