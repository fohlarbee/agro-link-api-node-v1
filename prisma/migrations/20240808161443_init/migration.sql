-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'delivered';

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "kitchenStaffId" DROP NOT NULL;
