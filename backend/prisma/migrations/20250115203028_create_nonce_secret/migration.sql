/*
  Warnings:

  - Added the required column `secretKey` to the `NonceAccount` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "NonceAccount" ADD COLUMN     "secretKey" TEXT NOT NULL;
