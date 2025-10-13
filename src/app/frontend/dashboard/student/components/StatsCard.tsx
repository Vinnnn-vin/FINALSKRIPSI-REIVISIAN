// src\app\frontend\dashboard\student\components\StatsCard.tsx
"use client";

import { Card, Text, Group, RingProgress, Progress, Center } from '@mantine/core';
import { Icon } from '@tabler/icons-react';

interface StatsCardProps {
  title: string;
  value: number;
  icon: Icon;
  color: string;
  progress?: number;
}

export function StatsCard({ title, value, icon: Icon, color, progress }: StatsCardProps) {
  return (
    <Card withBorder radius="md" p="lg">
      <Group>
        <RingProgress
          size={80}
          roundCaps
          thickness={8}
          sections={[{ value: progress ?? 100, color }]}
          label={
            <Center>
              <Icon size="1.8rem" stroke={1.5} color={color} />
            </Center>
          }
        />
        <div>
          <Text c="dimmed" size="xs" tt="uppercase" fw={700}>
            {title}
          </Text>
          <Text fw={700} size="xl">
            {value}
          </Text>
        </div>
      </Group>
      {progress !== undefined && (
        <>
            <Text c="dimmed" size="sm" mt="md">
                <Text component="span" c={progress === 100 ? 'teal' : 'blue'} fw={700}>
                    {progress}%
                </Text>{' '}
                Completion Rate
            </Text>
            <Progress value={progress} mt={5} color={progress === 100 ? 'teal' : 'blue'} />
        </>
      )}
    </Card>
  );
}