// src\app\frontend\landing\components\TestimonialsSection.tsx
/* eslint-disable react/no-unescaped-entities */
"use client";

import React from "react";
import {
  Box,
  Container,
  Stack,
  Title,
  Text,
  Badge,
  Grid,
  GridCol,
  Card,
  Group,
  Avatar,
  Transition,
} from "@mantine/core";
import { IconStar } from "@tabler/icons-react";
import { Testimonial, TestimonialsSectionProps } from "@/types/landing";



export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({
  mounted,
}) => {
  const testimonials: Testimonial[] = [
    {
      name: "Ahmad Pratama",
      role: "Full Stack Developer",
      content:
        "Platform pembelajaran yang sangat membantu. Materi yang disajikan mudah dipahami dan instruktur sangat kompeten.",
      avatar: "AP",
      rating: 5,
    },
    {
      name: "Sari Indah",
      role: "Digital Marketer",
      content:
        "Kursus-kursus di sini sangat berkualitas. Saya berhasil meningkatkan skill marketing saya secara signifikan.",
      avatar: "SI",
      rating: 5,
    },
    {
      name: "Budi Santoso",
      role: "Data Scientist",
      content:
        "Metode pembelajaran yang interaktif dan project-based membuat saya cepat memahami konsep data science.",
      avatar: "BS",
      rating: 4,
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
            <Badge
              variant="light"
              color="blue"
              size="lg"
              radius="xl"
              mb="md"
              style={{ background: "#667eea15", color: "#667eea" }}
            >
              TESTIMONIAL
            </Badge>
            <Title order={2} fw={700} mb="sm" style={{ color: "#1a365d" }}>
              Kata Mereka yang Sudah Berhasil
            </Title>
            <Text size="lg" c="dimmed">
              Cerita sukses dari alumni yang telah mengubah karir mereka
            </Text>
          </Box>

          <Grid>
            {testimonials.map((testimonial, index) => (
              <GridCol key={index} span={{ base: 12, md: 4 }}>
                <Transition
                  mounted={mounted}
                  transition="slide-up"
                  duration={500}
                  enterDelay={index * 150}
                  exitDelay={index * 150}
                >
                  {(styles) => (
                    <Card
                      shadow="lg"
                      radius="xl"
                      p="xl"
                      h="300px"
                      style={{
                        ...styles,
                        background: "white",
                        border: "1px solid #e2e8f0",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-8px)";
                        e.currentTarget.style.boxShadow =
                          "0 20px 40px rgba(102, 126, 234, 0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "";
                      }}
                    >
                      <Stack
                        justify="space-between"
                        style={{ height: "100%" }}
                      >
                        <Box>
                          <Group gap="xs" mb="md">
                            {Array.from({ length: 5 }).map((_, starIndex) => (
                              <IconStar
                                key={starIndex}
                                size={16}
                                fill={
                                  starIndex < testimonial.rating
                                    ? "#ffd43b"
                                    : "none"
                                }
                                color={
                                  starIndex < testimonial.rating
                                    ? "#ffd43b"
                                    : "#e2e8f0"
                                }
                              />
                            ))}
                          </Group>
                          <Text
                            size="md"
                            c="dimmed"
                            style={{ lineHeight: 1.6, fontStyle: "italic" }}
                          >
                            "{testimonial.content}"
                          </Text>
                        </Box>

                        <Group>
                          <Avatar
                            size="lg"
                            radius="xl"
                            style={{
                              background: "linear-gradient(45deg, #667eea, #764ba2)",
                              fontWeight: 600,
                            }}
                          >
                            {testimonial.avatar}
                          </Avatar>
                          <Box>
                            <Text fw={600} style={{ color: "#1a365d" }}>
                              {testimonial.name}
                            </Text>
                            <Text size="sm" c="dimmed">
                              {testimonial.role}
                            </Text>
                          </Box>
                        </Group>
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