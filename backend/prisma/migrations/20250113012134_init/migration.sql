-- CreateTable
CREATE TABLE "onChainTransaction" (
    "public_key" TEXT NOT NULL,
    "serialized_tx" JSONB NOT NULL,

    CONSTRAINT "onChainTransaction_pkey" PRIMARY KEY ("public_key")
);
