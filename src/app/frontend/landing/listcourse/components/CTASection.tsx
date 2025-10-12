// src\app\frontend\landing\listcourse\components\CTASection.tsx

import React from 'react';
import { Card, Stack, Title, Text, Group, Button } from '@mantine/core';
import { IconChevronRight } from '@tabler/icons-react';
import Link from 'next/link';

const CTASection: React.FC = () => {
  return (
    <Card
      shadow="lg"
      padding="xl"
      radius="xl"
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        marginTop: "2rem",
      }}
    >
      <Stack gap="lg" ta="center">
        <Title order={2} fw={700}>
          Tidak Menemukan Kursus yang Anda Cari?
        </Title>
        <Text size="lg" style={{ opacity: 0.9 }}>
          Jelajahi semua kategori atau hubungi kami untuk rekomendasi personal
        </Text>
        <Group justify="center">
          <Button 
            size="lg" 
            color="white" 
            variant="white" 
            c="blue"
            component={Link}
            href="/frontend/landing/listcategory"
            rightSection={<IconChevronRight size={18} />}
            radius="md"
          >
            Lihat Semua Kategori
          </Button>
        </Group>
      </Stack>
    </Card>
  );
};

export default CTASection;