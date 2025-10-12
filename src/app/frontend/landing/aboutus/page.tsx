// src\app\frontend\landing\aboutus\page.tsx
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
} from "@mantine/core";
import {
  IconTarget,
  IconHeart,
  IconUsers,
  IconTrophy,
  IconCheck,
  IconStar,
} from "@tabler/icons-react";

const AboutUsPage = () => {
  const teamMembers = [
    {
      name: "Dr. Ahmad Santoso",
      role: "Chief Executive Officer",
      bio: "Berpengalaman 15+ tahun di bidang edukasi dan teknologi",
      image: "/api/placeholder/150/150",
      expertise: ["Leadership", "Education Strategy", "Business Development"],
    },
    {
      name: "Sarah Wijaya",
      role: "Chief Technology Officer",
      bio: "Expert dalam pengembangan platform pembelajaran digital",
      image: "/api/placeholder/150/150",
      expertise: ["Full Stack Development", "System Architecture", "AI/ML"],
    },
    {
      name: "Budi Prasetyo",
      role: "Head of Content",
      bio: "Kuratorial konten pembelajaran dengan standar internasional",
      image: "/api/placeholder/150/150",
      expertise: ["Content Strategy", "Curriculum Design", "Quality Assurance"],
    },
    {
      name: "Lisa Indah",
      role: "Head of Marketing",
      bio: "Spesialis dalam digital marketing dan community building",
      image: "/api/placeholder/150/150",
      expertise: [
        "Digital Marketing",
        "Brand Strategy",
        "Community Management",
      ],
    },
  ];

  const milestones = [
    {
      year: "2020",
      title: "Pendirian iClick",
      description:
        "Didirikan dengan visi democratizing quality education untuk semua kalangan",
    },
    {
      year: "2021",
      title: "1,000 Siswa Pertama",
      description:
        "Mencapai milestone 1,000 siswa aktif dengan 50+ kursus berkualitas",
    },
    {
      year: "2022",
      title: "Ekspansi Kategori",
      description:
        "Menambahkan kategori baru: Data Science, Digital Marketing, dan Design",
    },
    {
      year: "2023",
      title: "10,000 Graduates",
      description:
        "Berhasil meluluskan 10,000+ siswa dengan tingkat kepuasan 95%+",
    },
    {
      year: "2024",
      title: "Partnership Program",
      description:
        "Bermitra dengan 50+ perusahaan untuk program corporate training",
    },
  ];

  const values = [
    {
      icon: IconTarget,
      title: "Excellence",
      description:
        "Berkomitmen memberikan pendidikan berkualitas tinggi dengan standar internasional",
      color: "blue",
    },
    {
      icon: IconHeart,
      title: "Passion",
      description:
        "Mencintai proses pembelajaran dan berdedikasi untuk kesuksesan setiap siswa",
      color: "red",
    },
    {
      icon: IconUsers,
      title: "Community",
      description:
        "Membangun komunitas pembelajar yang saling mendukung dan menginspirasi",
      color: "green",
    },
    {
      icon: IconTrophy,
      title: "Innovation",
      description:
        "Terus berinovasi dalam metode pembelajaran dan teknologi pendidikan",
      color: "orange",
    },
  ];

  const achievements = [
    { number: "50,000+", label: "Total Siswa" },
    { number: "500+", label: "Kursus Tersedia" },
    { number: "200+", label: "Instruktur Expert" },
    { number: "95%", label: "Tingkat Kepuasan" },
    { number: "85%", label: "Job Placement Rate" },
    { number: "4.8/5", label: "Rating Platform" },
  ];

  return (
      <Box>
        {/* Hero Section */}
        <Box
          style={{
            background: "linear-gradient(135deg, #2c3e50 0%, #3498db 100%)",
            minHeight: "400px",
            display: "flex",
            alignItems: "center",
            color: "white",
          }}
        >
          <Container size="lg">
            <Grid align="center">
              <GridCol span={{ base: 12, md: 6 }}>
                <Stack gap="xl">
                  <Title size="h1" fw={700}>
                    About iClick
                  </Title>
                  <Text size="xl" opacity={0.9}>
                    &quot;To learn about our vision, thoughtfully put together,
                    present it to you with enough challenges, we don&apos;t want
                    to set someone up for failure by finding opportunities or
                    fitting them into a system that&apos;s going to eat
                    them.&quot;
                  </Text>
                  <Text size="lg" fw={500}>
                    - Shawn Acosta, Vice President
                  </Text>
                </Stack>
              </GridCol>
              <GridCol span={{ base: 12, md: 6 }}>
                <Image
                  src={'/SIGNIN.jpg'}
                  alt="About us illustration"
                  radius="md"
                />
              </GridCol>
            </Grid>
          </Container>
        </Box>

        {/* Mission & Vision */}
        <Container size="lg" py="xl">
          <Grid>
            <GridCol span={{ base: 12, md: 6 }}>
              <Card shadow="sm" padding="xl" radius="md" withBorder h="100%">
                <Stack gap="md">
                  <Group>
                    <ThemeIcon size="xl" color="blue" variant="light">
                      <IconTarget size={24} />
                    </ThemeIcon>
                    <Title order={3}>Visi Kami</Title>
                  </Group>
                  <Text>
                    Menjadi platform pembelajaran online terdepan di Indonesia
                    yang memberikan akses pendidikan berkualitas tinggi untuk
                    semua kalangan, memungkinkan setiap individu mengembangkan
                    potensi dan mencapai impian karir mereka.
                  </Text>
                </Stack>
              </Card>
            </GridCol>
            <GridCol span={{ base: 12, md: 6 }}>
              <Card shadow="sm" padding="xl" radius="md" withBorder h="100%">
                <Stack gap="md">
                  <Group>
                    <ThemeIcon size="xl" color="green" variant="light">
                      <IconHeart size={24} />
                    </ThemeIcon>
                    <Title order={3}>Misi Kami</Title>
                  </Group>
                  <List
                    spacing="xs"
                    icon={
                      <ThemeIcon color="green" size={20} radius="xl">
                        <IconCheck size={12} />
                      </ThemeIcon>
                    }
                  >
                    <ListItem>
                      Menyediakan kursus berkualitas dengan instruktur
                      berpengalaman
                    </ListItem>
                    <ListItem>
                      Menciptakan pengalaman belajar yang interaktif dan engaging
                    </ListItem>
                    <ListItem>
                      Membangun komunitas pembelajar yang supportive
                    </ListItem>
                    <ListItem>
                      Memberikan sertifikasi yang diakui industri
                    </ListItem>
                  </List>
                </Stack>
              </Card>
            </GridCol>
          </Grid>
        </Container>

        <Divider />

        {/* Values Section */}
        <Box bg="gray.0" py="xl">
          <Container size="lg">
            <Stack gap="xl">
              <Stack gap="xs" ta="center">
                <Title order={2}>Nilai-Nilai Kami</Title>
                <Text c="dimmed">
                  Prinsip yang memandu setiap langkah perjalanan kami
                </Text>
              </Stack>

              <Grid>
                {values.map((value, index) => (
                  <GridCol key={index} span={{ base: 12, sm: 6, md: 3 }}>
                    <Card
                      shadow="sm"
                      padding="lg"
                      radius="md"
                      withBorder
                      h="100%"
                    >
                      <Stack gap="md" ta="center">
                        <ThemeIcon size="xl" color={value.color} variant="light">
                          <value.icon size={24} />
                        </ThemeIcon>
                        <Title order={4}>{value.title}</Title>
                        <Text size="sm" ta="center">
                          {value.description}
                        </Text>
                      </Stack>
                    </Card>
                  </GridCol>
                ))}
              </Grid>
            </Stack>
          </Container>
        </Box>

        {/* Achievements Section */}
        <Container size="lg" py="xl">
          <Stack gap="xl">
            <Stack gap="xs" ta="center">
              <Title order={2}>Pencapaian Kami</Title>
              <Text c="dimmed">Angka-angka yang menunjukkan komitmen kami</Text>
            </Stack>

            <Grid>
              {achievements.map((achievement, index) => (
                <GridCol key={index} span={{ base: 6, sm: 4, md: 2 }}>
                  <Stack align="center" gap="xs">
                    <Title order={1} c="blue" fw={700}>
                      {achievement.number}
                    </Title>
                    <Text ta="center" size="sm" fw={500}>
                      {achievement.label}
                    </Text>
                  </Stack>
                </GridCol>
              ))}
            </Grid>
          </Stack>
        </Container>

        <Divider />

        {/* Timeline Section */}
        <Box bg="gray.0" py="xl">
          <Container size="lg">
            <Stack gap="xl">
              <Stack gap="xs" ta="center">
                <Title order={2}>Perjalanan Kami</Title>
                <Text c="dimmed">
                  Milestone penting dalam perkembangan iClick
                </Text>
              </Stack>

              <Box>
                <Timeline
                  active={milestones.length - 1}
                  bulletSize={24}
                  lineWidth={2}
                >
                  {milestones.map((milestone, index) => (
                    <TimelineItem
                      key={index}
                      bullet={<IconStar size={12} />}
                      title={
                        <Group gap="sm">
                          <Badge color="blue" size="sm">
                            {milestone.year}
                          </Badge>
                          <Text fw={500}>{milestone.title}</Text>
                        </Group>
                      }
                    >
                      <Text c="dimmed" size="sm" mt={4}>
                        {milestone.description}
                      </Text>
                    </TimelineItem>
                  ))}
                </Timeline>
              </Box>
            </Stack>
          </Container>
        </Box>

        {/* Team Section */}
        <Container size="lg" py="xl">
          <Stack gap="xl">
            <Stack gap="xs" ta="center">
              <Title order={2}>Tim Kami</Title>
              <Text c="dimmed">
                Orang-orang hebat di balik kesuksesan iClick
              </Text>
            </Stack>

            <Grid>
              {teamMembers.map((member, index) => (
                <GridCol key={index} span={{ base: 12, sm: 6, md: 3 }}>
                  <Card shadow="sm" padding="lg" radius="md" withBorder h="100%">
                    <Stack gap="md" ta="center">
                      <Avatar src={member.image} size="xl" mx="auto" />
                      <Stack gap="xs">
                        <Title order={4}>{member.name}</Title>
                        <Badge color="blue" variant="light">
                          {member.role}
                        </Badge>
                        <Text size="sm" c="dimmed">
                          {member.bio}
                        </Text>
                      </Stack>
                      <Group gap={4} justify="center">
                        {member.expertise.map((skill, skillIndex) => (
                          <Badge key={skillIndex} size="xs" variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </Group>
                    </Stack>
                  </Card>
                </GridCol>
              ))}
            </Grid>
          </Stack>
        </Container>

        {/* Contact CTA Section */}
        <Box
          style={{
            background: "linear-gradient(135deg, #8e44ad 0%, #3498db 100%)",
            color: "white",
          }}
          py="xl"
        >
          <Container size="lg">
            <Stack gap="xl" ta="center">
              <Stack gap="md">
                <Title order={2}>Ingin Tahu Lebih Lanjut?</Title>
                <Text size="lg" opacity={0.9}>
                  Hubungi tim kami untuk informasi lebih detail tentang program
                  dan kursus yang tersedia
                </Text>
              </Stack>
              <Group justify="center">
                <Card shadow="lg" padding="xl" radius="md" maw={400}>
                  <Stack gap="md" ta="left">
                    <Title order={3} c="dark">
                      Hubungi Kami
                    </Title>
                    <Stack gap="xs">
                      <Text size="sm">
                        <strong>Email:</strong> info@iClickonline.com
                      </Text>
                      <Text size="sm">
                        <strong>Phone:</strong> +62 21 1234 5678
                      </Text>
                      <Text size="sm">
                        <strong>WhatsApp:</strong> +62 812 3456 7890
                      </Text>
                      <Text size="sm">
                        <strong>Address:</strong> Jl. Teknologi No. 123, Jakarta
                        Selatan
                      </Text>
                    </Stack>
                  </Stack>
                </Card>
              </Group>
            </Stack>
          </Container>
        </Box>
      </Box>
  );
};

export default AboutUsPage;
