// src\app\frontend\dashboard\student\components\StatsCards.tsx
// src\app\frontend\dashboard\student\features\dashboard-overview\components\StatsCards.tsx

import {
  SimpleGrid,
  Card,
  Group,
  Avatar,
  Box,
  Text,
  Progress,
  Stack,
} from "@mantine/core";
import {
  IconBook,
  IconAward,
  IconTrendingUp,
  IconCertificate,
} from "@tabler/icons-react";

interface StatsCardsProps {
  totalEnrolled: number;
  totalCompleted: number;
  totalCertificates: number;
  inProgressCount: number;
  completionRate?: number;
  loading?: boolean;
}

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: string;
  progress?: number;
  loading?: boolean;
}

function StatCard({ icon, label, value, color, progress, loading }: StatCardProps) {
  return (
    <Card shadow="sm" p="lg" radius="md" withBorder>
      <Group>
        <Avatar color={color} radius="xl" size="lg">
          {icon}
        </Avatar>
        <Box flex={1}>
          <Text c="dimmed" size="sm">
            {label}
          </Text>
          <Text size="xl" fw={700}>
            {loading ? "..." : value}
          </Text>
          {progress !== undefined && (
            <Stack gap="xs" mt="xs">
              <Progress value={progress} color={color} size="sm" />
              <Text size="xs" c="dimmed">
                {progress}% completion rate
              </Text>
            </Stack>
          )}
        </Box>
      </Group>
    </Card>
  );
}

export default function StatsCards({
  totalEnrolled,
  totalCompleted,
  totalCertificates,
  inProgressCount,
  completionRate,
  loading = false,
}: StatsCardsProps) {
  return (
    <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
      <StatCard
        icon={<IconBook size={24} />}
        label="Enrolled"
        value={totalEnrolled}
        color="blue"
        loading={loading}
      />
      <StatCard
        icon={<IconAward size={24} />}
        label="Completed"
        value={totalCompleted}
        color="green"
        progress={completionRate}
        loading={loading}
      />
      <StatCard
        icon={<IconTrendingUp size={24} />}
        label="In Progress"
        value={inProgressCount}
        color="cyan"
        loading={loading}
      />
      <StatCard
        icon={<IconCertificate size={24} />}
        label="Certificates"
        value={totalCertificates}
        color="orange"
        loading={loading}
      />
    </SimpleGrid>
  );
}