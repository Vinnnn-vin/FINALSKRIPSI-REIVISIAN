// src\app\frontend\dashboard\lecturer\components\materials\MaterialDetailRow.tsx
import { Card, Group, Text, Badge } from "@mantine/core";
import { MaterialDetailType } from "../../types/material";
import {
  IconVideo,
  IconFileText,
  IconLink,
  IconClipboardList,
} from "@tabler/icons-react";

interface MaterialDetailRowProps {
  detail: MaterialDetailType;
}

function getContentTypeIcon(type: number) {
  switch (type) {
    case 1:
      return <IconVideo size={16} color="blue" />;
    case 2:
      return <IconFileText size={16} color="teal" />;
    case 3:
      return <IconLink size={16} color="orange" />;
    case 4:
      return <IconClipboardList size={16} color="red" />;
    default:
      return <IconFileText size={16} />;
  }
}

function getContentTypeLabel(type: number) {
  switch (type) {
    case 1:
      return "Video";
    case 2:
      return "PDF";
    case 3:
      return "URL";
    case 4:
      return "Assignment";
    default:
      return "Unknown";
  }
}

export default function MaterialDetailRow({ detail }: MaterialDetailRowProps) {
  return (
    <Card withBorder>
      <Group justify="space-between">
        <Group>
          {getContentTypeIcon(detail.material_detail_type)}
          <div>
            <Text fw={500}>{detail.material_detail_name}</Text>
            <Text size="sm" c="dimmed">
              {detail.material_detail_description}
            </Text>
          </div>
        </Group>
        <Badge>{getContentTypeLabel(detail.material_detail_type)}</Badge>
      </Group>
    </Card>
  );
}
