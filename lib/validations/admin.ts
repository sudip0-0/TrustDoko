import { z } from "zod";

export const moderateReviewSchema = z.object({
  reviewId: z.string().trim().min(1),
  action: z.enum(["approve", "reject", "flag", "under_review", "delete"]),
});

export const updateComplaintModerationSchema = z.object({
  complaintId: z.string().trim().min(1),
  status: z.enum([
    "SUBMITTED",
    "UNDER_REVIEW",
    "BUSINESS_RESPONDED",
    "RESOLVED",
    "UNRESOLVED",
    "REJECTED",
  ]),
  adminNote: z.string().trim().max(2000).optional(),
});

export const updateUserModerationSchema = z.object({
  userId: z.string().trim().min(1),
  trustLevel: z.enum(["NEW", "VERIFIED", "TRUSTED", "FLAGGED"]),
});
