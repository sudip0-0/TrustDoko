-- Enforce exactly one owner-response target and valid review ratings.
-- CHECK constraints are added NOT VALID first to avoid a long exclusive lock,
-- then validated in-place so existing invalid data fails visibly.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'Review_rating_range_check'
      AND conrelid = '"Review"'::regclass
  ) THEN
    ALTER TABLE "Review"
      ADD CONSTRAINT "Review_rating_range_check"
      CHECK ("rating" >= 1 AND "rating" <= 5) NOT VALID;
  END IF;
END
$$;

ALTER TABLE "Review"
  VALIDATE CONSTRAINT "Review_rating_range_check";

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'BusinessResponse_exactly_one_target_check'
      AND conrelid = '"BusinessResponse"'::regclass
  ) THEN
    ALTER TABLE "BusinessResponse"
      ADD CONSTRAINT "BusinessResponse_exactly_one_target_check"
      CHECK (num_nonnulls("reviewId", "complaintId") = 1) NOT VALID;
  END IF;
END
$$;

ALTER TABLE "BusinessResponse"
  VALIDATE CONSTRAINT "BusinessResponse_exactly_one_target_check";
