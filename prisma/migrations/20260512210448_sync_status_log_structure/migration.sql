/*
  Warnings:

  - You are about to drop the column `latency` on the `status_logs` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `status_logs` table. All the data in the column will be lost.
  - Added the required column `apiLatency` to the `status_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `apiStatus` to the `status_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dbLatency` to the `status_logs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `dbStatus` to the `status_logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "status_logs" DROP COLUMN "latency",
DROP COLUMN "status",
ADD COLUMN     "apiLatency" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "apiStatus" VARCHAR(10) NOT NULL DEFAULT 'UP',
ADD COLUMN     "dbLatency" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "dbStatus" VARCHAR(10) NOT NULL DEFAULT 'UP';

-- Remove defaults after update (optional, but keeps schema clean as defined in prisma)
ALTER TABLE "status_logs" ALTER COLUMN "apiLatency" DROP DEFAULT,
ALTER COLUMN "apiStatus" DROP DEFAULT,
ALTER COLUMN "dbLatency" DROP DEFAULT,
ALTER COLUMN "dbStatus" DROP DEFAULT;
