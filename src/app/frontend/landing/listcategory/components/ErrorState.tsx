// src\app\frontend\landing\listcategory\components\ErrorState.tsx
"use client";
import React from "react";
import {
  Box,
  Container,
  Stack,
  Title,
  Text,
  Center,
  Alert,
  Button,
} from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";
import { useCategoryStore } from "../store/categoryStore";

export const ErrorState: React.FC = () => {
  const { error, isLoading, fetchCategories } = useCategoryStore();

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
          <Stack align="center" gap="xl">
            <Alert
              icon={<IconAlertCircle size={24} />}
              title="Terjadi Kesalahan"
              color="red"
              variant="light"
              styles={{ root: { maxWidth: "500px" } }}
            >
              {error}
            </Alert>
            <Button onClick={fetchCategories} loading={isLoading}>
              Coba Lagi
            </Button>
          </Stack>
        </Center>
      </Container>
    </Box>
  );
};
