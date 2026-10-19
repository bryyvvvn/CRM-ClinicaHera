-- CreateEnum
CREATE TYPE "ChatStatus" AS ENUM ('open', 'resolved');

-- AlterTable
ALTER TABLE "ChatSession" ADD COLUMN     "attentionAt" TIMESTAMP(3),
ADD COLUMN     "attentionReason" TEXT,
ADD COLUMN     "contextStartAt" TIMESTAMP(3),
ADD COLUMN     "needsAttention" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "resolvedAt" TIMESTAMP(3),
ADD COLUMN     "status" "ChatStatus" NOT NULL DEFAULT 'open';

-- CreateIndex
CREATE INDEX "ChatSession_status_updatedAt_idx" ON "ChatSession"("status", "updatedAt");
