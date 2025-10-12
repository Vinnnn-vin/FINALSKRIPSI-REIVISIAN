// src\app\layout.tsx
import "@mantine/core/styles.css";
import { MantineProvider, ColorSchemeScript } from "@mantine/core";
import NextAuthProvider from "./providers";
import { LayoutWrapper } from "./frontend/components/layout/LayoutWrapper";

export const metadata = {
  title: "My LMS App",
  description: "I am using Mantine with Next.js!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-mantine-color-scheme="light" suppressHydrationWarning>
      <head>
        <ColorSchemeScript defaultColorScheme="auto" />
      </head>
      <body>
        <NextAuthProvider>
          <MantineProvider defaultColorScheme="auto">
            <LayoutWrapper>{children}</LayoutWrapper>
          </MantineProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
