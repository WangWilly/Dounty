-- CreateTable
CREATE TABLE "OnChainTransaction" (
    "publicKey" TEXT NOT NULL,
    "serializedTx" JSONB NOT NULL,
    "serializedTxBase64" TEXT NOT NULL,

    CONSTRAINT "OnChainTransaction_pkey" PRIMARY KEY ("publicKey")
);
