// src\app\frontend\dashboard\lecturer\components\materi\ContentList.tsx
"use client";
import React from "react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Stack, Card, Text } from "@mantine/core";
import ContentItem from "./ContentItem";
import type { ContentItemType } from "../../types/material";

interface ContentListProps {
  items: ContentItemType[];
  onRemove: (id: string) => void;
  onEdit?: (id: string) => void;
}

export default function ContentList({ items, onRemove, onEdit }: ContentListProps) {
  return (
    <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
      <Stack>
        {items.length === 0 ? (
          <Card withBorder p="xl" ta="center">
            <Text c="dimmed">Belum ada konten di bab ini</Text>
          </Card>
        ) : (
          items.map((item) => (
            <ContentItem key={item.id} item={item} onRemove={onRemove} onEdit={onEdit} />
          ))
        )}
      </Stack>
    </SortableContext>
  );
}
