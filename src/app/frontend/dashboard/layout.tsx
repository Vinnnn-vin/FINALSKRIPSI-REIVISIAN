// src\app\frontend\dashboard\layout.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Center, Loader, Stack, Text } from "@mantine/core";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { status } = useSession();
  const router = useRouter();
  const hasRedirected = useRef(false);

  useEffect(() => {
    if (status === "unauthenticated" && !hasRedirected.current) {
      hasRedirected.current = true;
      requestAnimationFrame(() => {
        router.replace('/frontend/auth/login');
      });
    }
  }, [status, router]);

  // Reset redirect flag only on unmount
  useEffect(() => {
    return () => {
      hasRedirected.current = false;
    };
  }, []);

  // Show loader while loading
  if (status === "loading") {
    return (
      <Center h="100vh">
        <Stack align="center">
          <Loader />
          <Text>Memverifikasi sesi Anda...</Text>
        </Stack>
      </Center>
    );
  }

  // Show redirect message for unauthenticated
  if (status === "unauthenticated") {
    return (
      <Center h="100vh">
        <Stack align="center">
          <Loader />
          <Text>Mengarahkan ke halaman login...</Text>
        </Stack>
      </Center>
    );
  }

  // Only render children if authenticated
  if (status === "authenticated") {
    return <>{children}</>;
  }

  // Fallback
  return null;
}