/* eslint-disable @typescript-eslint/no-explicit-any */
// src/app/frontend/components/auth/ProtectedRoute.tsx
"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Center, Loader, Stack, Text } from "@mantine/core";

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: "admin" | "lecturer" | "student"; // Peran yang diizinkan untuk mengakses halaman
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Jika sesi selesai dimuat dan pengguna tidak terotentikasi,
    // arahkan mereka ke halaman login.
    if (status === "unauthenticated") {
      router.replace("/frontend/auth/login");
    }

    // Jika sesi sudah terotentikasi, periksa perannya.
    if (status === "authenticated") {
      const userRole = (session.user as any)?.role;
      if (role && userRole !== role) {
        router.replace("/unauthorized"); // Buat halaman ini jika perlu
      }
    }
  }, [status, session, router, role]);

  // Selama sesi masih dimuat, tampilkan loading indicator.
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

  if (
    status === "authenticated" &&
    (!role || (session.user as any)?.role === role)
  ) {
    return <>{children}</>;
  }

  return (
    <Center h="100vh">
      <Stack align="center">
        <Loader />
        <Text>Mengarahkan...</Text>
      </Stack>
    </Center>
  );
}
