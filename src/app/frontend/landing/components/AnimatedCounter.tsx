// src\app\frontend\landing\components\AnimatedCounter.tsx

"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { Text } from "@mantine/core";
import { AnimatedCounterProps } from "@/types/landing";

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  from = 0,
  to,
  duration = 2,
  prefix = "",
  suffix = "",
  ...rest
}) => {
  const count = useMotionValue(from);

  const rounded = useTransform(count, (latest) => {
    return `${prefix}${Math.round(latest).toLocaleString("id-ID")}${suffix}`;
  });

  useEffect(() => {
    const controls = animate(count, to, {
      duration: duration,
      ease: "easeOut",
    });

    return controls.stop;
  }, [from, to, duration, count]);

  return (
    <Text component="span" {...rest}>
      <motion.span>{rounded}</motion.span>
    </Text>
  );
};
