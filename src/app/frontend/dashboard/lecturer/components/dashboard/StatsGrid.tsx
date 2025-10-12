// src\app\frontend\dashboard\lecturer\components\dashboard\StatsGrid.tsx

import {
  Grid,
  Card,
  Group,
  Text,
  ThemeIcon,
  Box,
  Progress,
  Stack,
} from "@mantine/core";
import {
  IconBook,
  IconUsers,
  IconTrendingUp,
  IconStar,
} from "@tabler/icons-react";
import { LecturerStatsType } from "../../types/lecturer";

interface StatsGridProps {
  stats: LecturerStatsType;
}

export default function StatsGrid({ stats }: StatsGridProps) {
  const items = [
    {
      label: "Total Courses",
      value: stats.totalCourses,
      icon: IconBook,
      color: "blue",
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      description: "Kursus yang telah dibuat",
    },
    {
      label: "Total Students",
      value: stats.totalStudents,
      icon: IconUsers,
      color: "green",
      gradient: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
      description: "Siswa yang terdaftar",
    },
    {
      label: "Total Enrollments",
      value: stats.totalEnrollments,
      icon: IconTrendingUp,
      color: "orange",
      gradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
      description: "Jumlah pendaftaran",
    },
    {
      label: "Average Rating",
      value: stats.averageRating,
      icon: IconStar,
      color: "yellow",
      gradient: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
      description: "Rating rata-rata",
    },
  ];

  return (
    <Grid gutter="lg">
      {items.map((item, i) => {
        const Icon = item.icon;
        return (
          <Grid.Col span={{ base: 12, sm: 6, lg: 3 }} key={i}>
            <Card
              withBorder
              shadow="lg"
              radius="xl"
              padding="xl"
              style={{
                transition: "all 0.3s ease",
                cursor: "pointer",
                position: "relative",
                overflow: "hidden",
              }}
              styles={{
                root: {
                  "&:hover": {
                    transform: "translateY(-5px)",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
                  },
                },
              }}
            >
              {/* Background Gradient */}
              <Box
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "100px",
                  height: "100px",
                  background: item.gradient,
                  opacity: 0.1,
                  borderRadius: "50%",
                  transform: "translate(30px, -30px)",
                }}
              />

              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <div style={{ flex: 1 }}>
                    <Text size="xs" fw={600} c="dimmed" tt="uppercase" mb={4}>
                      {item.label}
                    </Text>
                    <Text size="2xl" fw={700} style={{ lineHeight: 1.2 }}>
                      {typeof item.value === "number" &&
                      item.label.includes("Rating")
                        ? item.value.toFixed(1)
                        : item.value.toLocaleString()}
                    </Text>
                    <Text size="xs" c="dimmed" mt={4}>
                      {item.description}
                    </Text>
                  </div>

                  <ThemeIcon
                    size={50}
                    radius="xl"
                    style={{
                      background: item.gradient,
                      border: "none",
                    }}
                  >
                    <Icon size={24} color="white" />
                  </ThemeIcon>
                </Group>

                {/* Progress bar for visual enhancement */}
                <Progress
                  value={Math.min((item.value as number) * 10, 100)}
                  size="xs"
                  radius="xl"
                  style={{
                    "& .mantineProgressBar": {
                      background: item.gradient,
                    },
                  }}
                />
              </Stack>
            </Card>
          </Grid.Col>
        );
      })}
    </Grid>
  );
}
