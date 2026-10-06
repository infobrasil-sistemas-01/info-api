-- CreateEnum
CREATE TYPE "FeatureRequestStatus" AS ENUM ('PENDING', 'ANSWERED', 'RESOLVED');

-- AlterTable
ALTER TABLE "feature_requests" 
    ALTER COLUMN "status" DROP DEFAULT,
    ALTER COLUMN "status" TYPE "FeatureRequestStatus" USING ("status"::text::"FeatureRequestStatus"),
    ALTER COLUMN "status" SET DEFAULT 'PENDING',
    ADD COLUMN "resolved_at" TIMESTAMP(3);
