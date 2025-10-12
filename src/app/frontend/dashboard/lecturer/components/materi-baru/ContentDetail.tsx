// src/app/frontend/dashboard/lecturer/components/materi-baru/ContentDetail.tsx
"use client";
import { Stack, Title, Group, Button, Text, Paper } from '@mantine/core';
import { BabType } from '../../types/material';

interface Props {
    bab: BabType;
    setBabs: (updater: (babs: BabType[]) => BabType[]) => void;
    openMateriModal: () => void;
    openKuisModal: () => void;
    openTugasModal: () => void;
}

export function ContentDetail({ bab, setBabs, openMateriModal, openKuisModal, openTugasModal }: Props) {
    return (
        <Stack>
            <Stack gap="xs" mb="md">
                <Title order={3}>{bab.name}</Title>
                <Text c="dimmed">{bab.description || "No description for this chapter."}</Text>
            </Stack>

            <Group>
                <Button onClick={openMateriModal} variant="light">Add Lesson</Button>
                <Button onClick={openKuisModal} variant="light">Add Quiz</Button>
                <Button onClick={openTugasModal} variant="light">Add Assignment</Button>
            </Group>

            <Stack mt="lg">
                <Title order={5}>Content</Title>
                {bab.items.map(item => (
                    <Paper withBorder p="sm" key={item.id} radius="md">
                        <Text>{item.name || item.title}</Text>
                        {/* Di sini bisa ditambahkan ikon berdasarkan item.type */}
                    </Paper>
                ))}
                {bab.items.length === 0 && <Text c="dimmed">This chapter is empty. Add some content!</Text>}
            </Stack>
        </Stack>
    );
}