// src\app\frontend\landing\components\StatsSection.tsx
"use client";

import React from "react";
import {
  Container,
  Card,
  Grid,
  GridCol,
  Title,
  Text,
  Box,
  Center,
} from "@mantine/core";
import {
  IconUsers,
  IconPlaystationCircle,
  IconTrophy,
  IconStar,
} from "@tabler/icons-react";
import { useInView } from "react-intersection-observer"; // <-- 1. Import hook
import { AnimatedCounter } from "./AnimatedCounter"; // <-- 2. Import komponen baru

export const StatsSection: React.FC = () => {
  // 👇 3. Ubah struktur data untuk memisahkan angka dan teks
  const stats = [
    {
      target: 50000, // Angka murni
      suffix: "+", // Teks tambahan
      label: "Siswa Aktif",
      icon: IconUsers,
      color: "#667eea",
    },
    {
      target: 500,
      suffix: "+",
      label: "Kursus Premium",
      icon: IconPlaystationCircle,
      color: "#00b894",
    },
    {
      target: 150,
      suffix: "+",
      label: "Instruktur Expert",
      icon: IconTrophy,
      color: "#ff6b35",
    },
    {
      target: 98,
      suffix: "%",
      label: "Tingkat Kepuasan",
      icon: IconStar,
      color: "#ffd43b",
    },
  ];

  // 👇 4. Gunakan hook untuk mendeteksi kapan komponen terlihat
  const { ref, inView } = useInView({
    triggerOnce: true, // Animasi hanya berjalan sekali
    threshold: 0.1, // Memicu saat 10% komponen terlihat
  });

  return (
    <Container
      ref={ref} // <-- 5. Terapkan ref ke container
      size="xl"
      py="xl"
      style={{ marginTop: "-50px", position: "relative", zIndex: 2 }}
    >
      <Card
        shadow="xl"
        radius="xl"
        p="xl"
        style={{
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        <Grid>
          {stats.map((stat, index) => (
            <GridCol key={index} span={{ base: 6, sm: 3 }}>
              <Center style={{ flexDirection: "column", gap: "12px" }}>
                <Box
                  style={{
                    background: `${stat.color}15`,
                    padding: "12px",
                    borderRadius: "50%",
                    border: `2px solid ${stat.color}25`,
                  }}
                >
                  <stat.icon size={24} color={stat.color} />
                </Box>
                <Box ta="center">
                  <Title
                    order={2}
                    style={{
                      color: stat.color,
                      fontSize: "2rem",
                      fontWeight: 800,
                    }}
                  >
                    {/* 👇 6. Ganti teks statis dengan komponen animasi */}
                    {inView && (
                      <AnimatedCounter
                        to={inView ? stat.target : 0} // Kondisi inView dipindah ke prop 'to'
                        suffix={stat.suffix}
                        c={stat.color} // 'c' untuk color
                        fz="2rem" // 'fz' untuk font-size
                        fw={800} // 'fw' untuk font-weight
                      />
                    )}
                  </Title>
                  <Text size="sm" c="dimmed" fw={500}>
                    {stat.label}
                  </Text>
                </Box>
              </Center>
            </GridCol>
          ))}
        </Grid>
      </Card>
    </Container>
  );
};
