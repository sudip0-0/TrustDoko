/*
  Warnings:

  - Added the required column `experienceDate` to the `Complaint` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ComplaintAmountRange" AS ENUM ('UNDER_1000', 'AMOUNT_1000_5000', 'AMOUNT_5000_20000', 'OVER_20000', 'PREFER_NOT_SAY');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ComplaintCategory" ADD VALUE 'MISLEADING_PRICING';
ALTER TYPE "ComplaintCategory" ADD VALUE 'NO_RESPONSE';
ALTER TYPE "ComplaintCategory" ADD VALUE 'DUPLICATE_BUSINESS';

-- AlterTable
ALTER TABLE "Complaint" ADD COLUMN     "allowAdminContact" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "amountRange" "ComplaintAmountRange",
ADD COLUMN     "experienceDate" TIMESTAMP(3) NOT NULL;
