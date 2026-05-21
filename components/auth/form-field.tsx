type FormFieldProps = {
  id: string;
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  errors?: string[];
};

export function FormField({
  id,
  label,
  name,
  type = "text",
  autoComplete,
  required = true,
  errors,
}: FormFieldProps) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="text-foreground block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        className="border-border bg-background text-foreground focus:ring-primary/30 w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2"
      />
      {errors?.[0] ? (
        <p className="text-sm text-red-600" role="alert">
          {errors[0]}
        </p>
      ) : null}
    </div>
  );
}
