-- AlterTable
ALTER TABLE "request_logs" ADD COLUMN "duration_ms" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "system_heartbeats" (
    "id" TEXT NOT NULL,
    "service" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_heartbeats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "system_heartbeats_service_key" ON "system_heartbeats"("service");
