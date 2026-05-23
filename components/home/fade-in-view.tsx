"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";

type FadeInViewProps = {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "none";
};

export function FadeInView({
  children,
  delay = 0,
  className,
  direction = "up",
}: FadeInViewProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: direction === "up" ? 32 : 0,
        filter: "blur(4px)",
      }}
      whileInView={{
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
