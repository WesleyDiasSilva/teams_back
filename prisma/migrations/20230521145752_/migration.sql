/*
  Warnings:

  - You are about to drop the column `isEmailVerified` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "isEmailVerified",
ADD COLUMN     "is_email_verified" BOOLEAN NOT NULL DEFAULT false;
