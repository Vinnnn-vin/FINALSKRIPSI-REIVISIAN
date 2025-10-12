// src\app\frontend\dashboard\student\components\DashboardHeader.tsx

"use client";

import { Group, Title, ActionIcon, Loader, Button } from "@mantine/core";
import { IconRefresh, IconLogout } from "@tabler/icons-react";

interface DashboardHeaderProps {
  userName: string;
  onRefresh: () => void;
  onLogout: () => void;
  refreshing?: boolean;
}

export function DashboardHeader({
  userName,
  onRefresh,
  onLogout,
  refreshing,
}: DashboardHeaderProps) {
  return (
    <Group
      px="xl"
      py="md"
      justify="space-between"
      align="center"
      style={{ borderBottom: "1px solid #e9ecef", backgroundColor: "white" }}
    >
      <Title order={3} c="blue">
        Welcome, {userName}
      </Title>

      <Group>
        <ActionIcon
          onClick={onRefresh}
          variant="subtle"
          color="blue"
          size="lg"
          disabled={refreshing}
        >
          {refreshing ? <Loader size="sm" /> : <IconRefresh />}
        </ActionIcon>

        <Button
          variant="light"
          color="red"
          leftSection={<IconLogout size={16} />}
          onClick={onLogout}
        >
          Logout
        </Button>
      </Group>
    </Group>
  );
}
