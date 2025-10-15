// // src\app\frontend\dashboard\lecturer\components\materi\BabList.tsx

// "use client";
// import React from "react";
// import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
// import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
// import { Stack } from "@mantine/core";
// import BabItem from "./BabItem";
// import type { BabType } from "../../types/material";

// interface BabListProps {
//   babs: BabType[];
//   setBabs: (next: BabType[]) => void;
//   onOpenContentModal: (babId: string) => void;
// }

// export default function BabList({ babs, setBabs, onOpenContentModal  }: BabListProps) {
//   const sensors = useSensors(useSensor(PointerSensor));

//   const handleDragEnd = (event: DragEndEvent) => {
//     const { active, over } = event;
//     if (!over) return;
//     if (active.id !== over.id) {
//       const oldIndex = babs.findIndex((b) => b.id === active.id);
//       const newIndex = babs.findIndex((b) => b.id === over.id);
//       if (oldIndex !== -1 && newIndex !== -1) {
//         setBabs(arrayMove(babs, oldIndex, newIndex));
//       }
//     }
//   };

//   const handleRemoveBab = (id: string) => {
//     setBabs(babs.filter((b) => b.id !== id));
//   };

//   const handleRemoveContent = (babId: string, contentId: string) => {
//     setBabs(
//       babs.map((b) =>
//         b.id === babId ? { ...b, items: b.items.filter((c) => c.id !== contentId) } : b
//       )
//     );
//   };

//   return (
//     <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
//       <SortableContext items={babs.map((b) => b.id)} strategy={verticalListSortingStrategy}>
//         <Stack>
//           {babs.map((bab) => (
//             <BabItem
//               key={bab.id}
//               bab={bab}
//               onRemoveBab={handleRemoveBab}
//               onRemoveContent={handleRemoveContent}
//               onOpenContentModal={() => onOpenContentModal(bab.id)}
//             />
//           ))}
//         </Stack>
//       </SortableContext>
//     </DndContext>
//   );
// }

"use client";
import React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Stack } from "@mantine/core";
import BabItem from "./BabItem";
import type { BabType, ContentItemType } from "../../types/material";

interface BabListProps {
  babs: BabType[];
  setBabs: (babs: BabType[] | ((prev: BabType[]) => BabType[])) => void;
  onOpenContentModal: (babId: string, content?: ContentItemType) => void;
  // [FIX] Tambahkan definisi prop yang hilang di sini
  onRemoveBab: (babId: string) => void;
  onRemoveContent: (babId: string, contentId: string) => void;
  // Prop untuk inline editing
  editingItemId: string | null;
  inlineFormData: { name: string; description: string };
  setInlineFormData: (data: { name: string; description: string }) => void;
  onStartInlineEdit: (item: BabType | ContentItemType) => void;
  onSaveInlineEdit: () => void;
  onCancelInlineEdit: () => void;
}

export default function BabList({
  babs,
  setBabs,
  onOpenContentModal,
  onRemoveBab,
  onRemoveContent,
  ...inlineEditProps
}: BabListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const activeId = active.id.toString();
    const overId = over.id.toString();

    setBabs((prevBabs) => {
      const newBabs = JSON.parse(JSON.stringify(prevBabs));

      if (activeId.startsWith("bab-") && overId.startsWith("bab-")) {
        const oldIndex = newBabs.findIndex((b: BabType) => b.id === activeId);
        const newIndex = newBabs.findIndex((b: BabType) => b.id === overId);
        if (oldIndex !== -1 && newIndex !== -1) {
          return arrayMove(newBabs, oldIndex, newIndex);
        }
      }

      if (!activeId.startsWith("bab-")) {
        let sourceBabIndex = -1,
          destBabIndex = -1;
        let activeItemIndex = -1,
          overItemIndex = -1;
        let activeItem: ContentItemType | null = null;

        // Cari item yang digeser dan bab asalnya
        for (let i = 0; i < newBabs.length; i++) {
          const itemIndex = newBabs[i].items.findIndex(
            (item: ContentItemType) => item.id === activeId
          );
          if (itemIndex !== -1) {
            sourceBabIndex = i;
            activeItemIndex = itemIndex;
            activeItem = newBabs[i].items[itemIndex];
            break;
          }
        }

        // Cari tujuan (bisa berupa item lain atau header bab)
        for (let i = 0; i < newBabs.length; i++) {
          if (newBabs[i].id === overId) {
            // Jika dijatuhkan di atas header Bab
            destBabIndex = i;
            overItemIndex = newBabs[i].items.length;
            break;
          }
          const itemIndex = newBabs[i].items.findIndex(
            (item: ContentItemType) => item.id === overId
          );
          if (itemIndex !== -1) {
            destBabIndex = i;
            overItemIndex = itemIndex;
            break;
          }
        }

        if (sourceBabIndex !== -1 && destBabIndex !== -1 && activeItem) {
          // Hapus item dari bab asal
          newBabs[sourceBabIndex].items.splice(activeItemIndex, 1);
          // Masukkan item ke bab tujuan
          newBabs[destBabIndex].items.splice(overItemIndex, 0, activeItem);
        }
      }

      return newBabs;
    });
  };

  const handleRemoveBab = (id: string) => {
    setBabs((prev) => prev.filter((b) => b.id !== id));
  };

  const handleRemoveContent = (babId: string, contentId: string) => {
    setBabs((prev) =>
      prev.map((b) =>
        b.id === babId
          ? { ...b, items: b.items.filter((c) => c.id !== contentId) }
          : b
      )
    );
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <Stack>
        <SortableContext
          items={babs.map((b) => b.id)}
          strategy={verticalListSortingStrategy}
        >
          {babs.map((bab) => (
            <BabItem
              key={bab.id}
              bab={bab}
              onRemoveBab={onRemoveBab}
              onRemoveContent={onRemoveContent}
              onOpenContentModal={onOpenContentModal}
              {...inlineEditProps}
            />
          ))}
        </SortableContext>
      </Stack>
    </DndContext>
  );
}
