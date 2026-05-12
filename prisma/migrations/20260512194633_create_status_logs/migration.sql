-- CreateTable
CREATE TABLE "status_logs" (
    "id" TEXT NOT NULL,
    "status" VARCHAR(10) NOT NULL,
    "latency" INTEGER NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "status_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "status_logs_timestamp_idx" ON "status_logs"("timestamp");
