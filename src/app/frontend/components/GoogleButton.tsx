// src\app\frontend\components\GoogleButton.tsx
"use client";

import { Button, ButtonProps } from "@mantine/core";
import NextImage from "next/image";

type GoogleButtonProps = ButtonProps & React.ComponentPropsWithoutRef<"button">;

export const GoogleButton = (props: GoogleButtonProps) => (
  <Button
    leftSection={
      <NextImage src="/google-logo.svg" alt="Google" width={20} height={20} />
    }
    variant="default"
    color="gray"
    fullWidth
    {...props}
  />
);