// src\app\frontend\landing\components\FeaturesSection.tsx
"use client";

import React from "react";
import {
  Box,
  Container,
  Stack,
  Title,
  Text,
  Grid,
  GridCol,
  Card,
} from "@mantine/core";
import {
  IconPlaystationCircle,
  IconDownload,
  IconCertificate,
  IconShield,
} from "@tabler/icons-react";

export const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: IconPlaystationCircle,
      title: "Video Berkualitas HD",
      desc: "Streaming lancar dengan kualitas terbaik",
    },
    {
      icon: IconDownload,
      title: "Akses Offline",
      desc: "Download materi untuk belajar kapan saja",
    },
    {
      icon: IconCertificate,
      title: "Sertifikat Resmi",
      desc: "Dapatkan sertifikat yang diakui industri",
    },
    {
      icon: IconShield,
      title: "Akses Seumur Hidup",
      desc: "Belajar tanpa batas waktu",
    },
  ];

  return (
    <Box
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
      py="xl"
    >
      <Container size="xl">
        <Stack gap="xl">
          <Box ta="center">
            <Title order={2} fw={700} mb="sm" style={{ color: "#1a365d" }}>
              Mengapa Memilih Platform Kami?
            </Title>
            <Text size="lg" c="dimmed">
              Fitur-fitur unggulan yang membuat pembelajaran menjadi lebih
              efektif
            </Text>
          </Box>
          <Grid>
            {features.map((feature, index) => (
              <GridCol key={index} span={{ base: 12, sm: 6, lg: 3 }}>
                <Card
                  radius="xl"
                  p="xl"
                  h="200px"
                  style={{
                    background: "white",
                    border: "1px solid #e2e8f0",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(102, 126, 234, 0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "";
                  }}
                >
                  <Stack align="center" gap="md">
                    <Box
                      style={{
                        background: "linear-gradient(135deg, #667eea, #764ba2)",
                        padding: "16px",
                        borderRadius: "50%",
                        color: "white",
                      }}
                    >
                      <feature.icon size={28} />
                    </Box>
                    <Box ta="center">
                      <Title
                        order={4}
                        fw={600}
                        mb="xs"
                        style={{ color: "#1a365d" }}
                      >
                        {feature.title}
                      </Title>
                      <Text size="sm" c="dimmed" style={{ lineHeight: 1.5 }}>
                        {feature.desc}
                      </Text>
                    </Box>
                  </Stack>
                </Card>
              </GridCol>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};