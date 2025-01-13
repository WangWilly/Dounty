/*
  Warnings:

  - You are about to drop the `onChainTransaction` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "onChainTransaction";

-- CreateTable
CREATE TABLE "OnChainTransaction" (
    "publicKey" TEXT NOT NULL,
    "serializedTx" JSONB NOT NULL,

    CONSTRAINT "OnChainTransaction_pkey" PRIMARY KEY ("publicKey")
);
