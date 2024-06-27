/*
  Warnings:

  - You are about to drop the column `creatorId` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `Hotel` table. All the data in the column will be lost.
  - You are about to drop the column `tipsForOrder` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the `BarItem` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Hotel" DROP COLUMN "creatorId",
DROP COLUMN "restaurantId";

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "tipsForOrder",
ADD COLUMN     "hotelId" INTEGER;

-- DropTable
DROP TABLE "BarItem";

-- CreateTable
CREATE TABLE "Bar" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BarItems" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "image" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "barId" INTEGER NOT NULL,

    CONSTRAINT "BarItems_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Bar_name_key" ON "Bar"("name");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "Hotel"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BarItems" ADD CONSTRAINT "BarItems_barId_fkey" FOREIGN KEY ("barId") REFERENCES "Bar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
