// src\app\frontend\dashboard\lecturer\components\materi\BabItem.tsx

"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Paper,
  Group,
  Stack,
  Text,
  ActionIcon,
  Badge,
  Title,
  Button,
} from "@mantine/core";
import { IconGripVertical, IconTrash, IconEdit, IconPlus } from "@tabler/icons-react";
import ContentList from "./ContentList";
import type { BabType } from "../../types/material";

interface BabItemProps {
  bab: BabType;
  onRemoveBab: (id: string) => void;
  onEditBab?: (id: string) => void;
  onRemoveContent: (babId: string, contentId: string) => void;
}

export default function BabItem({
  bab,
  onRemoveBab,
  onEditBab,
  onRemoveContent,
}: BabItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: bab.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Paper ref={setNodeRef} style={style} withBorder p="md" radius="md">
      <Stack>
        <Group justify="space-between">
          <Group>
            <ActionIcon variant="subtle" {...attributes} {...listeners}>
              <IconGripVertical size={16} />
            </ActionIcon>
            <div>
              <Title order={5}>{bab.name}</Title>
              {bab.description && (
                <Text size="sm" c="dimmed">
                  {bab.description}
                </Text>
              )}
              <Badge size="xs" variant="light" mt="xs">
                {bab.items.length} konten
              </Badge>
            </div>
          </Group>
          <Group gap="xs">
            {onEditBab && (
              <ActionIcon onClick={() => onEditBab(bab.id)}>
                <IconEdit size={16} />
              </ActionIcon>
            )}
            <ActionIcon color="red" onClick={() => onRemoveBab(bab.id)}>
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        </Group>

        <ContentList
          items={bab.items}
          onRemove={(cid) => onRemoveContent(bab.id, cid)}
        />

        <Button
          size="xs"
          variant="light"
          leftSection={<IconPlus size={14} />}
        >
          Tambah Konten ke Bab ini
        </Button>
      </Stack>
    </Paper>
  );
}
