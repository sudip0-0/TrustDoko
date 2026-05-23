import type { ReactNode } from "react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type FormPageShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  backHref?: string;
  backLabel?: string;
  className?: string;
};

export function FormPageShell({
  title,
  description,
  children,
  backHref = "/",
  backLabel = "Back to home",
  className,
}: FormPageShellProps) {
  return (
    <div className={cn("mx-auto w-full max-w-md px-4 py-12 sm:px-6 sm:py-16", className)}>
      <Card>
        <CardContent className="py-8">
          <p className="text-primary mb-2 text-xs font-semibold tracking-wide uppercase">
            Account
          </p>
          <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
          <p className="text-muted mt-2 text-sm leading-relaxed">{description}</p>
          <div className="mt-8">{children}</div>
        </CardContent>
      </Card>
      <p className="text-muted mt-6 text-center text-sm">
        <Link href={backHref} className="no-underline hover:underline">
          {backLabel}
        </Link>
      </p>
    </div>
  );
}
