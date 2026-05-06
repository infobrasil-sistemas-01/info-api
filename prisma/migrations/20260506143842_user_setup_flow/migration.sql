/*
  Warnings:

  - A unique constraint covering the columns `[password_setup_token]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email" TEXT,
ADD COLUMN     "password_setup_token" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_password_setup_token_key" ON "users"("password_setup_token");
