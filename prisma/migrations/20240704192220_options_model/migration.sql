-- TABLE MODIFICATIONS AND RENAMES

-- Drop Meal restaurant id foreign key constraint
ALTER TABLE "Meal" DROP CONSTRAINT "Meal_restaurantId_fkey";

-- Drop Menu restaurant id foreign key constraint
ALTER TABLE "Menu" DROP CONSTRAINT "Menu_restaurantId_fkey";

-- Drop MenuMeals meal id foreign key constraint
ALTER TABLE "MenuMeals" DROP CONSTRAINT "MenuMeals_mealId_fkey";

-- Drop MenuMeals menu id foreign key constraint
ALTER TABLE "MenuMeals" DROP CONSTRAINT "MenuMeals_menuId_fkey";

-- Drop Order restaurant id foreign key constraint
ALTER TABLE "Order" DROP CONSTRAINT "Order_restaurantId_fkey";

-- Drop Order waiter/staff foreign keys constraint
ALTER TABLE "Order" DROP CONSTRAINT "Order_waiterId_restaurantId_fkey";

-- Drop OrderMeal meal id foreign key constraint
ALTER TABLE "OrderMeal" DROP CONSTRAINT "OrderMeal_mealId_fkey";

-- Drop OrderMeal order id foreign key constraint
ALTER TABLE "OrderMeal" DROP CONSTRAINT "OrderMeal_orderId_fkey";

-- Drop Outlet restaurant id foreign key constraint
ALTER TABLE "Outlet" DROP CONSTRAINT "Outlet_restaurantId_fkey";

-- Drop Restaurant creator id foreign key constraint
ALTER TABLE "Restaurant" DROP CONSTRAINT "Restaurant_creatorId_fkey";

-- Drop Role restaurant id foreign key constraint
ALTER TABLE "Role" DROP CONSTRAINT "Role_restaurantId_fkey";

-- Drop Shift restaurant id foreign key constraint
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_restaurantId_fkey";

-- Drop Shift restaurant staff foreign keys constraint
ALTER TABLE "Shift" DROP CONSTRAINT "Shift_userId_restaurantId_fkey";

-- Drop Staff restaurant id foreign key constraint
ALTER TABLE "Staff" DROP CONSTRAINT "Staff_restaurantId_fkey";

-- Drop Unique restaurant role name index
DROP INDEX "Role_restaurantId_name_key";

-- Drop unique restaurant staff index
DROP INDEX "Staff_userId_restaurantId_key";

-- Rename restaurantId column to businessId in Menu table
ALTER TABLE "Menu" RENAME COLUMN "restaurantId" TO "businessId";

-- Rename restaurantId column to businessId in Meal table
ALTER TABLE "Meal" RENAME COLUMN "restaurantId" TO "businessId";

-- Rename Order restaurantId to businessId
ALTER TABLE "Order" RENAME COLUMN "restaurantId" TO "businessId";

-- Raname restaurantId column to businessId in Outlet table
ALTER TABLE "Outlet" RENAME COLUMN "restaurantId" TO "businessId";

-- Raname restaurantId column to businessId in Role table
ALTER TABLE "Role" RENAME COLUMN "restaurantId" TO "businessId";

-- Raname restaurantId column to businessId in Shift table
ALTER TABLE "Shift" RENAME COLUMN "restaurantId" TO   "businessId";

-- Raname restaurantId column to businessId in Staff table
ALTER TABLE "Staff" RENAME COLUMN "restaurantId" TO   "businessId";

-- Rename mealId column to optionId on MenuMeals table
ALTER TABLE "MenuMeals" RENAME COLUMN "mealId" TO "optionId";

-- Rename mealId to optionId on OrderMeal table
ALTER TABLE "OrderMeal" RENAME COLUMN "mealId" TO "optionId";

-- Rename Meal to Option
ALTER TABLE "Meal" RENAME TO "Option"; 

-- Rename MenuMeals to MenuOptions
ALTER TABLE "MenuMeals" RENAME TO "MenuOptions";

-- Rename OrderMeal to OrderOption
ALTER TABLE "OrderMeal" RENAME TO "OrderOption";

-- Rename Restaurant to Business
ALTER TABLE  "Restaurant" RENAME to "Business";

-- Change Staff primary key constraint
ALTER TABLE "Staff" 
  DROP CONSTRAINT "Staff_pkey",
  ADD CONSTRAINT "Staff_pkey" PRIMARY KEY ("userId", "businessId");

-- Change Business primary key constraint
ALTER TABLE "Business" 
  DROP CONSTRAINT "Restaurant_pkey",
  ADD CONSTRAINT "Business_pkey" PRIMARY KEY ("id");

-- Change MenuOptions primary key constraint
ALTER TABLE "MenuOptions"
  DROP CONSTRAINT "MenuMeals_pkey",
  ADD CONSTRAINT "MenuOptions_pkey" PRIMARY KEY ("menuId", "optionId");

-- Change Option primary key constraint
ALTER TABLE "Option" 
  DROP CONSTRAINT "Meal_pkey",
  ADD CONSTRAINT "Option_pkey" PRIMARY KEY ("id");

-- Change OrderOption primary key constraint
ALTER TABLE "OrderOption" 
  DROP CONSTRAINT "OrderMeal_pkey",
  ADD CONSTRAINT "OrderOption_pkey" PRIMARY KEY ("orderId","optionId");

-- Create unique business role name index
CREATE UNIQUE INDEX "Role_businessId_name_key" ON "Role"("businessId", "name");

-- Create unique business staff index
CREATE UNIQUE INDEX "Staff_userId_businessId_key" ON "Staff"("userId", "businessId");

-- Add creator id foreign key constraint
ALTER TABLE "Business" ADD CONSTRAINT "Business_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add business id foreign key constraint
ALTER TABLE "Role" ADD CONSTRAINT "Role_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add business id foreign key constraint
ALTER TABLE "Staff" ADD CONSTRAINT "Staff_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add business id foreign key constraint
ALTER TABLE "Outlet" ADD CONSTRAINT "Outlet_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add business id foreign key constraint
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add staff foreign keys constraint
ALTER TABLE "Shift" ADD CONSTRAINT "Shift_userId_businessId_fkey" FOREIGN KEY ("userId", "businessId") REFERENCES "Staff"("userId", "businessId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add business id foreign key constraint
ALTER TABLE "Menu" ADD CONSTRAINT "Menu_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add menu id foreign key constraint
ALTER TABLE "MenuOptions" ADD CONSTRAINT "MenuOptions_menuId_fkey" FOREIGN KEY ("menuId") REFERENCES "Menu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add option id foreign key constraint
ALTER TABLE "MenuOptions" ADD CONSTRAINT "MenuOptions_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add business id foreign key constraint
ALTER TABLE "Option" ADD CONSTRAINT "Option_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add business id foreign key constraint
ALTER TABLE "Order" ADD CONSTRAINT "Order_businessId_fkey" FOREIGN KEY ("businessId") REFERENCES "Business"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add staff/waiter foreign keys constraint
ALTER TABLE "Order" ADD CONSTRAINT "Order_waiterId_businessId_fkey" FOREIGN KEY ("waiterId", "businessId") REFERENCES "Staff"("userId", "businessId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Order foreign key constraint
ALTER TABLE "OrderOption" ADD CONSTRAINT "OrderOption_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add Option foreign key constraint
ALTER TABLE "OrderOption" ADD CONSTRAINT "OrderOption_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "Option"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- NEW CHANGES

-- CreateEnum
CREATE TYPE "optionType" AS ENUM ('meal', 'drink');

-- CreateEnum
CREATE TYPE "BusinessType" AS ENUM ('restaurant', 'bar');

-- Add type column to Business table
ALTER TABLE "Business"
  ADD COLUMN "type" "BusinessType" NOT NULL DEFAULT 'restaurant';

-- Add type column to Option table
ALTER TABLE "Option"
  ADD COLUMN "type" "optionType" NOT NULL DEFAULT 'meal';

-- Add avatar column to User table
ALTER TABLE "User"
  ADD COLUMN "avatar" TEXT;

-- Add tip column to Order table
ALTER TABLE "Order" ADD COLUMN     "tip" DOUBLE PRECISION;

