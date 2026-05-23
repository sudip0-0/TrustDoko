"use client";

import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

const variants = {
  primary:
    "bg-primary text-primary-foreground shadow-[0_1px_2px_rgba(15,118,110,0.15)] hover:shadow-[0_4px_12px_rgba(15,118,110,0.2)]",
  secondary:
    "border border-border bg-card text-foreground hover:bg-accent/60",
  outline:
    "border border-primary/30 bg-transparent text-primary hover:bg-primary/5 hover:border-primary",
  ghost: "text-foreground hover:bg-accent/60",
  destructive:
    "bg-destructive text-destructive-foreground shadow-[0_1px_2px_rgba(185,28,28,0.15)] hover:shadow-[0_4px_12px_rgba(185,28,28,0.2)]",
} as const;

const sizes = {
  sm: "min-h-9 px-3 py-1.5 text-sm",
  md: "min-h-11 px-4 py-2 text-sm",
  lg: "min-h-12 px-5 py-2.5 text-base",
} as const;

type ButtonVariant = keyof typeof variants;
type ButtonSize = keyof typeof sizes;

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  children: ReactNode;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-semibold tracking-tight no-underline",
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "active:scale-[0.98] motion-reduce:active:scale-100",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type ButtonLinkProps = {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  children: ReactNode;
};

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: ButtonLinkProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-lg text-sm font-semibold tracking-tight no-underline",
        "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        "active:scale-[0.98] motion-reduce:active:scale-100",
        "disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
