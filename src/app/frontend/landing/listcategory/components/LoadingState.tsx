// src\app\frontend\landing\listcategory\components\LoadingState.tsx
"use client";
import React from "react";
import { Box, Container, Stack, Title, Text, Center, Loader } from "@mantine/core";

export const LoadingState: React.FC = () => {
  return (
    <Box>
      <Box
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          minHeight: "300px",
          display: "flex",
          alignItems: "center",
          color: "white",
        }}
      >
        <Container size="lg">
          <Stack gap="xl" ta="center">
            <Title size="h1" fw={700}>
              Kategori Kursus
            </Title>
            <Text size="xl" opacity={0.9}>
              Jelajahi berbagai kategori pembelajaran dan temukan passion Anda
            </Text>
          </Stack>
        </Container>
      </Box>

      <Container size="lg" py="xl">
        <Center h="50vh">
          <Stack align="center" gap="lg">
            <Loader size="lg" />
            <Text c="dimmed" size="lg">
              Memuat data kategori...
            </Text>
          </Stack>
        </Center>
      </Container>
    </Box>
  );
};
