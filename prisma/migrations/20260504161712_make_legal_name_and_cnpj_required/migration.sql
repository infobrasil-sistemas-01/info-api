/*
  Warnings:

  - Made the column `cnpj` on table `integration_requests` required. This step will fail if there are existing NULL values in that column.
  - Made the column `legal_name` on table `integration_requests` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "integration_requests" ALTER COLUMN "cnpj" SET NOT NULL,
ALTER COLUMN "legal_name" SET NOT NULL;
