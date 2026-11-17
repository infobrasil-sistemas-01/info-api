-- AlterTable
ALTER TABLE "webhook_subscriptions" ADD COLUMN "consecutive_failures" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN "is_paused" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN "paused_at" TIMESTAMP(3),
ADD COLUMN "pause_reason" VARCHAR(255);
