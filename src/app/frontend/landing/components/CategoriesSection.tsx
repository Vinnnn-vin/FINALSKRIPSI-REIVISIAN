// src\app\frontend\landing\components\CategoriesSection.tsx
"use client";

import React, { useState } from "react";
import {
  Container,
  Stack,
  Box,
  Title,
  Text,
  Badge,
  Grid,
  GridCol,
  Center,
  Card,
  Transition,
  Button,
} from "@mantine/core";
import { IconChevronRight, IconChevronDown } from "@tabler/icons-react";
import Link from "next/link";
import { CategoriesSectionProps } from "@/types/landing";

export const CategoriesSection: React.FC<CategoriesSectionProps> = ({
  categories,
  isLoading,
  mounted,
}) => {
  const [showAllCategories, setShowAllCategories] = useState(false);

  const getCategoryConfig = (categoryName: string) => {
    const configs: { [key: string]: { icon: string; gradient: string } } = {
      Programming: {
        icon: "💻",
        gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      },
      "Web Development": {
        icon: "🌐",
        gradient: "linear-gradient(135deg, #74b9ff 0%, #0984e3 100%)",
      },
      "Mobile Development": {
        icon: "📱",
        gradient: "linear-gradient(135deg, #00b894 0%, #00a085 100%)",
      },
      "Data Science": {
        icon: "📊",
        gradient: "linear-gradient(135deg, #a29bfe 0%, #6c5ce7 100%)",
      },
      "UI/UX Design": {
        icon: "🎨",
        gradient: "linear-gradient(135deg, #fd79a8 0%, #fdcb6e 100%)",
      },
      DevOps: {
        icon: "⚙️",
        gradient: "linear-gradient(135deg, #ff7675 0%, #d63031 100%)",
      },
      "Machine Learning": {
        icon: "🤖",
        gradient: "linear-gradient(135deg, #00cec9 0%, #00b894 100%)",
      },
      "Game Development": {
        icon: "🎮",
        gradient: "linear-gradient(135deg, #e17055 0%, #d63031 100%)",
      },
      default: {
        icon: "📚",
        gradient: "linear-gradient(135deg, #81ecec 0%, #74b9ff 100%)",
      },
    };
    return configs[categoryName] || configs.default;
  };

  // Sort categories by course count (descending) and limit display
  const sortedCategories = [...categories].sort(
    (a, b) => b.course_count - a.course_count
  );
  const displayedCategories = showAllCategories
    ? sortedCategories
    : sortedCategories.slice(0, 6);

  return (
    <Container size="xl" py="xl">
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
            KATEGORI PEMBELAJARAN
          </Badge>
          <Title order={2} fw={700} mb="sm" style={{ color: "#1a365d" }}>
            Temukan Passion Anda
          </Title>
          <Text size="lg" c="dimmed">
            Eksplorasi berbagai bidang keahlian yang tersedia
          </Text>
        </Box>

        <Grid>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, index) => (
              <GridCol
                key={`cat-skeleton-${index}`}
                span={{ base: 12, sm: 6, md: 4 }}
              >
                <CardSkeleton />
              </GridCol>
            ))
          ) : categories.length === 0 ? (
            <GridCol span={12}>
              <Center py="xl">
                <Text size="lg" c="dimmed">
                  Tidak ada kategori tersedia
                </Text>
              </Center>
            </GridCol>
          ) : (
            displayedCategories.map((category, index) => {
              const config = getCategoryConfig(category.category_name);
              return (
                <GridCol
                  key={category.category_id}
                  span={{ base: 12, sm: 6, md: 4 }}
                >
                  <Transition
                    mounted={mounted}
                    transition="slide-up"
                    duration={500}
                    enterDelay={index * 100}
                    exitDelay={index * 100}
                  >
                    {(styles) => (
                      <Card
                        shadow="lg"
                        padding="xl"
                        radius="xl"
                        h="200px"
                        component={Link}
                        href={`/frontend/landing/listcategory?category=${encodeURIComponent(
                          category.category_name
                        )}`}
                        style={{
                          ...styles,
                          cursor: "pointer",
                          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                          background: config.gradient,
                          border: "none",
                          position: "relative",
                          overflow: "hidden",
                          textDecoration: "none",
                          color: "inherit",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(-10px) scale(1.02)";
                          e.currentTarget.style.boxShadow =
                            "0 25px 50px rgba(102, 126, 234, 0.2)";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform =
                            "translateY(0) scale(1)";
                          e.currentTarget.style.boxShadow = "";
                        }}
                      >
                        <Box
                          style={{
                            position: "absolute",
                            top: "-30px",
                            right: "-30px",
                            width: "120px",
                            height: "120px",
                            background: "rgba(255,255,255,0.1)",
                            borderRadius: "50%",
                          }}
                        />
                        <Box
                          style={{
                            position: "absolute",
                            bottom: "-20px",
                            left: "-20px",
                            width: "80px",
                            height: "80px",
                            background: "rgba(255,255,255,0.08)",
                            borderRadius: "50%",
                          }}
                        />

                        <Stack
                          gap="md"
                          style={{
                            position: "relative",
                            zIndex: 1,
                            height: "100%",
                          }}
                          justify="center"
                        >
                          <Center>
                            <Box
                              style={{
                                fontSize: "3rem",
                                lineHeight: 1,
                                filter:
                                  "drop-shadow(0 4px 8px rgba(0,0,0,0.1))",
                              }}
                            >
                              {config.icon}
                            </Box>
                          </Center>
                          <Box ta="center">
                            <Title
                              order={3}
                              c="white"
                              fw={700}
                              mb="xs"
                              style={{
                                textShadow: "0 2px 10px rgba(0,0,0,0.2)",
                              }}
                            >
                              {category.category_name}
                            </Title>
                            <Text
                              c="rgba(255,255,255,0.9)"
                              fw={500}
                              style={{
                                textShadow: "0 1px 5px rgba(0,0,0,0.1)",
                              }}
                            >
                              {category.course_count} Kursus Tersedia
                            </Text>
                          </Box>
                        </Stack>

                        <IconChevronRight
                          size={20}
                          color="white"
                          style={{
                            position: "absolute",
                            bottom: "20px",
                            right: "20px",
                            opacity: 0.7,
                            transition: "all 0.3s ease",
                          }}
                        />
                      </Card>
                    )}
                  </Transition>
                </GridCol>
              );
            })
          )}
        </Grid>

        {/* Show more/less button for categories */}
        {!isLoading && categories.length > 6 && (
          <Center>
            <Button
              variant="subtle"
              size="md"
              radius="xl"
              onClick={() => setShowAllCategories(!showAllCategories)}
              rightSection={
                showAllCategories ? (
                  <IconChevronDown size={18} />
                ) : (
                  <IconChevronRight size={18} />
                )
              }
              style={{
                color: "#667eea",
                fontWeight: 600,
              }}
            >
              {showAllCategories
                ? "Tampilkan Lebih Sedikit"
                : `Tampilkan ${categories.length - 6} Kategori Lainnya`}
            </Button>
          </Center>
        )}
      </Stack>
    </Container>
  );
};

const CardSkeleton = () => (
  <Box
    style={{
      height: "200px",
      background: "#f1f5f9",
      borderRadius: "16px",
      border: "1px solid #e2e8f0",
      padding: "24px",
    }}
  >
    <Stack gap="md">
      <Box
        style={{
          height: "50px",
          width: "50px",
          background: "#e2e8f0",
          borderRadius: "50%",
          margin: "0 auto",
        }}
      />
      <Box
        style={{
          height: "24px",
          width: "70%",
          background: "#e2e8f0",
          borderRadius: "4px",
          margin: "0 auto",
        }}
      />
      <Box
        style={{
          height: "16px",
          width: "50%",
          background: "#e2e8f0",
          borderRadius: "4px",
          margin: "0 auto",
        }}
      />
    </Stack>
  </Box>
);
