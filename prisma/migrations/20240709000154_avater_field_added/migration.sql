/*
  Warnings:

  - You are about to drop the column `hotelId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `Bar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BarItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hotel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "BarItems" DROP CONSTRAINT "BarItems_barId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_hotelId_fkey";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "hotelId",
ALTER COLUMN "tip" DROP NOT NULL;

-- DropTable
DROP TABLE "Bar";

-- DropTable
DROP TABLE "BarItems";

-- DropTable
DROP TABLE "Hotel";
