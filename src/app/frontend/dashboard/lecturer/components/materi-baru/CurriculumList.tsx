// src/app/frontend/dashboard/lecturer/components/materi-baru/CurriculumList.tsx
"use client";
import { Stack, Button, NavLink, Text, TextInput, Title } from '@mantine/core';
import { useState } from 'react';
import { BabType } from '../../types/material';
import { IconGripVertical, IconChevronRight, IconPlus } from '@tabler/icons-react';

interface Props {
    babs: BabType[];
    setBabs: (babs: BabType[]) => void;
    selectedBabId: string | null;
    setSelectedBabId: (id: string | null) => void;
}

export function CurriculumList({ babs, setBabs, selectedBabId, setSelectedBabId }: Props) {
    const [newBabName, setNewBabName] = useState('');

    const handleAddBab = () => {
        if (!newBabName.trim()) return;
        const newBab: BabType = {
            id: `bab-${Date.now()}`,
            name: newBabName,
            description: '',
            items: [],
        };
        const newBabs = [...babs, newBab];
        setBabs(newBabs);
        setSelectedBabId(newBab.id);
        setNewBabName('');
    };
    
    return (
        <Stack>
            <Title order={4}>Chapters</Title>
            
            {babs.map(bab => (
                <NavLink
                    key={bab.id}
                    label={bab.name}
                    active={bab.id === selectedBabId}
                    onClick={() => setSelectedBabId(bab.id)}
                    leftSection={<IconGripVertical size={16} />} // Untuk drag handle
                    rightSection={<IconChevronRight size={16} />}
                />
            ))}

            <Stack mt="lg" gap="xs">
                <TextInput
                    placeholder="New chapter title..."
                    value={newBabName}
                    onChange={(e) => setNewBabName(e.currentTarget.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleAddBab()}
                />
                <Button onClick={handleAddBab} leftSection={<IconPlus size={16}/>}>Add Chapter</Button>
            </Stack>
        </Stack>
    );
}