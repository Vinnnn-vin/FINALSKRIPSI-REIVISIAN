// src\app\frontend\landing\components\CtaSection.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Box, Container, Stack, Title, Text, Group, Button } from "@mantine/core";
import { IconChevronRight, IconCertificate, IconClock } from "@tabler/icons-react";
import Link from "next/link";

const CtaSection = () => {
    return (
        <Box
            style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                position: "relative", overflow: "hidden",
            }}
        >
            {/* Background elements */}
            <Box style={{ position: "absolute", top: "10%", left: "5%", width: "200px", height: "200px", background: "rgba(255,255,255,0.05)", borderRadius: "50%", animation: "float 8s ease-in-out infinite" }} />
            <Box style={{ position: "absolute", bottom: "10%", right: "5%", width: "150px", height: "150px", background: "rgba(255,255,255,0.08)", borderRadius: "50%", animation: "float 6s ease-in-out infinite 2s" }} />

            <Container size="xl" py="xl" style={{ position: "relative", zIndex: 1 }}>
                <Stack gap="xl" align="center" ta="center">
                    <Box>
                        <Title
                            order={2} size="h1" fw={800} mb="md"
                            style={{ color: "white", textShadow: "0 4px 20px rgba(0,0,0,0.2)", fontSize: "3rem" }}
                        >
                            Siap Mengubah Hidup Anda?
                        </Title>
                        <Text size="xl" style={{ color: "rgba(255,255,255,0.9)", lineHeight: 1.6, maxWidth: "700px" }}>
                            Bergabunglah dengan ribuan profesional yang telah memulai
                            perjalanan transformasi karir mereka. Mulai hari ini, raih masa
                            depan yang lebih cerah.
                        </Text>
                    </Box>
                    <Group>
                        <Button
                            size="xl" color="orange" radius="xl" component={Link} href="/frontend/landing/listcourse"
                            rightSection={<IconChevronRight size={20} />}
                            style={{
                                background: "linear-gradient(45deg, #ff6b35, #f7931e)", border: "none",
                                boxShadow: "0 12px 30px rgba(255,107,53,0.4)", padding: "16px 32px",
                                fontSize: "18px", fontWeight: 700,
                            }}
                            onMouseEnter={(e) => {
                                (e.target as any).style.transform = "translateY(-3px) scale(1.05)";
                                (e.target as any).style.boxShadow = "0 18px 40px rgba(255,107,53,0.5)";
                            }}
                            onMouseLeave={(e) => {
                                (e.target as any).style.transform = "scale(1)";
                                (e.target as any).style.boxShadow = "0 12px 30px rgba(255,107,53,0.4)";
                            }}
                        >
                            Mulai Belajar Gratis
                        </Button>
                        <Button
                            size="xl" variant="outline" color="white" radius="xl"
                            style={{
                                borderWidth: "2px", backdropFilter: "blur(10px)",
                                background: "rgba(255,255,255,0.1)", padding: "16px 32px",
                                fontSize: "18px", fontWeight: 600,
                            }}
                        >
                            Hubungi Kami
                        </Button>
                    </Group>
                    <Group gap="xl" mt="xl">
                        <Group gap="xs">
                            <IconCertificate size={20} color="rgba(255,255,255,0.8)" />
                            <Text c="rgba(255,255,255,0.8)" fw={500}>Sertifikat Resmi</Text>
                        </Group>
                        <Group gap="xs">
                            <IconClock size={20} color="rgba(255,255,255,0.8)" />
                            <Text c="rgba(255,255,255,0.8)" fw={500}>Akses Seumur Hidup</Text>
                        </Group>
                    </Group>
                </Stack>
            </Container>
        </Box>
    );
};

export default CtaSection;