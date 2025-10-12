'use client';

import {
  AppShellHeader,
  Group,
  Text,
  Anchor,
  Button,
  Menu,
  Avatar,
  UnstyledButton,
  rem,
  Loader,
  Burger,
  Drawer,
  Stack,
  Divider,
  Box,
  ScrollArea,
  useMantineTheme
} from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { 
  IconChevronDown, 
  IconUser, 
  IconLogout,
  IconHome,
  IconBook,
  IconCategory,
  IconInfoCircle,
  IconDashboard
} from '@tabler/icons-react';

export function Header() {
  const { data: session, status } = useSession();
  const isAuthenticated = status === 'authenticated';
  const [opened, { open, close }] = useDisclosure(false);
  const theme = useMantineTheme();
  
  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');

  // Fixed navigation paths (absolute paths)
  const navLinks = [
    { 
      label: 'Home', 
      href: '/frontend/landing',
      icon: IconHome
    },
    { 
      label: 'Courses', 
      href: '/frontend/landing/listcourse',
      icon: IconBook
    },
    { 
      label: 'Categories', 
      href: '/frontend/landing/listcategory',
      icon: IconCategory
    },
    { 
      label: 'About', 
      href: '/frontend/landing/aboutus',
      icon: IconInfoCircle
    },
  ];

  if (isAuthenticated) {
    navLinks.push({ 
      label: 'Dashboard', 
      href: '/frontend/dashboard',
      icon: IconDashboard
    });
  }

  // Desktop Navigation Links
  const DesktopNavLinks = () => (
    <Group gap={isMobile ? "xs" : "md"} visibleFrom="md">
      {navLinks.map((link) => {
        const IconComponent = link.icon;
        return (
          <Anchor
            key={link.label}
            component={Link}
            href={link.href}
            c="dimmed"
            size="sm"
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: rem(6),
              textDecoration: 'none',
              padding: `${rem(8)} ${rem(12)}`,
              borderRadius: theme.radius.sm,
              transition: 'all 0.2s ease',
            }}
            __vars={{
              '--hover-bg': theme.colors.gray[0],
              '--hover-color': theme.colors.blue[6],
            }}
            styles={{
              root: {
                '&:hover': {
                  backgroundColor: 'var(--hover-bg)',
                  color: 'var(--hover-color)',
                }
              }
            }}
          >
            <IconComponent size={16} />
            {!isTablet && link.label}
          </Anchor>
        );
      })}
    </Group>
  );

  // Mobile Navigation Drawer
  const MobileNavDrawer = () => (
    <Drawer
      opened={opened}
      onClose={close}
      title={
        <Text size="lg" fw={700}>
          LMS Platform
        </Text>
      }
      padding="md"
      size="xs"
      position="left"
    >
      <ScrollArea>
        <Stack gap="sm">
          {navLinks.map((link) => {
            const IconComponent = link.icon;
            return (
              <UnstyledButton
                key={link.label}
                component={Link}
                href={link.href}
                onClick={close}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: rem(12),
                  padding: `${rem(12)} ${rem(16)}`,
                  borderRadius: theme.radius.md,
                  width: '100%',
                  transition: 'all 0.2s ease',
                }}
                __vars={{
                  '--hover-bg': theme.colors.gray[0],
                }}
                styles={{
                  root: {
                    '&:hover': {
                      backgroundColor: 'var(--hover-bg)',
                    }
                  }
                }}
              >
                <IconComponent size={20} />
                <Text size="sm" fw={500}>
                  {link.label}
                </Text>
              </UnstyledButton>
            );
          })}
          
          <Divider my="md" />
          
          {/* Mobile Auth Section */}
          {status === 'loading' && (
            <Group>
              <Loader size="sm" />
              <Text size="sm">Loading...</Text>
            </Group>
          )}

          {status === 'unauthenticated' && (
            <Stack gap="sm">
              <Button
                component={Link}
                href="/frontend/auth/login"
                variant="light"
                fullWidth
                onClick={close}
              >
                Login
              </Button>
              <Button
                component={Link}
                href="/frontend/auth/register"
                fullWidth
                onClick={close}
              >
                Register
              </Button>
            </Stack>
          )}

          {status === 'authenticated' && (
            <Stack gap="sm">
              <Group>
                <Avatar color="blue" radius="xl" size="md">
                  {session?.user?.name?.charAt(0).toUpperCase()}
                </Avatar>
                <Box style={{ flex: 1 }}>
                  <Text size="sm" fw={500}>
                    {session?.user?.name}
                  </Text>
                  <Text c="dimmed" size="xs">
                    {session?.user?.email}
                  </Text>
                </Box>
              </Group>
              
              <UnstyledButton
                component={Link}
                href="/frontend/profile/"
                onClick={close}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: rem(12),
                  padding: `${rem(12)} ${rem(16)}`,
                  borderRadius: theme.radius.md,
                  width: '100%',
                  transition: 'all 0.2s ease',
                }}
                __vars={{
                  '--hover-bg': theme.colors.gray[0],
                }}
                styles={{
                  root: {
                    '&:hover': {
                      backgroundColor: 'var(--hover-bg)',
                    }
                  }
                }}
              >
                <IconUser size={20} />
                <Text size="sm">Profile</Text>
              </UnstyledButton>
              
              <UnstyledButton
                onClick={() => {
                  close();
                  signOut({ callbackUrl: '/frontend/landing' });
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: rem(12),
                  padding: `${rem(12)} ${rem(16)}`,
                  borderRadius: theme.radius.md,
                  width: '100%',
                  transition: 'all 0.2s ease',
                  color: theme.colors.red[6],
                }}
                __vars={{
                  '--hover-bg': theme.colors.red[0],
                }}
                styles={{
                  root: {
                    '&:hover': {
                      backgroundColor: 'var(--hover-bg)',
                    }
                  }
                }}
              >
                <IconLogout size={20} />
                <Text size="sm">Logout</Text>
              </UnstyledButton>
            </Stack>
          )}
        </Stack>
      </ScrollArea>
    </Drawer>
  );

  // Desktop User Menu
  const DesktopUserMenu = () => (
    <Menu shadow="md" width={220} position="bottom-end">
      <Menu.Target>
        <UnstyledButton
          style={{
            padding: rem(8),
            borderRadius: theme.radius.sm,
            transition: 'all 0.2s ease',
          }}
          __vars={{
            '--hover-bg': theme.colors.gray[0],
          }}
          styles={{
            root: {
              '&:hover': {
                backgroundColor: 'var(--hover-bg)',
              }
            }
          }}
        >
          <Group gap="sm">
            <Avatar color="blue" radius="xl" size="sm">
              {session?.user?.name?.charAt(0).toUpperCase()}
            </Avatar>
            {!isMobile && (
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Text size="sm" fw={500} truncate>
                  {session?.user?.name}
                </Text>
                <Text c="dimmed" size="xs" truncate>
                  {session?.user?.email}
                </Text>
              </Box>
            )}
            <IconChevronDown 
              size={14} 
              style={{ display: isMobile ? 'none' : 'block' }} 
            />
          </Group>
        </UnstyledButton>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>Account</Menu.Label>
        <Menu.Item
          leftSection={<IconUser size={16} />}
          component={Link}
          href="/frontend/profile/"
        >
          Profile
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item
          color="red"
          leftSection={<IconLogout size={16} />}
          onClick={() => signOut({ callbackUrl: '/frontend/landing' })}
        >
          Logout
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );

  return (
    <>
      <AppShellHeader 
        h={{ base: 60, sm: 70, md: 80 }} 
        p={{ base: 'xs', sm: 'sm', md: 'md' }}
        style={{
          borderBottom: `1px solid ${theme.colors.gray[2]}`,
          backgroundColor: theme.white,
          backdropFilter: 'blur(8px)',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Group justify="space-between" h="100%">
          {/* Mobile Menu Button & Logo */}
          <Group gap="sm">
            <Burger
              opened={opened}
              onClick={open}
              hiddenFrom="md"
              size="sm"
              aria-label="Toggle navigation"
            />
            
            <Text 
              size={isMobile ? 'md' : 'lg'}
              fw={700} 
              component={Link} 
              href="/frontend/landing"
              style={{ 
                textDecoration: 'none', 
                color: 'inherit',
                background: `linear-gradient(45deg, ${theme.colors.blue[6]}, ${theme.colors.cyan[5]})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.02em'
              }}
            >
              LMS Platform
            </Text>
          </Group>

          {/* Desktop Navigation */}
          <DesktopNavLinks />

          {/* Auth Section */}
          <Group gap="xs">
            {status === 'loading' && <Loader size="sm" />}

            {status === 'unauthenticated' && (
              <Group gap="xs" visibleFrom="md">
                <Button
                  component={Link}
                  href="/frontend/auth/login"
                  variant="subtle"
                  size="sm"
                  radius="md"
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  href="/frontend/auth/register"
                  size="sm"
                  radius="md"
                  gradient={{ from: 'blue', to: 'cyan' }}
                  variant="gradient"
                >
                  Register
                </Button>
              </Group>
            )}

            {status === 'authenticated' && (
              <Box visibleFrom="md">
                <DesktopUserMenu />
              </Box>
            )}
          </Group>
        </Group>
      </AppShellHeader>

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer />
    </>
  );
}