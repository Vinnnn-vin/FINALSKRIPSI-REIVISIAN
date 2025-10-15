"use client";
import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Paper, Group, Stack, Text, ActionIcon, Badge, Title, Button, TextInput, Textarea } from "@mantine/core";
import { IconGripVertical, IconTrash, IconEdit, IconPlus, IconDeviceFloppy, IconX } from "@tabler/icons-react";
import ContentList from "./ContentList";
import type { BabType, ContentItemType } from "../../types/material";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface BabItemProps {
  bab: BabType;
  onRemoveBab: (id: string) => void;
  onRemoveContent: (babId: string, contentId: string) => void;
  onOpenContentModal: (babId: string, content?: ContentItemType) => void;
  editingItemId: string | null;
  inlineFormData: { name: string; description: string };
  setInlineFormData: (data: { name: string; description: string }) => void;
  onStartInlineEdit: (item: BabType | ContentItemType) => void;
  onSaveInlineEdit: () => void;
  onCancelInlineEdit: () => void;
}

export default function BabItem({
  bab,
  onRemoveBab,
  onRemoveContent,
  onOpenContentModal,
  editingItemId,
  onStartInlineEdit,
  ...inlineEditProps
}: BabItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: bab.id });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const isEditingThisBab = editingItemId === bab.id;

  return (
    <Paper ref={setNodeRef} style={style} withBorder p="md" radius="md">
      <Stack>
        <Group justify="space-between">
          <Group style={{ flex: 1 }}>
            <ActionIcon variant="transparent" {...attributes} {...listeners} style={{ cursor: 'grab' }}>
              <IconGripVertical size={18} />
            </ActionIcon>
            {isEditingThisBab ? (
              <Stack gap="xs" style={{ flex: 1 }}>
                <TextInput
                  value={inlineEditProps.inlineFormData.name}
                  onChange={(e) => inlineEditProps.setInlineFormData({ ...inlineEditProps.inlineFormData, name: e.currentTarget.value })}
                  size="xs"
                />
                <Textarea
                  value={inlineEditProps.inlineFormData.description}
                  onChange={(e) => inlineEditProps.setInlineFormData({ ...inlineEditProps.inlineFormData, description: e.currentTarget.value })}
                  size="xs"
                  minRows={1}
                />
              </Stack>
            ) : (
              <div>
                <Title order={5}>{bab.name}</Title>
                {bab.description && <Text size="sm" c="dimmed">{bab.description}</Text>}
                <Badge size="xs" variant="light" mt="xs">{bab.items.length} konten</Badge>
              </div>
            )}
          </Group>
          
          {/* [FIX] Memastikan grup tombol yang benar dirender */}
          {isEditingThisBab ? (
            <Group gap="xs">
              <ActionIcon variant="light" color="green" onClick={inlineEditProps.onSaveInlineEdit}><IconDeviceFloppy size={16} /></ActionIcon>
              <ActionIcon variant="light" color="red" onClick={inlineEditProps.onCancelInlineEdit}><IconX size={16} /></ActionIcon>
            </Group>
          ) : (
            <Group gap="xs">
              <ActionIcon variant="light" color="blue" onClick={() => onStartInlineEdit(bab)}><IconEdit size={16} /></ActionIcon>
              <ActionIcon variant="light" color="red" onClick={() => onRemoveBab(bab.id)}><IconTrash size={16} /></ActionIcon>
            </Group>
          )}
        </Group>

        <SortableContext items={bab.items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <ContentList
            items={bab.items}
            onRemove={(contentId) => onRemoveContent(bab.id, contentId)}
            onEdit={(contentItem) => onOpenContentModal(bab.id, contentItem)}
          />
        </SortableContext>
        
        <Button size="xs" variant="light" leftSection={<IconPlus size={14} />} onClick={() => onOpenContentModal(bab.id)}>
          Tambah Konten ke Bab ini
        </Button>
      </Stack>
    </Paper>
  );
}
// // src\app\frontend\dashboard\lecturer\components\materi\BabItem.tsx

// "use client";
// import React from "react";
// import { useSortable } from "@dnd-kit/sortable";
// import { CSS } from "@dnd-kit/utilities";
// import {
//   Paper,
//   Group,
//   Stack,
//   Text,
//   ActionIcon,
//   Badge,
//   Title,
//   Button,
// } from "@mantine/core";
// import {
//   IconGripVertical,
//   IconTrash,
//   IconEdit,
//   IconPlus,
// } from "@tabler/icons-react";
// import ContentList from "./ContentList";
// import type { BabType, ContentItemType } from "../../types/material";
// import {
//   SortableContext,
//   verticalListSortingStrategy,
// } from "@dnd-kit/sortable";

// interface BabItemProps {
//   bab: BabType;
//   // [FIX] Terima prop dari BabList
//   onRemoveBab: (id: string) => void;
//   onRemoveContent: (babId: string, contentId: string) => void;
//   onOpenContentModal: (babId: string, content?: ContentItemType) => void;
//   // Props untuk inline editing
//   editingItemId: string | null;
//   inlineFormData: { name: string; description: string };
//   setInlineFormData: (data: { name: string; description: string }) => void;
//   onStartInlineEdit: (item: BabType | ContentItemType) => void;
//   onSaveInlineEdit: () => void;
//   onCancelInlineEdit: () => void;
// }

// export default function BabItem({
//   bab,
//   onRemoveBab,
//   onRemoveContent,
//   onOpenContentModal,
//   editingItemId,
//   ...inlineEditProps
// }: BabItemProps) {
//   const { attributes, listeners, setNodeRef, transform, transition } =
//     useSortable({ id: bab.id });
//   const style = { transform: CSS.Transform.toString(transform), transition };

//   const isEditingThisBab = editingItemId === bab.id;

//   return (
//     <Paper ref={setNodeRef} style={style} withBorder p="md" radius="md">
//       <Stack>
//         <Group justify="space-between">
//           <Group>
//             <ActionIcon
//               variant="transparent"
//               {...attributes}
//               {...listeners}
//               style={{ cursor: "grab" }}
//             >
//               <IconGripVertical size={18} />
//             </ActionIcon>
//             {isEditingThisBab ? <Stack>...</Stack> : <div>...</div>}
//             <div>
//               <Title order={5}>{bab.name}</Title>
//               {bab.description && (
//                 <Text size="sm" c="dimmed">
//                   {bab.description}
//                 </Text>
//               )}
//               <Badge size="xs" variant="light" mt="xs">
//                 {bab.items.length} konten
//               </Badge>
//             </div>
//           </Group>
//           {isEditingThisBab ? (
//             <Group> {/* ... */} </Group>
//           ) : (
//             <Group gap="xs">
//               <ActionIcon
//                 variant="light"
//                 color="blue"
//                 onClick={() => inlineEditProps.onStartInlineEdit(bab)}
//               >
//                 <IconEdit size={16} />
//               </ActionIcon>
//               <ActionIcon color="red" onClick={() => onRemoveBab(bab.id)}>
//                 <IconTrash size={16} />
//               </ActionIcon>
//             </Group>
//           )}
//         </Group>

//         {/* Bungkus ContentList dengan SortableContext agar item di dalamnya bisa di-drag */}
//         <SortableContext
//           items={bab.items.map((i) => i.id)}
//           strategy={verticalListSortingStrategy}
//         >
//           <ContentList
//             items={bab.items}
//             onRemove={(contentId) => onRemoveContent(bab.id, contentId)}
//             onEdit={(contentItem) => onOpenContentModal(bab.id, contentItem)}
//           />
//         </SortableContext>

//         <Button
//           size="xs"
//           variant="light"
//           leftSection={<IconPlus size={14} />}
//           onClick={() => onOpenContentModal(bab.id)}
//         >
//           Tambah Konten ke Bab ini
//         </Button>
//       </Stack>
//     </Paper>
//   );
// }
