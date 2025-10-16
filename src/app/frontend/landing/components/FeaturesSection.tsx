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
  Transition,
} from "@mantine/core";
import {
  IconPlaystationCircle,
  IconDownload,
  IconCertificate,
  IconShield,
} from "@tabler/icons-react";
import { useInView } from "react-intersection-observer"; // [ANIMATION] Import hook untuk deteksi scroll

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

  const { ref, inView } = useInView({
    triggerOnce: true, // Animasi hanya berjalan sekali
    threshold: 0.2, // Memicu saat 20% komponen terlihat
  });

  return (
    <Box
      style={{
        background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
      }}
      py="xl"
    >
      <Container size="xl">
        <Stack gap="xl" ref={ref}>
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
                <Transition
                  mounted={inView}
                  transition="fade-up"
                  duration={500}
                  timingFunction="ease-out"
                  keepMounted
                >
                  {(styles) => (
                    <Card
                      radius="xl"
                      p="xl"
                      h="200px"
                      style={{
                        ...styles,
                        background: "white",
                        border: "1px solid #e2e8f0",
                        transitionProperty: "all",
                        transitionDuration: "300ms",
                        transitionTimingFunction: "ease",
                      }}
                    >
                      <Stack align="center" gap="md">
                        <Box
                          style={{
                            background:
                              "linear-gradient(135deg, #667eea, #764ba2)",
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
                          <Text
                            size="sm"
                            c="dimmed"
                            style={{ lineHeight: 1.5 }}
                          >
                            {feature.desc}
                          </Text>
                        </Box>
                      </Stack>
                    </Card>
                  )}
                </Transition>
              </GridCol>
            ))}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
};
