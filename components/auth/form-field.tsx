import type { ReactNode, SelectHTMLAttributes } from "react";

import { Input, Select, Textarea } from "@/components/ui/input";
import { cn } from "@/lib/utils";

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
  className?: string;
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
  className,
}: FormFieldProps) {
  const hasError = Boolean(errors?.[0]);

  return (
    <div className={cn("form-field", className)}>
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
        aria-describedby={hasError ? `${id}-error` : hint ? `${id}-hint` : undefined}
      />
      {errors?.[0] ? (
        <p id={`${id}-error`} className="text-destructive text-sm" role="alert">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}

type FormTextareaFieldProps = {
  id: string;
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
  minLength?: number;
  maxLength?: number;
  errors?: string[];
  hint?: string;
  className?: string;
};

export function FormTextareaField({
  id,
  label,
  name,
  required = true,
  defaultValue,
  placeholder,
  rows = 4,
  minLength,
  maxLength,
  errors,
  hint,
  className,
}: FormTextareaFieldProps) {
  const hasError = Boolean(errors?.[0]);

  return (
    <div className={cn("form-field", className)}>
      <label htmlFor={id} className="text-foreground block text-sm font-medium">
        {label}
        {required ? (
          <span className="text-destructive ml-0.5" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {hint ? <p className="text-muted text-xs leading-relaxed">{hint}</p> : null}
      <Textarea
        id={id}
        name={name}
        required={required}
        rows={rows}
        minLength={minLength}
        maxLength={maxLength}
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

type FormSelectFieldProps = {
  id: string;
  label: string;
  name: string;
  required?: boolean;
  defaultValue?: string;
  errors?: string[];
  hint?: string;
  placeholder?: string;
  className?: string;
  children: ReactNode;
} & Pick<SelectHTMLAttributes<HTMLSelectElement>, "disabled">;

export function FormSelectField({
  id,
  label,
  name,
  required = true,
  defaultValue = "",
  errors,
  hint,
  placeholder,
  className,
  children,
  disabled,
}: FormSelectFieldProps) {
  const hasError = Boolean(errors?.[0]);

  return (
    <div className={cn("form-field", className)}>
      <label htmlFor={id} className="text-foreground block text-sm font-medium">
        {label}
        {required ? (
          <span className="text-destructive ml-0.5" aria-hidden="true">
            *
          </span>
        ) : null}
      </label>
      {hint ? <p className="text-muted text-xs leading-relaxed">{hint}</p> : null}
      <Select
        id={id}
        name={name}
        required={required}
        defaultValue={defaultValue}
        disabled={disabled}
        aria-invalid={hasError}
        aria-describedby={hasError ? `${id}-error` : undefined}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {children}
      </Select>
      {errors?.[0] ? (
        <p id={`${id}-error`} className="text-destructive text-sm" role="alert">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}
