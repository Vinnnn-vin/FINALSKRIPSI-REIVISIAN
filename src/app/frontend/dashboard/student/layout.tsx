// src\app\frontend\dashboard\student\layout.tsx
"use client";

import { ReactNode } from 'react';
import { MantineProvider } from '@mantine/core';
import { Notifications } from '@mantine/notifications';

export default function StudentDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    
      <MantineProvider>
        <Notifications position="top-right" zIndex={1000} />
        <main style={{ minHeight: '100vh' }}>
          {children}
        </main>
      </MantineProvider>
  );
}