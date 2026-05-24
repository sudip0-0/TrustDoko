import { z } from "zod";

export const businessResponseTargetSchema = z
  .object({
    reviewId: z.string().trim().min(1).optional(),
    complaintId: z.string().trim().min(1).optional(),
  })
  .refine(
    (target) =>
      Number(Boolean(target.reviewId)) + Number(Boolean(target.complaintId)) ===
      1,
    {
      message: "Business response must target exactly one review or complaint",
    },
  );

export type BusinessResponseTarget = z.infer<
  typeof businessResponseTargetSchema
>;

export function parseBusinessResponseTarget(
  target: BusinessResponseTarget,
): BusinessResponseTarget {
  return businessResponseTargetSchema.parse(target);
}
