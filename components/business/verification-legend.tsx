import { verificationBadgeLegend } from "@/lib/business/verification-display";

export function VerificationLegend() {
  return (
    <div className="text-muted mt-4 space-y-2 text-xs leading-relaxed">
      <p className="text-foreground font-medium">Verification badges</p>
      <ul className="list-inside list-disc space-y-1">
        {verificationBadgeLegend.map((item) => (
          <li key={item.key}>
            <span className="text-foreground font-medium">{item.label}</span>
            {" — "}
            {item.description}
          </li>
        ))}
      </ul>
    </div>
  );
}
