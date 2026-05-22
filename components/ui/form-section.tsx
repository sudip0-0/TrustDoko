import type { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <fieldset className="space-y-4 border-0 p-0">
      <legend className="text-foreground mb-1 block text-base font-semibold">
        {title}
      </legend>
      {description ? (
        <p className="text-muted -mt-1 mb-2 text-sm leading-relaxed">{description}</p>
      ) : null}
      {children}
    </fieldset>
  );
}
