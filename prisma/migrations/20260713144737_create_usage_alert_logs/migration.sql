-- CreateTable
CREATE TABLE "usage_alert_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "alert_type" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "usage_alert_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "usage_alert_logs_user_id_sent_at_idx" ON "usage_alert_logs"("user_id", "sent_at");

-- AddForeignKey
ALTER TABLE "usage_alert_logs" ADD CONSTRAINT "usage_alert_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
