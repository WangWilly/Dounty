-- CreateTable
CREATE TABLE "NonceAccount" (
    "publicKey" TEXT NOT NULL,
    "txPublicKey" TEXT NOT NULL,

    CONSTRAINT "NonceAccount_pkey" PRIMARY KEY ("publicKey")
);
