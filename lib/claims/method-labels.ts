import { BusinessClaimMethod } from "@prisma/client";

export const claimMethods = [
  "PHONE",
  "EMAIL",
  "WEBSITE",
  "SOCIAL",
  "DOCUMENT",
] as const satisfies readonly BusinessClaimMethod[];

export const claimMethodLabels: Record<BusinessClaimMethod, string> = {
  PHONE: "Phone verification",
  EMAIL: "Email verification",
  WEBSITE: "Website verification",
  SOCIAL: "Social media verification",
  DOCUMENT: "Document verification",
};
