/* eslint-disable @typescript-eslint/no-explicit-any */
// src\app\frontend\landing\listcategory\components\CategoryCard.tsx
"use client";
import React from "react";
import {
  Card,
  Stack,
  Group,
  Badge,
  Text,
  Divider,
  ActionIcon,
  Box,
} from "@mantine/core";
import {
  IconBook,
  IconUsers,
  IconArrowRight,
} from "@tabler/icons-react";
import Link from "next/link";
import { Category } from "../utils/categoryUtils";

interface CategoryCardProps {
  category: Category;
  showStatus?: boolean;
  size?: 'small' | 'medium' | 'large';
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  showStatus = true,
  size = 'medium',
}) => {
  const cardHeight = "100%";
  const iconSize = size === 'small' ? 20 : size === 'large' ? 28 : 24;
  const padding = size === 'small' ? "md" : "lg";

  return (
    <Card
      shadow="sm"
      padding={padding}
      radius="md"
      withBorder
      h={cardHeight}
      component={Link}
      href={`/frontend/landing/listcourse?category=${encodeURIComponent(category.name)}`}
      style={{
        cursor: "pointer",
        transition: "all 0.2s ease",
        textDecoration: "none",
        opacity: category.courseCount === 0 ? 0.6 : 1,
      }}
      styles={{
        root: {
          "&:hover": {
            transform: size === 'large' ? "translateY(-4px)" : "translateY(-2px)",
            boxShadow: size === 'large' ? "0 8px 25px rgba(0,0,0,0.15)" : "0 4px 20px rgba(0,0,0,0.1)",
          },
        },
      }}
    >
      <Stack gap="md">
        <Group justify="space-between">
          <Group>
            <Box
              style={{
                backgroundColor: `var(--mantine-color-${category.color}-1)`,
                borderRadius: "8px",
                padding: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <category.icon
                size={iconSize}
                color={`var(--mantine-color-${category.color}-7)`}
              />
            </Box>
            {size !== 'small' && (
              <Stack gap={0}>
                <Text fw={500}>{category.name}</Text>
                {showStatus && (
                  category.courseCount > 0 ? (
                    <Badge color="green" size="xs" variant="light">
                      Tersedia
                    </Badge>
                  ) : (
                    <Badge color="gray" size="xs" variant="light">
                      Segera Hadir
                    </Badge>
                  )
                )}
              </Stack>
            )}
          </Group>
          {size === 'small' && showStatus && (
            category.courseCount > 0 ? (
              <Badge color="green" size="xs">
                Tersedia
              </Badge>
            ) : (
              <Badge color="gray" size="xs">
                Segera Hadir
              </Badge>
            )
          )}
          {size === 'large' && showStatus && (
            <Badge color="green" size="xs">
              Tersedia
            </Badge>
          )}
        </Group>

        {size === 'small' && (
          <Text fw={500} size="sm">{category.name}</Text>
        )}

        <Text
          size="sm"
          c="dimmed"
          lineClamp={size === 'large' ? 3 : 2}
          style={{ minHeight: size === 'large' ? "60px" : "40px" }}
        >
          {category.description}
        </Text>

        <Divider />

        <Group justify="space-between" align="center">
          <Stack gap={2}>
            <Group gap={4}>
              <IconBook size={size === 'small' ? 10 : 12} color="gray" />
              <Text size="xs" c="dimmed">
                {category.courseCount} Kursus
              </Text>
            </Group>
            <Group gap={4}>
              <IconUsers size={size === 'small' ? 10 : 12} color="gray" />
              <Text size="xs" c="dimmed">
                {category.studentCount.toLocaleString()} Siswa
              </Text>
            </Group>
          </Stack>
          <ActionIcon
            variant="light"
            color={category.color}
            size="sm"
            disabled={category.courseCount === 0}
          >
            <IconArrowRight size={size === 'small' ? 12 : 14} />
          </ActionIcon>
        </Group>

        <Group gap={4}>
          {category.level.slice(0, 2).map((lvl: string | number | bigint | boolean | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | null | undefined, idx: any) => (
            <Badge
              key={`${category.id}-level-${idx}`}
              size="xs"
              variant="outline"
              color={category.color}
            >
              {lvl}
            </Badge>
          ))}
          {category.level.length > 2 && (
            <Badge
              key={`${category.id}-more-levels`}
              size="xs"
              variant="outline"
              color="gray"
            >
              +{category.level.length - 2}
            </Badge>
          )}
        </Group>
      </Stack>
    </Card>
  );
};