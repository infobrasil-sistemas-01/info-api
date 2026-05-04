-- CreateEnum
CREATE TYPE "HostingType" AS ENUM ('DATACENTER', 'CLIENT_SERVER');

-- CreateTable
CREATE TABLE "integration_requests" (
    "id" TEXT NOT NULL,
    "client_name" TEXT NOT NULL,
    "hosting_type" "HostingType" NOT NULL,
    "fixed_ip" TEXT,
    "database" JSONB NOT NULL,
    "stores" INTEGER[],
    "scopes" JSONB NOT NULL,
    "objective" TEXT NOT NULL,
    "technical_contact" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "integration_requests_pkey" PRIMARY KEY ("id")
);
