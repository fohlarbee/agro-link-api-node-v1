/*
  Warnings:

  - You are about to drop the column `restaurantId` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `hotelId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `Outlet` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `Shift` table. All the data in the column will be lost.
  - The primary key for the `Staff` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `restaurantId` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the `Bar` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BarItems` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Hotel` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Meal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenuMeals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderMeal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Restaurant` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[businessId,name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,businessId]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `businessId` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `Outlet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "optionType" AS ENUM ('meal', 'drink');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('restaurant', 'bar');

-- DropForeignKey
ALTER TABLE "BarItems" DROP CONSTRAINT "BarItems_barId_fkey";

-- DropForeignKey
ALTER TABLE "Meal" DROP CONSTRAINT "Meal_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "MenuMeals" DROP CONSTRAINT "MenuMeals_mealId_fkey";

-- DropForeignKey
ALTER TABLE "MenuMeals" DROP CONSTRAINT "MenuMeals_menuId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_hotelId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_waiterId_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "OrderMeal" DROP CONSTRAINT "OrderMeal_mealId_fkey";

-- DropForeignKey
ALTER TABLE "OrderMeal" DROP CONSTRAINT "OrderMeal_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Outlet" DROP CONSTRAINT "Outlet_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "Restaurant" DROP CONSTRAINT "Restaurant_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_userId_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_restaurantId_fkey";

-- DropIndex
DROP INDEX "Role_restaurantId_name_key";

-- DropIndex
DROP INDEX "Staff_userId_restaurantId_key";

-- AlterTable and column
ALTER TABLE "Menu"
RENAME COLUMN "restaurantId", TO   "businessId" INTEGER NOT NULL;



-- AlterTable and column

ALTER TABLE "Order" DROP COLUMN "hotelId",
RENAME COLUMN "restaurantId", TO   "businessId" INTEGER NOT NULL,
ALTER COLUMN "tip" DROP NOT NULL;





-- AlterTable and column c
ALTER TABLE "Outlet" RENAME COLUMN "restaurantId", TO   "businessId" INTEGER NOT NULL;


-- AlterTable and column
ALTER TABLE "Role" RENAME COLUMN "restaurantId", TO  "businessId" INTEGER NOT NULL;


-- AlterTable
ALTER TABLE "Shift" RENAME COLUMN "restaurantId", TO   "businessId" INTEGER NOT NULL;


-- AlterTable and column

ALTER TABLE "Staff" DROP CONSTRAINT "Staff_pkey",
RENAME COLUMN "restaurantId", TO   "businessId" INTEGER NOT NULL,
ADD CONSTRAINT "Staff_pkey" PRIMARY KEY ("userId", "businessId");


-- DropTable
DROP TABLE "Bar";

-- DropTable
DROP TABLE "BarItems";

-- DropTable
DROP TABLE "Hotel";

-- RenameTable
RENAME TABLE "Meal", TO "Option"; 


-- RenameTable
RENAME TABLE "MenuMeals", TO "MenuOptions";

-- RenameTable
RENAME TABLE "OrderMeal", TO "OrderOption";


-- RenameTable
RENAME TABLE  "Restaurant", to "Business";



--Add new constraint to table
ALTER TABLE Business
ADD CONSTRAINT Business_pkey PRIMARY KEY ("id");



--Add new constraint to table
ALTER TABLE MenuOptions
ADD CONSTRAINT MenuOptions_pkey PRIMARY KEY ("menuId","optionId");


--Add new constraint to table
ALTER TABLE Option
ADD CONSTRAINT Option_pkey PRIMARY KEY ("id");


--Add new constraint to table
ALTER TABLE OrderOption
ADD CONSTRAINT OrderOption_pkey PRIMARY KEY ("orderId","optionId");






-- CreateIndex
CREATE UNIQUE INDEX "Role_businessId_name_key" ON "Role"("businessId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Staff_userId_businessId_key" ON "Staff"("userId", "businessId");

-- AddForeignKey
ALTER TABLE "Business" ADD CONSTRAINT "Business_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Outlet" ADD CONSTRAINT "Outlet_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_userId_businessId_fkey" FOREIGN KEY ("userId", "businessId") REFERENCES "Staff"("userId", "businessId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuOptions" ADD CONSTRAINT "MenuOptions_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MenuOptions" ADD CONSTRAINT "MenuOptions_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_waiterId_businessId_fkey" FOREIGN KEY ("waiterId", "businessId") REFERENCES "Staff"("userId", "businessId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOption" ADD CONSTRAINT "OrderOption_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOption" ADD CONSTRAINT "OrderOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
