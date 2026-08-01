-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN "usedAt" TIMESTAMP(3);

-- CreateIndex
CREATE INDEX "refresh_tokens_userId_usedAt_idx" ON "refresh_tokens"("userId", "usedAt");
