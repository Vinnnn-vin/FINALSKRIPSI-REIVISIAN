"use client";
import React from "react";
import {
  Box,
  Container,
  Grid,
  GridCol,
  Title,
  Text,
  Button,
  Badge,
  Group,
  Transition,
} from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";
import Image from "next/image";
import { HeroSectionProps } from "@/types/landing";

export const HeroSection: React.FC<HeroSectionProps> = ({ mounted }) => {
  return (
    <Box
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "90vh",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated background elements */}
      <Box
        style={{
          position: "absolute",
          top: "10%",
          left: "10%",
          width: "100px",
          height: "100px",
          background: "rgba(255,255,255,0.1)",
          borderRadius: "50%",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <Box
        style={{
          position: "absolute",
          top: "60%",
          right: "15%",
          width: "150px",
          height: "150px",
          background: "rgba(255,255,255,0.08)",
          borderRadius: "50%",
          animation: "float 4s ease-in-out infinite 2s",
        }}
      />
      <Box
        style={{
          position: "absolute",
          bottom: "20%",
          left: "20%",
          width: "80px",
          height: "80px",
          background: "rgba(255,255,255,0.12)",
          borderRadius: "50%",
          animation: "float 5s ease-in-out infinite 1s",
        }}
      />

      <Container size="xl" style={{ position: "relative", zIndex: 1 }}>
        <Grid align="center">
          <GridCol span={{ base: 12, lg: 6 }}>
            {/* [ANIMATION] Menggunakan Transition untuk efek slide-up saat halaman dimuat */}
            <Transition mounted={mounted} transition="slide-up" duration={800}>
              {(styles) => (
                <Box style={styles}>
                  <Badge
                    variant="light"
                    color="white"
                    size="lg"
                    radius="xl"
                    mb="md"
                    style={{
                      background: "rgba(255,255,255,0.2)",
                      color: "white",
                      backdropFilter: "blur(10px)",
                    }}
                  >
                    🚀 Platform Pembelajaran #1 di Indonesia
                  </Badge>
                  <Title
                    size="h1"
                    fw={800}
                    style={{
                      fontSize: "3.5rem",
                      lineHeight: 1.1,
                      color: "white",
                      textShadow: "0 4px 20px rgba(0,0,0,0.2)",
                      marginBottom: "1rem",
                    }}
                  >
                    Transformasi Karir Dimulai dari{" "}
                    <Text span c="orange" inherit>
                      {" "}
                      Sini{" "}
                    </Text>
                  </Title>
                  <Text
                    size="xl"
                    style={{
                      color: "rgba(255,255,255,0.9)",
                      lineHeight: 1.6,
                      maxWidth: "500px",
                      marginBottom: "2rem",
                    }}
                  >
                    Bergabunglah dengan 50,000+ profesional yang telah mengubah
                    karir mereka melalui pembelajaran berkualitas tinggi dari
                    para ahli terbaik.
                  </Text>
                  <Group>
                    <Button
                      size="xl"
                      color="orange"
                      radius="xl"
                      component={Link}
                      href="/frontend/landing/listcourse"
                      rightSection={<IconChevronRight size={20} />}
                      style={{
                        background: "linear-gradient(45deg, #ff6b35, #f7931e)",
                        border: "none",
                        boxShadow: "0 8px 25px rgba(255,107,53,0.4)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      Mulai Belajar
                    </Button>
                    {/* [REMOVED] Tombol "Tonton Demo" dihapus */}
                  </Group>
                </Box>
              )}
            </Transition>
          </GridCol>
          <GridCol span={{ base: 12, lg: 6 }}>
            <Transition
              mounted={mounted}
              transition="slide-left"
              duration={800}
              timingFunction="ease"
            >
              {(styles) => (
                <Box style={{ ...styles, position: "relative" }}>
                  <Image
                    src="/SIGNIN.jpg"
                    alt="Learning illustration"
                    width={600}
                    height={400}
                    style={{
                      borderRadius: "16px",
                      boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
                      transform:
                        "perspective(1000px) rotateY(-5deg) rotateX(5deg)",
                      width: "100%",
                      height: "auto",
                    }}
                  />
                </Box>
              )}
            </Transition>
          </GridCol>
        </Grid>
      </Container>
    </Box>
  );
};
