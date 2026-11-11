-- CreateIndex
CREATE INDEX IF NOT EXISTS "request_logs_created_at_idx" ON "request_logs"("created_at");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "request_logs_created_at_status_idx" ON "request_logs"("created_at", "status");

-- CreateTable
CREATE TABLE IF NOT EXISTS "dashboard_hourly_rollups" (
    "id" TEXT NOT NULL,
    "bucket" TIMESTAMP(3) NOT NULL,
    "total_requests" INTEGER NOT NULL,
    "success_count" INTEGER NOT NULL,
    "client_error_count" INTEGER NOT NULL,
    "server_error_count" INTEGER NOT NULL,
    "rate_limit_count" INTEGER NOT NULL,
    "avg_duration_ms" DOUBLE PRECISION NOT NULL,
    "p95_duration_ms" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dashboard_hourly_rollups_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "dashboard_hourly_rollups_bucket_key" ON "dashboard_hourly_rollups"("bucket");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "dashboard_hourly_rollups_bucket_idx" ON "dashboard_hourly_rollups"("bucket");
