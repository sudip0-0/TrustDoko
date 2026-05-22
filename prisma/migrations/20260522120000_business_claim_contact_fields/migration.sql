-- AlterEnum
ALTER TYPE "VerificationStatus" ADD VALUE 'TRUSTED_SELLER';

-- AlterTable
ALTER TABLE "BusinessClaim" ADD COLUMN     "ownerName" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ownerEmail" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "ownerPhone" TEXT,
ADD COLUMN     "message" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "documentFileId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "BusinessClaim_documentFileId_key" ON "BusinessClaim"("documentFileId");

-- CreateIndex
CREATE INDEX "BusinessClaim_businessId_status_idx" ON "BusinessClaim"("businessId", "status");

-- AddForeignKey
ALTER TABLE "BusinessClaim" ADD CONSTRAINT "BusinessClaim_documentFileId_fkey" FOREIGN KEY ("documentFileId") REFERENCES "FileAsset"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Remove defaults after backfill (optional cleanup)
ALTER TABLE "BusinessClaim" ALTER COLUMN "ownerName" DROP DEFAULT;
ALTER TABLE "BusinessClaim" ALTER COLUMN "ownerEmail" DROP DEFAULT;
ALTER TABLE "BusinessClaim" ALTER COLUMN "message" DROP DEFAULT;
