// src\app\frontend\dashboard\lecturer\components\materials\MaterialAccordion.tsx
import {
  Accordion,
  Card,
  Group,
  Text,
  ActionIcon,
  Stack,
  Badge,
} from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { MaterialType } from "../../types/material";
import MaterialDetailRow from "./MaterialDetailRow";

interface MaterialAccordionProps {
  materials: MaterialType[];
  onEdit: (material: MaterialType) => void;
  onDelete: (id: number) => void;
}

export default function MaterialAccordion({ materials, onEdit, onDelete }: MaterialAccordionProps) {
  return (
    <Accordion multiple>
      {materials.map((material) => (
        <Accordion.Item key={material.material_id} value={String(material.material_id)}>
          <Accordion.Control>
            <Group justify="space-between" align="center">
              <div>
                <Text fw={600}>{material.material_name}</Text>
                <Text size="sm" c="dimmed" lineClamp={1}>
                  {material.material_description}
                </Text>
              </div>
              <Group gap="xs">
                <ActionIcon color="blue" onClick={() => onEdit(material)}>
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon color="red" onClick={() => onDelete(material.material_id)}>
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Group>
          </Accordion.Control>
          <Accordion.Panel>
            <Stack>
              {material.MaterialDetails.map((detail) => (
                <MaterialDetailRow key={detail.material_detail_id} detail={detail} />
              ))}

              {material.Quizzes.length > 0 && (
                <Card withBorder>
                  <Text fw={500}>Quizzes</Text>
                  {material.Quizzes.map((quiz) => (
                    <Badge key={quiz.quiz_id} color="purple" variant="light">
                      {quiz.quiz_title}
                    </Badge>
                  ))}
                </Card>
              )}
            </Stack>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}
