/*
  Warnings:

  - You are about to drop the column `authToken` on the `Wallet` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `Period` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('SEND', 'RECIEVE', 'TRANSFER');

-- AlterEnum
ALTER TYPE "PaymentType" ADD VALUE 'WALLET_CREDIT';

-- DropIndex
DROP INDEX "Wallet_authToken_key";

-- AlterTable
ALTER TABLE "Period" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Wallet" DROP COLUMN "authToken";

-- CreateTable
CREATE TABLE "AuthCode" (
    "type" "TokenType" NOT NULL,
    "code" TEXT NOT NULL,
    "expired" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "walletId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "AuthCode_code_key" ON "AuthCode"("code");

-- AddForeignKey
ALTER TABLE "AuthCode" ADD CONSTRAINT "AuthCode_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
