// src/app/frontend/landing/aboutus/page.tsx
"use client";

import React from "react";
import {
  Container,
  Title,
  Text,
  Grid,
  Card,
  Stack,
  Box,
  Image,
  Group,
  Badge,
  Avatar,
  Divider,
  Timeline,
  List,
  ThemeIcon,
  GridCol,
  ListItem,
  TimelineItem,
  SimpleGrid,
} from "@mantine/core";
import {
  IconTarget,
  IconHeart,
  IconUsers,
  IconTrophy,
  IconCheck,
  IconStar,
  IconBuildingCommunity,
  IconBulb,
  IconCircleCheck,
} from "@tabler/icons-react";
import { useInView } from "react-intersection-observer";
import { AnimatedCounter } from "../components/AnimatedCounter";

const AboutUsPage = () => {
  // Data (tidak perlu diubah)
  const teamMembers = [
    { name: "Dr. Ahmad Santoso", role: "Chief Executive Officer", bio: "15+ tahun di bidang edukasi dan teknologi.", image: "/team/ceo.jpg" },
    { name: "Sarah Wijaya", role: "Chief Technology Officer", bio: "Expert dalam platform pembelajaran digital.", image: "/team/cto.jpg" },
    { name: "Budi Prasetyo", role: "Head of Content", bio: "Kurator konten dengan standar internasional.", image: "/team/content-head.jpg" },
    { name: "Lisa Indah", role: "Head of Marketing", bio: "Spesialis digital marketing & community building.", image: "/team/marketing-head.jpg" },
  ];
  const milestones = [
    { year: "2020", title: "Pendirian iClick", description: "Didirikan dengan visi mendemokratisasi pendidikan berkualitas." },
    { year: "2021", title: "1,000 Siswa Pertama", description: "Mencapai 1,000 siswa aktif dengan 50+ kursus." },
    { year: "2022", title: "Ekspansi Kategori", description: "Menambahkan kategori Data Science, Marketing, dan Design." },
    { year: "2023", title: "10,000 Lulusan", description: "Berhasil meluluskan 10,000+ siswa dengan tingkat kepuasan 95%." },
    { year: "2024", title: "Partnership Program", description: "Bermitra dengan 50+ perusahaan untuk corporate training." },
  ];
  const values = [
    { icon: IconTrophy, title: "Excellence", description: "Berkomitmen pada pendidikan berkualitas tinggi dengan standar internasional.", color: "blue" },
    { icon: IconHeart, title: "Passion", description: "Mencintai proses pembelajaran dan berdedikasi untuk kesuksesan siswa.", color: "red" },
    { icon: IconBuildingCommunity, title: "Community", description: "Membangun komunitas pembelajar yang saling mendukung dan menginspirasi.", color: "green" },
    { icon: IconBulb, title: "Innovation", description: "Terus berinovasi dalam metode pembelajaran dan teknologi pendidikan.", color: "orange" },
  ];
  const achievements = [
    { target: 50000, suffix: "+", label: "Total Siswa" },
    { target: 500, suffix: "+", label: "Kursus Tersedia" },
    { target: 200, suffix: "+", label: "Instruktur Expert" },
    { target: 95, suffix: "%", label: "Tingkat Kepuasan" },
  ];

  // Hook untuk animasi scroll
  const { ref: sectionRef, inView: sectionInView } = useInView({ triggerOnce: true, threshold: 0.1 });
  const { ref: statsRef, inView: statsInView } = useInView({ triggerOnce: true, threshold: 0.5 });
  const { ref: teamRef, inView: teamInView } = useInView({ triggerOnce: true, threshold: 0.2 });

  return (
    <Box>
      {/* Hero Section */}
      <Box
        style={{
          backgroundImage: `linear-gradient(rgba(44, 62, 80, 0.7), rgba(52, 152, 219, 0.6)), url('/SIGNIN.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          minHeight: '50vh',
          display: 'flex',
          alignItems: 'center',
          color: 'white',
        }}
      >
        <Container size="lg" py="xl">
          <Stack gap="lg" ta="center" align="center">
            <Title size="4rem" fw={800} style={{ textShadow: '0 2px 10px rgba(0,0,0,0.3)' }}>
              Tentang Kami
            </Title>
            <Text size="xl" opacity={0.9} maw={700}>
              Misi kami adalah memberdayakan individu untuk mencapai potensi penuh mereka melalui pendidikan yang mudah diakses dan berkualitas tinggi.
            </Text>
          </Stack>
        </Container>
      </Box>

      {/* Achievements Section with Animated Counter */}
      <Box ref={statsRef} bg="gray.0" py="xl">
        <Container size="lg">
          <SimpleGrid cols={{ base: 2, sm: 4 }}>
            {achievements.map((achievement, index) => (
              <Stack key={index} align="center" gap="xs">
                <Title order={1} c="blue" fw={800}>
                  {statsInView && (
                    <AnimatedCounter to={achievement.target} suffix={achievement.suffix} c="blue" fz="2.5rem" />
                  )}
                </Title>
                <Text ta="center" size="sm" fw={500} c="dimmed">
                  {achievement.label}
                </Text>
              </Stack>
            ))}
          </SimpleGrid>
        </Container>
      </Box>

      {/* Mission & Vision */}
      <Container size="lg" py={80} ref={sectionRef}>
        <Grid gutter={50} align="center">
          <GridCol span={{ base: 12, md: 6 }}>
            <Stack gap="xl">
              <Group>
                <ThemeIcon size={50} radius="xl" color="blue" variant="light">
                  <IconTarget size={28} />
                </ThemeIcon>
                <Title order={2}>Visi & Misi Kami</Title>
              </Group>
              <Text c="dimmed" size="lg" lh={1.7}>
                Menjadi platform pembelajaran online terdepan di Indonesia yang memberikan akses pendidikan berkualitas untuk semua kalangan, memungkinkan setiap individu mengembangkan potensi dan mencapai impian karir mereka.
              </Text>
              <List
                spacing="sm"
                size="md"
                icon={<ThemeIcon color="green" size={24} radius="xl"><IconCheck size={16} /></ThemeIcon>}
              >
                <ListItem>Menyediakan kursus dengan instruktur berpengalaman.</ListItem>
                <ListItem>Menciptakan pengalaman belajar yang interaktif.</ListItem>
                <ListItem>Membangun komunitas pembelajar yang suportif.</ListItem>
                <ListItem>Memberikan sertifikasi yang diakui industri.</ListItem>
              </List>
            </Stack>
          </GridCol>
          <GridCol span={{ base: 12, md: 6 }}>
            <Image
              src={'/SIGNIN.jpg'} // Ganti dengan gambar yang relevan
              alt="Our mission"
              radius="lg"
              style={{ boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
            />
          </GridCol>
        </Grid>
      </Container>
      
      {/* Values Section */}
      <Box bg="gray.0" py={80}>
        <Container size="lg">
          <Stack gap="xl">
            <Stack gap="xs" ta="center" align="center">
              <Title order={2}>Nilai-Nilai Kami</Title>
              <Text c="dimmed" maw={600}>Prinsip yang memandu setiap langkah perjalanan kami dalam memberikan yang terbaik.</Text>
            </Stack>
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl">
              {values.map((value, index) => (
                <Card key={index} shadow="md" padding="xl" radius="lg" withBorder h="100%">
                  <Stack gap="md" align="center" ta="center">
                    <ThemeIcon size={60} radius="xl" color={value.color} variant="light">
                      <value.icon size={32} />
                    </ThemeIcon>
                    <Title order={4}>{value.title}</Title>
                    <Text size="sm" c="dimmed">{value.description}</Text>
                  </Stack>
                </Card>
              ))}
            </SimpleGrid>
          </Stack>
        </Container>
      </Box>

      {/* Team Section */}
      <Container size="lg" py={80} ref={teamRef}>
        <Stack gap="xl">
          <Stack gap="xs" ta="center" align="center">
            <Title order={2}>Tim Hebat di Balik Layar</Title>
            <Text c="dimmed" maw={600}>Bertemu dengan para profesional berdedikasi yang membuat semua ini mungkin terjadi.</Text>
          </Stack>
          <Grid gutter="xl">
            {teamMembers.map((member, index) => (
              <GridCol key={index} span={{ base: 12, sm: 6, md: 3 }}>
                <Card shadow="sm" padding="lg" radius="lg" withBorder h="100%" style={{ textAlign: 'center' }}>
                  <Stack gap="md" align="center">
                    <Avatar src={member.image} size={120} radius={120} />
                    <Stack gap="xs">
                      <Title order={4}>{member.name}</Title>
                      <Badge color="blue" variant="light" size="lg" radius="md">
                        {member.role}
                      </Badge>
                      <Text size="sm" c="dimmed" mt="xs">{member.bio}</Text>
                    </Stack>
                  </Stack>
                </Card>
              </GridCol>
            ))}
          </Grid>
        </Stack>
      </Container>

    </Box>
  );
};

export default AboutUsPage;