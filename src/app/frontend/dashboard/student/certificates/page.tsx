// src\app\frontend\dashboard\student\certificates\page.tsx

'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, SimpleGrid, Card, Group, Button, Loader, Center, Alert, Stack } from '@mantine/core';
import { IconAward, IconAlertCircle } from '@tabler/icons-react';

interface Certificate {
    certificate_id: number;
    certificate_url: string;
    certificate_number: string;
    issued_at: string;
    Course: {
        course_title: string;
    };
}

export default function CertificatesPage() {
    const [certificates, setCertificates] = useState<Certificate[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetch('/api/dashboard/student/certificates')
            .then(res => res.json())
            .then(data => {
                if (data.error) throw new Error(data.error);
                setCertificates(data);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <Center h="80vh"><Loader /></Center>;
    if (error) return <Container><Alert color="red" title="Error">{error}</Alert></Container>;

    return (
        <Container my="xl">
            <Title order={2} mb="lg">My Certificates</Title>
            {certificates.length === 0 ? (
                <Card withBorder p="xl">
                    <Text c="dimmed" ta="center">You have not earned any certificates yet. Complete a course to get one!</Text>
                </Card>
            ) : (
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }}>
                    {certificates.map(cert => (
                        <Card key={cert.certificate_id} shadow="sm" p="lg" radius="md" withBorder>
                            <Group justify="space-between" align="flex-start">
                                <Stack gap="xs">
                                    <Text fw={500}>{cert.Course.course_title}</Text>
                                    <Text size="sm" c="dimmed">Issued on: {new Date(cert.issued_at).toLocaleDateString()}</Text>
                                </Stack>
                                <IconAward size={48} color="gold" />
                            </Group>
                            <Button component="a" href={cert.certificate_url} target="_blank" fullWidth mt="md">
                                View Certificate
                            </Button>
                        </Card>
                    ))}
                </SimpleGrid>
            )}
        </Container>
    );
}