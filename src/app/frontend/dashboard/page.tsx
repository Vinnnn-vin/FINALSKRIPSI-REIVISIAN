// src\app\frontend\dashboard\page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Center, Loader, Stack, Text } from '@mantine/core';

const DashboardRedirectPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const hasRedirected = useRef(false);

  useEffect(() => {
    // Prevent multiple redirections
    if (hasRedirected.current || isRedirecting) {
      return;
    }

    // Wait for session to be fully loaded
    if (status === 'loading') {
      return;
    }

    // Handle unauthenticated users
    if (status === 'unauthenticated') {
      hasRedirected.current = true;
      setIsRedirecting(true);
      router.replace('/frontend/auth/login');
      return;
    }

    // Handle authenticated users
    if (status === 'authenticated' && session?.user) {
      const userRole = (session.user as any)?.role;
      
      if (!userRole) {
        hasRedirected.current = true;
        setIsRedirecting(true);
        router.replace('/unauthorized');
        return;
      }

      hasRedirected.current = true;
      setIsRedirecting(true);

      setTimeout(() => {
        switch (userRole) {
          case 'admin':
            router.replace('/frontend/dashboard/admin');
            break;
          case 'lecturer':
            router.replace('/frontend/dashboard/lecturer');
            break;
          case 'student':
            router.replace('/frontend/dashboard/student');
            break;
          default:
            router.replace('/unauthorized');
        }
      }, 100);
    }
  }, [session, status, router, isRedirecting]);

  useEffect(() => {
    return () => {
      hasRedirected.current = false;
      setIsRedirecting(false);
    };
  }, [session?.user]);

  return (
    <Center h="100vh">
      <Stack align="center">
        <Loader />
        <Text>Mengarahkan ke dashboard Anda...</Text>
      </Stack>
    </Center>
  );
};

export default DashboardRedirectPage;