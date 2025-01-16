/*
  Warnings:

  - Added the required column `serializedTxBase64` to the `Signature` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Signature" ADD COLUMN     "serializedTxBase64" TEXT NOT NULL;
