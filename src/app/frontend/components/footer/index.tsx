// frontend/components/footer/index.tsx
'use client';

import { 
  AppShell, 
  Container, 
  Grid, 
  Title, 
  Text, 
  Stack, 
  Anchor, 
  Group, 
  ActionIcon,
  Box,
  Divider,
  rem
} from '@mantine/core';
import { IconBrandTiktok, IconBrandInstagram } from '@tabler/icons-react';
import Link from 'next/link';

// Data untuk link agar mudah dikelola
const linkColumns = [
  {
    title: 'Resources',
    links: [
      { label: 'Blog', href: '/blog' },
      { label: 'Career', href: '/career' },
      { label: 'Berita', href: '/news' },
      { label: 'Tentang Kami', href: '/about' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', href: '/help' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
    ],
  },
];

export function Footer() {
  return (
    <AppShell.Footer p={0} style={{ position: 'static', background: '#f8f9fa' }}>
      <Box component="footer" py="xl" px="md">
        <Container size="lg">
          <Grid>
            {/* Kolom 1: Info Institusi */}
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Stack gap="xs">
                <Title order={4}>ISTTS</Title>
                <Text size="sm" c="dimmed">
                  Jl. Ngagel Jaya Tengah No.73-77,
                  <br />
                  Baratajaya, Kec. Gubeng, Surabaya,
                  <br />
                  Jawa Timur 60284
                </Text>
              </Stack>
            </Grid.Col>

            {/* Kolom 2 & 3: Links */}
            {linkColumns.map((column) => (
              <Grid.Col key={column.title} span={{ base: 6, md: 2 }}>
                <Stack gap="xs">
                  <Text fw={500}>{column.title}</Text>
                  {column.links.map((link) => (
                    <Anchor
                      key={link.label}
                      component={Link}
                      href={link.href}
                      size="sm"
                      c="dimmed"
                      style={{ textDecoration: 'none' }}
                    >
                      {link.label}
                    </Anchor>
                  ))}
                </Stack>
              </Grid.Col>
            ))}

            {/* Kolom 4: Social Media */}
            <Grid.Col span={{ base: 12, md: 3 }}>
               <Stack gap="xs" align="flex-start">
                  <Text fw={500}>Follow Us</Text>
                  <Group gap="xs">
                    <ActionIcon size="lg" variant="default" radius="xl">
                      <IconBrandTiktok style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                    </ActionIcon>
                    <ActionIcon size="lg" variant="default" radius="xl">
                      <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                    </ActionIcon>
                  </Group>
               </Stack>
            </Grid.Col>
          </Grid>
        </Container>
      </Box>

      {/* Bagian Copyright */}
      <Box bg="white" py="sm" px="md">
        <Container size="lg">
          <Text c="dimmed" size="sm" ta="center">
            Copyright © {new Date().getFullYear()} President & Fellows of ISTTS
          </Text>
        </Container>
      </Box>
    </AppShell.Footer>
  );
}
