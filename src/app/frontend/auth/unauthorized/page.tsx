// src\app\frontend\auth\unauthorized\page.tsx
"use client";

import { Container, Title, Text, Button, Flex, Paper } from "@mantine/core";
import { useRouter } from "next/navigation";
import { IconLock } from "@tabler/icons-react";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <Flex
      h="100vh"
      align="center"
      justify="center"
      style={{
        background: "linear-gradient(135deg, #f87171 0%, #ef4444 100%)",
      }}
    >
      <Container size="sm">
        <Paper withBorder shadow="xl" p="xl" radius="lg" style={{ textAlign: 'center' }}>
          <IconLock size={80} stroke={1.5} color="red" style={{ margin: '0 auto 20px auto' }} />
          
          <Title order={1} c="red.8">
            Akses Ditolak
          </Title>
          
          <Text c="dimmed" size="lg" mt="md" mb="xl">
            Maaf, Anda tidak memiliki izin yang diperlukan untuk mengakses halaman ini.
          </Text>
          
          <Button
            onClick={() => router.push("/frontend/dashboard")}
            variant="gradient"
            gradient={{ from: "red", to: "orange" }}
            size="lg"
            radius="xl"
          >
            Kembali ke Dashboard
          </Button>
        </Paper>
      </Container>
    </Flex>
  );
}