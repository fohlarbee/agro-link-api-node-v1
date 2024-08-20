/*
  Warnings:

  - The values [queue,kitchen] on the enum `OrderStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `restaurantId` on the `Menu` table. All the data in the column will be lost.
  - You are about to drop the column `paidAt` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `Outlet` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `restaurantId` on the `Shift` table. All the data in the column will be lost.
  - The primary key for the `Staff` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `restaurantId` on the `Staff` table. All the data in the column will be lost.
  - You are about to drop the `Meal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MenuMeals` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `OrderMeal` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Restaurant` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[businessId,name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,businessId]` on the table `Staff` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `businessId` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `kitchenStaffId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `Outlet` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `Role` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `Shift` table without a default value. This is not possible if the table is not empty.
  - Added the required column `businessId` to the `Staff` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "GuardRoles" AS ENUM ('customer', 'admin', 'waiter', 'manager', 'kitchen', 'owner', 'guest');

-- CreateEnum
CREATE TYPE "MenuType" AS ENUM ('starters', 'breakfast', 'lunch', 'dinner', 'mains');

-- CreateEnum
CREATE TYPE "optionType" AS ENUM ('meal', 'drink');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('restaurant', 'bar');

-- AlterEnum
BEGIN;
CREATE TYPE "OrderStatus_new" AS ENUM ('active', 'paid', 'failed', 'preparing', 'rejected', 'cancelled', 'ready', 'completed');
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order" ALTER COLUMN "status" TYPE "OrderStatus_new" USING ("status"::text::"OrderStatus_new");
ALTER TYPE "OrderStatus" RENAME TO "OrderStatus_old";
ALTER TYPE "OrderStatus_new" RENAME TO "OrderStatus";
DROP TYPE "OrderStatus_old";
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'active';
COMMIT;

-- DropForeignKey
ALTER TABLE "Meal" DROP CONSTRAINT "Meal_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_restaurantId_fkey";

-- DropForeignKey
ALTER TABLE "MenuMeals" DROP CONSTRAINT "MenuMeals_mealId_fkey";

-- DropForeignKey
ALTER TABLE "MenuMeals" DROP CONSTRAINT "MenuMeals_menuId_fkey";

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

-- AlterTable
ALTER TABLE "Menu" DROP COLUMN "restaurantId",
ADD COLUMN     "businessId" INTEGER NOT NULL,
ADD COLUMN     "type" "MenuType" NOT NULL DEFAULT 'starters';

-- AlterTable
ALTER TABLE "Order" DROP COLUMN "paidAt",
DROP COLUMN "restaurantId",
ADD COLUMN     "businessId" INTEGER NOT NULL,
ADD COLUMN     "cancelledBy" INTEGER DEFAULT 0,
ADD COLUMN     "kitchenStaffId" INTEGER NOT NULL,
ADD COLUMN     "tip" DOUBLE PRECISION DEFAULT 0;

-- AlterTable
ALTER TABLE "Outlet" DROP COLUMN "restaurantId",
ADD COLUMN     "businessId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "paidAt" SET DEFAULT '1970-01-01 00:00:00 +00:00';

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "restaurantId",
ADD COLUMN     "businessId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "restaurantId",
ADD COLUMN     "businessId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_pkey",
DROP COLUMN "restaurantId",
ADD COLUMN     "businessId" INTEGER NOT NULL,
ADD CONSTRAINT "Staff_pkey" PRIMARY KEY ("userId", "businessId");

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "avatar" TEXT,
ADD COLUMN     "role" "GuardRoles" NOT NULL DEFAULT 'customer';

-- DropTable
DROP TABLE "Meal";

-- DropTable
DROP TABLE "MenuMeals";

-- DropTable
DROP TABLE "OrderMeal";

-- DropTable
DROP TABLE "Restaurant";

-- CreateTable
CREATE TABLE "Business" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cacNumber" VARCHAR(20) NOT NULL,
    "phoneNumber" TEXT NOT NULL,
    "email" TEXT,
    "type" "BusinessType" NOT NULL DEFAULT 'restaurant',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "creatorId" INTEGER NOT NULL,

    CONSTRAINT "Business_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MenuOptions" (
    "menuId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,

    CONSTRAINT "MenuOptions_pkey" PRIMARY KEY ("menuId","optionId")
);

-- CreateTable
CREATE TABLE "Option" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "image" TEXT NOT NULL,
    "type" "optionType" NOT NULL DEFAULT 'meal',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "businessId" INTEGER NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderOption" (
    "quantity" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "optionId" INTEGER NOT NULL,

    CONSTRAINT "OrderOption_pkey" PRIMARY KEY ("orderId","optionId")
);

-- CreateTable
CREATE TABLE "Otp" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "otp" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL,
    "for" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Otp_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Otp_email_key" ON "Otp"("email");

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
ALTER TABLE "Order" ADD CONSTRAINT "Order_kitchenStaffId_businessId_fkey" FOREIGN KEY ("kitchenStaffId", "businessId") REFERENCES "Staff"("userId", "businessId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOption" ADD CONSTRAINT "OrderOption_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderOption" ADD CONSTRAINT "OrderOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;





/*
  Warnings:

  - Added the required column `type` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('DEPOSIT', 'ORDER_PAYMENT', 'REFUND', 'WALLET_TRANSFER');

-- CreateEnum
CREATE TYPE "OwnerType" AS ENUM ('BUSINESS', 'CUSTOMER', 'WAITER', 'KITCHEN_STAFF');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "type" "PaymentType" NOT NULL,
ADD COLUMN     "walletId" INTEGER,
ALTER COLUMN "orderId" DROP NOT NULL;

-- CreateTable
CREATE TABLE "Wallet" (
    "id" SERIAL NOT NULL,
    "balance" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER,
    "businessId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_key" ON "Wallet"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_businessId_key" ON "Wallet"("businessId");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_userId_businessId_key" ON "Wallet"("userId", "businessId");

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;


/*
  Warnings:

  - You are about to drop the column `orderId` on the `Payment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[providerId]` on the table `Payment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `providerId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('PAYSTACK', 'FLUTTERWAVE', 'MONNIFY', 'MONO', 'MOMO_PSB', 'QQ_WALLET');

-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'delivered';

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_orderId_fkey";

-- DropIndex
DROP INDEX "Payment_orderId_key";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "paymentId" INTEGER,
ALTER COLUMN "kitchenStaffId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "orderId",
ADD COLUMN     "provider" "PaymentProvider" NOT NULL DEFAULT 'PAYSTACK',
ADD COLUMN     "providerId" TEXT NOT NULL,
ALTER COLUMN "paidAt" SET DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "Payment_providerId_key" ON "Payment"("providerId");

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;


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



-- AlterTable
ALTER TABLE "Wallet" ADD COLUMN     "locked" BOOLEAN NOT NULL DEFAULT false;





/*
  Warnings:

  - Made the column `authToken` on table `Wallet` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Wallet" ALTER COLUMN "authToken" SET NOT NULL;



/*
  Warnings:

  - Added the required column `businessId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "businessId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;




-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_businessId_fkey";

-- AlterTable
ALTER TABLE "Payment" ALTER COLUMN "userId" DROP NOT NULL,
ALTER COLUMN "businessId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE SET NULL ON UPDATE CASCADE;



-- AlterEnum
ALTER TYPE "PaymentProvider" ADD VALUE 'CUSTOMER_TIP';

-- AlterEnum
ALTER TYPE "PaymentType" ADD VALUE 'TIP';


-- AlterTable
ALTER TABLE "Shift" DROP COLUMN "endTime",
DROP COLUMN "startTime",
ADD COLUMN     "active" BOOLEAN DEFAULT true;

-- CreateTable
CREATE TABLE "Period" (
    "id" SERIAL NOT NULL,
    "shiftId" INTEGER NOT NULL,
    "day" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT,

    CONSTRAINT "Period_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Period" ADD CONSTRAINT "Period_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

