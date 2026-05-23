import { AdminNav } from "@/components/admin/admin-nav";
import { cn } from "@/lib/utils";

type AdminShellProps = {
  children: React.ReactNode;
};

const privacyNotes = [
  "Proof files and business documents are private. Only admins can view uploaded files.",
  "Risky claims are reviewed before publishing. Use careful public language.",
  "Admin actions are logged for accountability.",
] as const;

export function AdminShell({ children }: AdminShellProps) {
  return (
    <div className="dashboard-surface -mx-4 flex min-h-[calc(100dvh-5rem)] flex-col sm:-mx-6 lg:-mx-8 lg:flex-row">
      <aside className="border-border bg-card shrink-0 border-b lg:w-56 lg:border-r lg:border-b-0">
        <div className="px-4 py-5 lg:px-4">
          <p className="type-eyebrow">TrustDoko Admin</p>
          <p className="type-caption mt-2">Moderation queues and verification</p>
        </div>
        <AdminNav variant="sidebar" />
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</div>
        <footer className="border-t border-border bg-muted/20 px-4 py-4 sm:px-6 lg:px-8">
          <ul className="text-muted grid list-none gap-2 p-0 text-xs leading-relaxed sm:grid-cols-3">
            {privacyNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </footer>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  className,
}: {
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <header className={cn("mb-6 border-b border-border pb-5", className)}>
      <h1 className="type-h1">{title}</h1>
      {description ? <p className="type-body mt-2">{description}</p> : null}
    </header>
  );
}
