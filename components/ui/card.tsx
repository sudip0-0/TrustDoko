import {
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from "react";

import { cn } from "@/lib/utils";

const cardTitleClassName = "text-foreground text-lg font-semibold";

function isHeadingElement(
  child: ReactNode,
): child is ReactElement<HTMLAttributes<HTMLHeadingElement>> {
  return (
    isValidElement(child) &&
    typeof child.type === "string" &&
    /^h[1-6]$/i.test(child.type)
  );
}

type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  doubleBezel?: boolean;
};

export function Card({
  className,
  children,
  doubleBezel = false,
  ...props
}: CardProps) {
  if (doubleBezel) {
    return (
      <div
        className={cn(
          "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-diffusion-lg",
          "bg-black/[0.03] rounded-[calc(1.25rem+1.5px)] border border-black/5",
          className,
        )}
        {...props}
      >
        <div className="rounded-[calc(1.25rem-0.375rem)] bg-card shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card text-card-foreground shadow-sm",
        "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:shadow-diffusion-lg",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "border-b border-border px-6 py-5",
        "transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)]",
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  if (isHeadingElement(children)) {
    return cloneElement(children, {
      ...props,
      className: cn(cardTitleClassName, children.props.className, className),
    });
  }

  return (
    <h2 className={cn(cardTitleClassName, className)} {...props}>
      {children}
    </h2>
  );
}

export function CardDescription({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn(
        "text-muted mt-1 text-sm leading-relaxed",
        className,
      )}
      {...props}
    >
      {children}
    </p>
  );
}

export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("px-6 py-5", className)} {...props}>
      {children}
    </div>
  );
}
