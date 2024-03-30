-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('active', 'paid', 'in_queue', 'completed');

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'active',
    "customerId" INTEGER NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderMeal" (
    "quantity" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,
    "mealId" INTEGER NOT NULL,

    CONSTRAINT "OrderMeal_pkey" PRIMARY KEY ("orderId","mealId")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderMeal" ADD CONSTRAINT "OrderMeal_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderMeal" ADD CONSTRAINT "OrderMeal_mealId_fkey" FOREIGN KEY ("mealId") REFERENCES "Meal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
