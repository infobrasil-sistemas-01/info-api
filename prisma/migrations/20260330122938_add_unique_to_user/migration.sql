/*
  Warnings:

  - A unique constraint covering the columns `[user]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "users_user_key" ON "users"("user");
