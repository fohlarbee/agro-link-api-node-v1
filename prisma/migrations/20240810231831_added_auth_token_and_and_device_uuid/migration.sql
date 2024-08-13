/*
  Warnings:

  - A unique constraint covering the columns `[authToken]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[pin]` on the table `Wallet` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "deviceUUID" TEXT;

-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "authToken" TEXT,
ADD COLUMN     "pin" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_authToken_key" ON "Wallet"("authToken");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_pin_key" ON "Wallet"("pin");
