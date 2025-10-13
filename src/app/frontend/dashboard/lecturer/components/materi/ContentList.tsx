"use client";
import React from "react";
import { Stack, Card, Text } from "@mantine/core";
import ContentItem from "./ContentItem";
import type { ContentItemType } from "../../types/material";

interface ContentListProps {
  items: ContentItemType[];
  onRemove: (id: string) => void;
  onEdit?: (item: ContentItemType) => void;
}

export default function ContentList({ items, onRemove, onEdit }: ContentListProps) {
  return (
    <Stack>
      {items.length === 0 ? (
        <Card withBorder p="xl" ta="center">
          <Text c="dimmed">Belum ada konten di bab ini. Klik tombol di bawah untuk menambahkan.</Text>
        </Card>
      ) : (
        items.map((item) => (
          <ContentItem key={item.id} item={item} onRemove={onRemove} onEdit={onEdit} />
        ))
      )}
    </Stack>
  );
}