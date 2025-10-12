// src\app\frontend\dashboard\lecturer\components\materi\BabList.tsx

"use client";
import React from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { Stack } from "@mantine/core";
import BabItem from "./BabItem";
import type { BabType } from "../../types/material";

interface BabListProps {
  babs: BabType[];
  setBabs: (next: BabType[]) => void;
}

export default function BabList({ babs, setBabs }: BabListProps) {
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id !== over.id) {
      const oldIndex = babs.findIndex((b) => b.id === active.id);
      const newIndex = babs.findIndex((b) => b.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        setBabs(arrayMove(babs, oldIndex, newIndex));
      }
    }
  };

  const handleRemoveBab = (id: string) => {
    setBabs(babs.filter((b) => b.id !== id));
  };

  const handleRemoveContent = (babId: string, contentId: string) => {
    setBabs(
      babs.map((b) =>
        b.id === babId ? { ...b, items: b.items.filter((c) => c.id !== contentId) } : b
      )
    );
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={babs.map((b) => b.id)} strategy={verticalListSortingStrategy}>
        <Stack>
          {babs.map((bab) => (
            <BabItem
              key={bab.id}
              bab={bab}
              onRemoveBab={handleRemoveBab}
              onRemoveContent={handleRemoveContent}
            />
          ))}
        </Stack>
      </SortableContext>
    </DndContext>
  );
}
