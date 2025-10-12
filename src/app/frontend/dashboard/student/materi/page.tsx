// src\app\frontend\dashboard\student\materi\page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { 
    Container, 
    Title, 
    Text, 
    Paper, 
    Divider, 
    Button, 
    Loader, 
    Alert, 
    AspectRatio,
    Stack,
    Group,
    FileInput,
    TextInput,
    Center
} from '@mantine/core';
import { 
    IconAlertCircle, 
    IconCircleCheck, 
    IconFileDownload, 
    IconPlayerPlay, 
    IconUpload, 
    IconDeviceTv,
    IconFileText,
    IconPencil,
    IconQuestionMark
} from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';


// Tipe untuk detail materi
interface MaterialDetailData {
    material_detail_id: number;
    material_detail_name: string;
    material_detail_description: string;
    material_detail_type: number; // 1: Teks, 2: Video, 3: File, 4: Tugas, 5: Quiz
    materi_detail_url: string;
}

export default function MateriPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const materialDetailId = params.id;
    const courseId = searchParams.get('courseId');

    const [material, setMaterial] = useState<MaterialDetailData | null>(null);
    const [loading, setLoading] = useState(true);
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (materialDetailId && courseId) {
            const fetchMaterial = async () => {
                setLoading(true);
                try {
                    const res = await fetch(`/api/dashboard/student/materi?id=${materialDetailId}&courseId=${courseId}`);
                    if (!res.ok) throw new Error('Gagal memuat materi atau Anda tidak memiliki akses.');
                    const data = await res.json();
                    setMaterial(data);
                } catch (error) {
                    console.error(error);
                    notifications.show({
                        title: 'Error',
                        message: error instanceof Error ? error.message : 'Terjadi kesalahan',
                        color: 'red',
                        icon: <IconAlertCircle />,
                    });
                } finally {
                    setLoading(false);
                }
            };
            fetchMaterial();
        }
    }, [materialDetailId, courseId]);

    const handleMarkAsComplete = async () => {
        try {
            const res = await fetch('/api/dashboard/student/materi/progress', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ materialDetailId, courseId }),
            });
            if (!res.ok) throw new Error('Gagal menandai selesai');
            
            notifications.show({
                title: 'Sukses',
                message: 'Materi telah ditandai selesai!',
                color: 'green',
                icon: <IconCircleCheck />,
            });
        } catch (error) {
             notifications.show({
                title: 'Error',
                message: error instanceof Error ? error.message : 'Terjadi kesalahan',
                color: 'red',
                icon: <IconAlertCircle />,
            });
        }
    };
    
    const renderMaterialContent = () => {
        if (!material) return null;

        const typeMap: { [key: number]: { icon: React.ReactNode; title: string } } = {
            1: { icon: <IconFileText size={20} />, title: "Materi Teks" },
            2: { icon: <IconDeviceTv size={20} />, title: "Video Pembelajaran" },
            3: { icon: <IconFileDownload size={20} />, title: "Materi Unduhan" },
            4: { icon: <IconPencil size={20} />, title: "Tugas" },
            5: { icon: <IconQuestionMark size={20} />, title: "Kuis" },
        }
        
        const { icon, title } = typeMap[material.material_detail_type] || { icon: null, title: "Materi" };

        return (
            <Stack>
                <Group>
                    {icon}
                    <Title order={3}>{title}</Title>
                </Group>
                <Text c="dimmed">{material.material_detail_description}</Text>
                <Divider my="md" />

                {
                    {
                        1: <div dangerouslySetInnerHTML={{ __html: material.material_detail_description }} />,
                        2: (
                            <AspectRatio ratio={16 / 9}>
                                <iframe 
                                    src={material.materi_detail_url} 
                                    title="YouTube video player" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                />
                            </AspectRatio>
                        ),
                        3: (
                            <Button
                                component="a"
                                href={material.materi_detail_url}
                                download
                                target="_blank"
                                rel="noopener noreferrer"
                                leftSection={<IconFileDownload size={16} />}
                            >
                                Unduh Materi
                            </Button>
                        ),
                        4: (
                            <Paper withBorder p="md" radius="md">
                                <form>
                                    <Stack>
                                        <Text fw={500}>Kumpulkan tugas Anda (file PDF atau tautan video):</Text>
                                        <FileInput
                                            label="Unggah File PDF"
                                            placeholder="Pilih file..."
                                            accept=".pdf"
                                            value={file}
                                            onChange={setFile}
                                            leftSection={<IconUpload size={16} />}
                                        />
                                        <Text ta="center" c="dimmed" my="xs">ATAU</Text>
                                        <TextInput
                                            label="Tautan Video (Google Drive, YouTube)"
                                            placeholder="https://..."
                                            type="url"
                                        />
                                        <Button mt="md" type="submit">Kirim Tugas</Button>
                                    </Stack>
                                </form>
                            </Paper>
                        ),
                        5: (
                            <Button 
                                color="violet" 
                                leftSection={<IconPlayerPlay size={16} />}
                            >
                                Mulai Kuis
                            </Button>
                        )
                    }[material.material_detail_type] || <Text>Tipe materi tidak didukung.</Text>
                }
            </Stack>
        )
    };

    if (loading) {
        return <Center style={{ height: '100vh' }}><Loader /></Center>;
    }
    
    if (!material) {
        return (
            <Container mt="xl">
                <Alert icon={<IconAlertCircle size="1rem" />} title="Gagal Memuat" color="red">
                    Materi tidak ditemukan atau Anda tidak memiliki izin untuk mengaksesnya.
                </Alert>
            </Container>
        );
    }

    return (
        <Container my="xl">
            <Paper shadow="sm" p="lg" radius="md" withBorder>
                <Stack>
                    <Title order={2}>{material.material_detail_name}</Title>
                    <Divider />
                    
                    <div>
                        {renderMaterialContent()}
                    </div>
                    
                    <Divider mt="xl" />
                    <Group justify="space-between" mt="md">
                         <Button 
                            onClick={handleMarkAsComplete} 
                            color="green" 
                            leftSection={<IconCircleCheck size={16} />}
                         >
                            Tandai Selesai
                        </Button>
                        {/* Tombol navigasi bisa ditambahkan di sini */}
                    </Group>
                </Stack>
            </Paper>
        </Container>
    );
}
