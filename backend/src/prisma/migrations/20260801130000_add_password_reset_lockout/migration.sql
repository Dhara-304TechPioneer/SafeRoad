-- AlterTable
ALTER TABLE "password_resets"
ADD COLUMN "failedAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "lockedUntil" TIMESTAMP(3);
