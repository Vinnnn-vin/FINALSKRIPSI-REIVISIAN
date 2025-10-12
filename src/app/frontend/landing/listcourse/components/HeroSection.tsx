// src\app\frontend\landing\listcourse\components\HeroSection.tsx

import React from "react";
import { Box, Container, Title, Text, Group, Stack } from "@mantine/core";

interface HeroSectionProps {
  totalCourses: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ totalCourses }) => {
  return (
    <Box
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "300px",
        display: "flex",
        alignItems: "center",
        color: "white",
      }}
      py="xl"
    >
      <Container size="xl">
        <Stack gap="xl" ta="center">
          <Stack gap="md">
            <Title order={1} size="3rem" fw={700} style={{ color: "white" }}>
              Semua Kursus
            </Title>
            <Text size="xl" style={{ opacity: 0.9, lineHeight: 1.6 }}>
              Temukan kursus online terbaik dari instruktur berpengalaman
            </Text>
          </Stack>

          <Group justify="center" gap="xl">
            <Stack align="center" gap={4}>
              <Text size="2xl" fw={700}>
                {totalCourses}
              </Text>
              <Text size="sm" style={{ opacity: 0.8 }}>
                Total Kursus
              </Text>
            </Stack>
            <Stack align="center" gap={4}>
              <Text size="2xl" fw={700}>
                50+
              </Text>
              <Text size="sm" style={{ opacity: 0.8 }}>
                Kategori
              </Text>
            </Stack>
            <Stack align="center" gap={4}>
              <Text size="2xl" fw={700}>
                10K+
              </Text>
              <Text size="sm" style={{ opacity: 0.8 }}>
                Siswa Aktif
              </Text>
            </Stack>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
};

export default HeroSection;
