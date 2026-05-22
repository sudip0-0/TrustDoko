-- AlterTable
ALTER TABLE "Business" ADD COLUMN "trustScoreReasons" JSONB,
ADD COLUMN "trustScoreUpdatedAt" TIMESTAMP(3);
