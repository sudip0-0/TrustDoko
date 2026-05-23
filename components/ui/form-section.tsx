import type { ReactNode } from "react";

type FormSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export function FormSection({ title, description, children }: FormSectionProps) {
  return (
    <fieldset className="rounded-xl border border-border bg-muted/20 p-5 sm:p-6">
      <legend className="text-foreground float-left mb-4 block w-full text-base font-semibold">
        {title}
      </legend>
      {description ? (
        <p className="text-muted mb-4 clear-both text-sm leading-relaxed">{description}</p>
      ) : (
        <div className="clear-both" />
      )}
      <div className="space-y-4">{children}</div>
    </fieldset>
  );
}
