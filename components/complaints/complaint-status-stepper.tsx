import { ComplaintStatus } from "@prisma/client";

import { StatusChip } from "@/components/ui/status-chip";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "submitted", label: "Submitted" },
  { key: "review", label: "Under review" },
  { key: "responded", label: "Business responded" },
  { key: "resolved", label: "Resolved" },
] as const;

function stepIndex(status: ComplaintStatus): number {
  switch (status) {
    case ComplaintStatus.SUBMITTED:
      return 1;
    case ComplaintStatus.UNDER_REVIEW:
      return 2;
    case ComplaintStatus.BUSINESS_RESPONDED:
      return 3;
    case ComplaintStatus.RESOLVED:
      return 4;
    case ComplaintStatus.UNRESOLVED:
      return 3;
    case ComplaintStatus.REJECTED:
      return 1;
    default:
      return 1;
  }
}

type ComplaintStatusStepperProps = {
  status: ComplaintStatus;
  className?: string;
};

export function ComplaintStatusStepper({
  status,
  className,
}: ComplaintStatusStepperProps) {
  const active = stepIndex(status);
  const isUnresolved = status === ComplaintStatus.UNRESOLVED;
  const isRejected = status === ComplaintStatus.REJECTED;

  return (
    <div className={cn("space-y-3", className)}>
      <ol className="flex list-none flex-wrap gap-2 p-0 sm:gap-0">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const done = stepNumber < active;
          const current = stepNumber === active;
          return (
            <li
              key={step.key}
              className="flex min-w-[4.5rem] flex-1 flex-col items-center gap-1 text-center sm:min-w-0"
            >
              <span
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold",
                  done || current
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-muted",
                )}
                aria-hidden="true"
              >
                {done ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 16 16"
                    fill="currentColor"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.416 4.376a.75.75 0 0 1 .208 1.04l-5 6.5a.75.75 0 0 1-1.154.114l-3-3.5a.75.75 0 0 1 1.06-1.06l2.353 2.744 4.49-5.837a.75.75 0 0 1 1.04-.207Z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNumber
                )}
              </span>
              <span
                className={cn(
                  "text-[10px] leading-tight font-medium sm:text-xs",
                  current ? "text-primary" : "text-muted",
                )}
              >
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
      {isUnresolved ? (
        <StatusChip variant="danger">Unresolved complaint</StatusChip>
      ) : null}
      {isRejected ? (
        <StatusChip variant="muted">Not accepted for publication</StatusChip>
      ) : null}
    </div>
  );
}
