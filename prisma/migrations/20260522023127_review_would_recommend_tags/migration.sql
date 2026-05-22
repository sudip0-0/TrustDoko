-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "wouldRecommend" BOOLEAN NOT NULL DEFAULT true;
