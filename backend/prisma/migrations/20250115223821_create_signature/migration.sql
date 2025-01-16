/*
  Warnings:

  - Added the required column `serializedIxBase64` to the `OnChainTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OnChainTransaction" ADD COLUMN     "serializedIxBase64" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Signature" (
    "serializedIxBase64" TEXT NOT NULL,
    "signerPublicKeyBase58" TEXT NOT NULL,
    "signatureBase58" TEXT NOT NULL,

    CONSTRAINT "Signature_pkey" PRIMARY KEY ("signatureBase58")
);
