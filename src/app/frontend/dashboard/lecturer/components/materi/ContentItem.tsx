"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Paper, Group, Text, ActionIcon, Badge } from "@mantine/core";
import { IconGripVertical, IconTrash, IconEdit, IconFileText, IconVideo, IconLink, IconClipboardText } from "@tabler/icons-react";
import type { ContentItemType } from "../../types/material";

interface ContentItemProps {
  item: ContentItemType;
  onRemove: (id: string) => void;
  onEdit?: (item: ContentItemType) => void;
}

function getIcon(item: ContentItemType) {
  if (item.type === "lesson") {
    if (item.lessonType === "video") return <IconVideo size={18} color="blue" />;
    if (item.lessonType === "pdf") return <IconFileText size={18} color="red" />;
    if (item.lessonType === "url") return <IconLink size={18} color="orange" />;
    return <IconFileText size={18} />;
  }
  if (item.type === "quiz") return <IconClipboardText size={18} color="green" />;
  if (item.type === "assignment") return <IconClipboardText size={18} color="violet" />;
  return <IconFileText size={18} />;
}

function getBadge(item: ContentItemType) {
  if (item.type === "lesson") {
    return <Badge size="xs" color="blue" variant="light">Pelajaran</Badge>;
  }
  if (item.type === "quiz") {
    return <Badge size="xs" color="green" variant="light">Quiz</Badge>;
  }
  if (item.type === "assignment") {
    return <Badge size="xs" color="violet" variant="light">Tugas</Badge>;
  }
  return null;
}

export default function ContentItem({ item, onRemove, onEdit }: ContentItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <Paper ref={setNodeRef} style={style} withBorder p="sm" radius="md">
      <Group justify="space-between">
        <Group>
          <ActionIcon variant="transparent" {...attributes} {...listeners} style={{ cursor: 'grab' }}>
            <IconGripVertical size={16} />
          </ActionIcon>
          <div>
            <Group gap="xs">
              {getIcon(item)}
              <Text fw={500}>{item.name || item.title}</Text>
            </Group>
            {getBadge(item)}
          </div>
        </Group>
        <Group gap="xs">
          {onEdit && (
            <ActionIcon variant="light" color="blue" onClick={() => onEdit(item)}>
              <IconEdit size={14} />
            </ActionIcon>
          )}
          <ActionIcon variant="light" color="red" onClick={() => onRemove(item.id)}>
            <IconTrash size={14} />
          </ActionIcon>
        </Group>
      </Group>
    </Paper>
  );
}