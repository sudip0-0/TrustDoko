/*
  Warnings:

  - You are about to drop the column `businessResponse` on the `Complaint` table. All the data in the column will be lost.
  - You are about to drop the column `businessReply` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the `VerificationRequest` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "BusinessVerificationType" AS ENUM ('CONTACT', 'DOCUMENT', 'SOCIAL', 'WEBSITE');

-- CreateEnum
CREATE TYPE "BusinessVerificationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- DropForeignKey
ALTER TABLE "VerificationRequest" DROP CONSTRAINT "VerificationRequest_businessId_fkey";

-- DropForeignKey
ALTER TABLE "VerificationRequest" DROP CONSTRAINT "VerificationRequest_fileId_fkey";

-- DropForeignKey
ALTER TABLE "VerificationRequest" DROP CONSTRAINT "VerificationRequest_requestedByUserId_fkey";

-- AlterTable
ALTER TABLE "Complaint" DROP COLUMN "businessResponse";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "businessReply";

-- DropTable
DROP TABLE "VerificationRequest";

-- DropEnum
DROP TYPE "VerificationRequestStatus";

-- DropEnum
DROP TYPE "VerificationRequestType";

-- CreateTable
CREATE TABLE "BusinessVerification" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "requestedByUserId" TEXT NOT NULL,
    "type" "BusinessVerificationType" NOT NULL,
    "status" "BusinessVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "fileId" TEXT,
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewVote" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SavedBusiness" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SavedBusiness_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessResponse" (
    "id" TEXT NOT NULL,
    "businessId" TEXT NOT NULL,
    "authorUserId" TEXT NOT NULL,
    "reviewId" TEXT,
    "complaintId" TEXT,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BusinessVerification_businessId_idx" ON "BusinessVerification"("businessId");

-- CreateIndex
CREATE INDEX "BusinessVerification_requestedByUserId_idx" ON "BusinessVerification"("requestedByUserId");

-- CreateIndex
CREATE INDEX "BusinessVerification_status_idx" ON "BusinessVerification"("status");

-- CreateIndex
CREATE INDEX "BusinessVerification_type_idx" ON "BusinessVerification"("type");

-- CreateIndex
CREATE INDEX "ReviewVote_reviewId_idx" ON "ReviewVote"("reviewId");

-- CreateIndex
CREATE INDEX "ReviewVote_userId_idx" ON "ReviewVote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewVote_reviewId_userId_key" ON "ReviewVote"("reviewId", "userId");

-- CreateIndex
CREATE INDEX "SavedBusiness_userId_idx" ON "SavedBusiness"("userId");

-- CreateIndex
CREATE INDEX "SavedBusiness_businessId_idx" ON "SavedBusiness"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedBusiness_userId_businessId_key" ON "SavedBusiness"("userId", "businessId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessResponse_reviewId_key" ON "BusinessResponse"("reviewId");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessResponse_complaintId_key" ON "BusinessResponse"("complaintId");

-- CreateIndex
CREATE INDEX "BusinessResponse_businessId_idx" ON "BusinessResponse"("businessId");

-- CreateIndex
CREATE INDEX "BusinessResponse_authorUserId_idx" ON "BusinessResponse"("authorUserId");

-- CreateIndex
CREATE INDEX "AuditLog_action_idx" ON "AuditLog"("action");

-- CreateIndex
CREATE INDEX "Business_province_idx" ON "Business"("province");

-- CreateIndex
CREATE INDEX "Business_averageRating_idx" ON "Business"("averageRating");

-- CreateIndex
CREATE INDEX "Business_city_categoryId_idx" ON "Business"("city", "categoryId");

-- CreateIndex
CREATE INDEX "Category_name_idx" ON "Category"("name");

-- CreateIndex
CREATE INDEX "Complaint_businessId_status_idx" ON "Complaint"("businessId", "status");

-- CreateIndex
CREATE INDEX "Review_rating_idx" ON "Review"("rating");

-- CreateIndex
CREATE INDEX "Review_businessId_status_idx" ON "Review"("businessId", "status");

-- AddForeignKey
ALTER TABLE "BusinessVerification" ADD CONSTRAINT "BusinessVerification_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessVerification" ADD CONSTRAINT "BusinessVerification_requestedByUserId_fkey" FOREIGN KEY ("requestedByUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessVerification" ADD CONSTRAINT "BusinessVerification_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "FileAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewVote" ADD CONSTRAINT "ReviewVote_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewVote" ADD CONSTRAINT "ReviewVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedBusiness" ADD CONSTRAINT "SavedBusiness_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SavedBusiness" ADD CONSTRAINT "SavedBusiness_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessResponse" ADD CONSTRAINT "BusinessResponse_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessResponse" ADD CONSTRAINT "BusinessResponse_authorUserId_fkey" FOREIGN KEY ("authorUserId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessResponse" ADD CONSTRAINT "BusinessResponse_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BusinessResponse" ADD CONSTRAINT "BusinessResponse_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES "Complaint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
