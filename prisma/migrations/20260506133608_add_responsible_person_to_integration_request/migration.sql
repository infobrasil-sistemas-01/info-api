-- AlterTable
ALTER TABLE "integration_requests" ADD COLUMN     "responsible_person" JSONB NOT NULL DEFAULT '{}',
ALTER COLUMN "cnpj" DROP NOT NULL;
