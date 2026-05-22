import { Input } from "@/components/ui/input";

type FormFieldProps = {
  id: string;
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  errors?: string[];
  hint?: string;
};

export function FormField({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  required = true,
  defaultValue,
  placeholder,
  errors,
  hint,
}: FormFieldProps) {
  const hasError = Boolean(errors?.[0]);

  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-foreground block text-sm font-medium">
        {label}
        {required ? (
          <span className="text-destructive ml-0.5" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {hint ? <p className="text-muted text-xs leading-relaxed">{hint}</p> : null}
      <Input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
      />
      {errors?.[0] ? (
        <p id={`${id}-error`} className="text-destructive text-sm" role="alert">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}
