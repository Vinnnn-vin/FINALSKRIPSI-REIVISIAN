"use client";
import { AppShell } from "@mantine/core";
import { usePathname } from "next/navigation";
import { Header } from "../header";
import { Footer } from "../footer";

interface LayoutWrapperProps {
  children: React.ReactNode;
}

export function LayoutWrapper({ children }: LayoutWrapperProps) {
  const pathname = usePathname();

  const excludedPaths = [
    "/frontend/auth/login",
    "/frontend/auth/register",
    "/frontend/dashboard",
    "/admin",
    "/lecturer",
    "/student",
  ];

  const shouldExcludeLayout = excludedPaths.some((path) => {
    return pathname === path || pathname.startsWith(path + "/");
  });

  if (shouldExcludeLayout) {
    return <>{children}</>;
  }

  return (
    <AppShell header={{ height: 80 }} >
      <Header />
      <AppShell.Main>{children}</AppShell.Main>
      <Footer />
    </AppShell>
  );
}