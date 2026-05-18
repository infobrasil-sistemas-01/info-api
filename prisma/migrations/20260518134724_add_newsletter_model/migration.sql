-- AlterTable
ALTER TABLE "announcements" ADD COLUMN     "newsletter_id" INTEGER;

-- CreateTable
CREATE TABLE "newsletters" (
    "id" SERIAL NOT NULL,
    "subject" VARCHAR(255) NOT NULL,
    "initial_message" TEXT,
    "final_message" TEXT,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "newsletters_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "announcements" ADD CONSTRAINT "announcements_newsletter_id_fkey" FOREIGN KEY ("newsletter_id") REFERENCES "newsletters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
