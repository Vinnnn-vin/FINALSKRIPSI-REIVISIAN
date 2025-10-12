// src/app/frontend/dashboard/lecturer/components/materi-baru/ContentModals.tsx
"use client";
import { Modal, Select, TextInput, Button, Stack } from '@mantine/core';
import { useState } from 'react';
import { BabType, ContentItemType } from '../../types/material';

interface ModalProps {
    opened: boolean;
    onClose: () => void;
    babs: BabType[];
    setBabs: (updater: (babs: BabType[]) => BabType[]) => void;
}

export function MateriModal({ opened, onClose, babs, setBabs }: ModalProps) {
    const [selectedBab, setSelectedBab] = useState<string | null>(null);
    const [materiName, setMateriName] = useState('');

    const handleAdd = () => {
        if (!selectedBab || !materiName.trim()) return;
        
        const newContent: ContentItemType = {
            id: `item-${Date.now()}`,
            type: 'lesson',
            name: materiName,
            // ... properti lain untuk materi
        };
        
        setBabs(prevBabs => prevBabs.map(bab => 
            bab.id === selectedBab ? { ...bab, items: [...bab.items, newContent] } : bab
        ));
        
        setMateriName('');
        onClose();
    };

    return (
        <Modal opened={opened} onClose={onClose} title="Add New Lesson">
            <Stack>
                <TextInput label="Lesson Title" value={materiName} onChange={e => setMateriName(e.currentTarget.value)} />
                <Select
                    label="Add to Chapter"
                    data={babs.map(b => ({ value: b.id, label: b.name }))}
                    value={selectedBab}
                    onChange={setSelectedBab}
                    required
                />
                <Button onClick={handleAdd}>Add Lesson</Button>
            </Stack>
        </Modal>
    );
}

// Buat komponen serupa untuk KuisModal dan TugasModal
export function KuisModal({ opened, onClose, babs, setBabs }: ModalProps) { /* ... Form untuk Kuis ... */ }
export function TugasModal({ opened, onClose, babs, setBabs }: ModalProps) { /* ... Form untuk Tugas ... */ }