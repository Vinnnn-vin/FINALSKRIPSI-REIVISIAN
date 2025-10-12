// src\app\frontend\dashboard\admin\components\DashboardHeader.tsx

"use client";

import { Group, Title, Button, Loader, Menu, Box, Flex, Paper, Text } from "@mantine/core";
import { IconBook, IconClipboardList, IconDownload, IconRefresh, IconUsers } from "@tabler/icons-react";

interface Props {
  refreshing: boolean;
  fetchDashboardData: () => void;
  exportData: (type: string) => void;
}

const DashboardHeader = ({
  refreshing,
  fetchDashboardData,
  exportData,
}: Props) => {
  return (
    <Paper shadow="xs" p="xl" radius="lg" mb="xl" withBorder>
      <Flex justify="space-between" align="center">
        <Box>
          <Title order={1} size="h2" fw={600} c="dark.8" mb="xs">
            Admin Dashboard
          </Title>
          <Text size="sm" c="dimmed">
            Manage users, courses, and monitor analytics
          </Text>
        </Box>
        
        <Group gap="sm">
          <Menu shadow="lg" width={220} radius="md" position="bottom-end">
            <Menu.Target>
              <Button
                leftSection={<IconDownload size={18} />}
                variant="light"
                color="blue"
                radius="md"
                size="md"
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  border: 'none'
                }}
              >
                Export Data
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item 
                leftSection={<IconUsers size={16} />}
                onClick={() => exportData("users")}
                style={{ borderRadius: '8px' }}
              >
                Export Users
              </Menu.Item>
              <Menu.Item 
                leftSection={<IconBook size={16} />}
                onClick={() => exportData("courses")}
                style={{ borderRadius: '8px' }}
              >
                Export Courses
              </Menu.Item>
              <Menu.Item 
                leftSection={<IconClipboardList size={16} />}
                onClick={() => exportData("enrollments")}
                style={{ borderRadius: '8px' }}
              >
                Export Enrollments
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>

          <Button
            onClick={fetchDashboardData}
            leftSection={refreshing ? <Loader size="xs" color="white" /> : <IconRefresh size={18} />}
            radius="md"
            size="md"
            variant="filled"
            color="teal"
            loading={refreshing}
          >
            Refresh
          </Button>
        </Group>
      </Flex>
    </Paper>
  );
};

export default DashboardHeader;
