// src\app\frontend\profile\page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from 'react';
import {
  Container, Title, Text, Button, Grid, Card, Group, Stack, Avatar, TextInput, FileButton, Modal, PasswordInput, Alert, Loader, Center,
  Divider
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { IconArrowLeft, IconAlertCircle, IconUpload, IconLock } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';

interface UserProfile {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  role: string;
  // Tambahkan field lain jika ada
}

const ProfilePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk upload foto
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Modal untuk ubah password
  const [opened, { open, close }] = useDisclosure(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');

  // Form untuk data profil
  const form = useForm({
    initialValues: {
      first_name: '',
      last_name: '',
      email: '',
    },
    validate: {
      first_name: (value) => (value.trim().length < 2 ? 'First name must have at least 2 letters' : null),
      last_name: (value) => (value.trim().length < 2 ? 'Last name must have at least 2 letters' : null),
    },
  });

  // Form untuk ubah password
  const passwordForm = useForm({
    initialValues: {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
    validate: {
      newPassword: (value) => (value.length < 6 ? 'Password must be at least 6 characters' : null),
      confirmPassword: (value, values) => (value !== values.newPassword ? 'Passwords do not match' : null),
    },
  });

  // Fetch data profil saat komponen dimuat
  useEffect(() => {
    if (status === 'authenticated') {
      const fetchProfile = async () => {
        try {
          const res = await fetch('/api/profile');
          if (!res.ok) throw new Error('Failed to fetch profile');
          const data: UserProfile = await res.json();
          setUser(data);
          form.setValues({
            first_name: data.first_name,
            last_name: data.last_name,
            email: data.email,
          });
        } catch (e: any) {
          setError(e.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Handle file selection
  useEffect(() => {
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file]);

  // Handle simpan perubahan profil
  const handleSave = async (values: typeof form.values) => {
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      alert('Profile updated successfully!');
    } catch (e: any) {
      alert(`Error: ${e.message}`);
    }
  };

  // Handle ubah password
  const handleChangePassword = async (values: typeof passwordForm.values) => {
    setPasswordError('');
    setPasswordSuccess('');
    try {
        const res = await fetch('/api/profile/change-password', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldPassword: values.oldPassword, newPassword: values.newPassword }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Failed to change password');
        setPasswordSuccess('Password changed successfully!');
        passwordForm.reset();
        setTimeout(close, 2000);
    } catch (e: any) {
        setPasswordError(e.message);
    }
  };

  if (isLoading || status === 'loading') {
    return <Center h="100vh"><Loader /></Center>;
  }

  if (error) {
    return <Center h="100vh"><Text c="red">{error}</Text></Center>;
  }

  return (
    <>
      <Modal opened={opened} onClose={close} title="Ubah Password" centered>
        <form onSubmit={passwordForm.onSubmit(handleChangePassword)}>
          <Stack>
            <PasswordInput
              label="Password Lama"
              placeholder="Masukkan password lama Anda"
              required
              {...passwordForm.getInputProps('oldPassword')}
            />
            <PasswordInput
              label="Password Baru"
              placeholder="Masukkan password baru"
              required
              {...passwordForm.getInputProps('newPassword')}
            />
            <PasswordInput
              label="Konfirmasi Password Baru"
              placeholder="Konfirmasi password baru"
              required
              {...passwordForm.getInputProps('confirmPassword')}
            />
            {passwordError && <Alert color="red" icon={<IconAlertCircle />}>{passwordError}</Alert>}
            {passwordSuccess && <Alert color="green" icon={<IconAlertCircle />}>{passwordSuccess}</Alert>}
            <Group justify="flex-end" mt="md">
              <Button variant="default" onClick={close}>Batal</Button>
              <Button type="submit">Simpan Password</Button>
            </Group>
          </Stack>
        </form>
      </Modal>

      <Container size="lg" py="xl">
        <Stack>
          <Group justify="space-between">
            <Button
              variant="subtle"
              leftSection={<IconArrowLeft size={16} />}
              onClick={() => router.back()}
            >
              Kembali
            </Button>
          </Group>

          <Title order={2}>Profil Saya</Title>
          <Text c="dimmed">Kelola informasi akun dan pengaturan keamanan Anda.</Text>

          <Grid gutter="xl">
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Card withBorder p="xl" radius="md">
                <Stack align="center">
                  <Avatar
                    src={previewUrl}
                    size={120}
                    radius={120}
                    color="blue"
                  >
                    {user?.first_name?.charAt(0)}{user?.last_name?.charAt(0)}
                  </Avatar>
                  <Text size="lg" fw={500}>{user?.first_name} {user?.last_name}</Text>
                  <Text c="dimmed" size="sm">{user?.role}</Text>
                  <FileButton onChange={setFile} accept="image/png,image/jpeg">
                    {(props) => <Button {...props} variant="light" leftSection={<IconUpload size={14} />}>Ubah Foto</Button>}
                  </FileButton>
                  <Text size="xs" c="dimmed" ta="center">JPG atau PNG, maks 2MB. (Fitur upload belum aktif)</Text>
                </Stack>
              </Card>
            </Grid.Col>

            <Grid.Col span={{ base: 12, md: 8 }}>
              <form onSubmit={form.onSubmit(handleSave)}>
                <Card withBorder p="xl" radius="md">
                  <Stack>
                    <Title order={4}>Informasi Pribadi</Title>
                    <Grid>
                      <Grid.Col span={6}>
                        <TextInput label="Nama Depan" placeholder="Nama depan Anda" required {...form.getInputProps('first_name')} />
                      </Grid.Col>
                      <Grid.Col span={6}>
                        <TextInput label="Nama Belakang" placeholder="Nama belakang Anda" required {...form.getInputProps('last_name')} />
                      </Grid.Col>
                    </Grid>
                    <TextInput label="Email" placeholder="Email Anda" disabled {...form.getInputProps('email')} />
                    
                    <Divider my="md" />

                    <Title order={4}>Keamanan</Title>
                    <Button
                      variant="outline"
                      leftSection={<IconLock size={16} />}
                      onClick={open}
                      style={{ alignSelf: 'flex-start' }}
                    >
                      Ubah Password
                    </Button>
                    
                    <Group justify="flex-end" mt="xl">
                      <Button variant="default" onClick={() => form.reset()}>Batal</Button>
                      <Button type="submit">Simpan Perubahan</Button>
                    </Group>
                  </Stack>
                </Card>
              </form>
            </Grid.Col>
          </Grid>
        </Stack>
      </Container>
    </>
  );
};

export default ProfilePage;
