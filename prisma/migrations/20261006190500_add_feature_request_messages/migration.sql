-- CreateTable
CREATE TABLE "feature_request_messages" (
    "id" TEXT NOT NULL,
    "feature_request_id" TEXT NOT NULL,
    "sender_id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feature_request_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "feature_request_messages_feature_request_id_created_at_idx" ON "feature_request_messages"("feature_request_id", "created_at");

-- CreateIndex
CREATE INDEX "feature_request_messages_sender_id_idx" ON "feature_request_messages"("sender_id");

-- AddForeignKey
ALTER TABLE "feature_request_messages" ADD CONSTRAINT "feature_request_messages_feature_request_id_fkey" FOREIGN KEY ("feature_request_id") REFERENCES "feature_requests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_request_messages" ADD CONSTRAINT "feature_request_messages_sender_id_fkey" FOREIGN KEY ("sender_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
