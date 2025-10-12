// src\app\frontend\dashboard\lecturer\components\materi\MaterialForm.tsx
"use client";

import React, { useState } from "react";
import { Card, Stack, TextInput, Textarea, Button } from "@mantine/core";

interface MaterialFormProps {
  onAddBab: (name: string, description: string) => void;
}

export default function MaterialForm({ onAddBab }: MaterialFormProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const handleAdd = () => {
    if (!name.trim()) return;
    onAddBab(name, description);
    setName("");
    setDescription("");
  };

  return (
    <Card withBorder radius="md" p="lg">
      <Stack>
        <TextInput
          label="Judul Bab"
          placeholder="Contoh: Bab 1 - Pengenalan React"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          required
        />
        <Textarea
          label="Deskripsi Bab"
          placeholder="Jelaskan singkat isi bab ini..."
          value={description}
          onChange={(e) => setDescription(e.currentTarget.value)}
          minRows={2}
        />
        <Button onClick={handleAdd}>Tambah Bab</Button>
      </Stack>
    </Card>
  );
}
