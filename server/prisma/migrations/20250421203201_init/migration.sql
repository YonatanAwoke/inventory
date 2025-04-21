/*
  Warnings:

  - You are about to drop the `_BudgetToPurchase` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_BudgetToPurchase" DROP CONSTRAINT "_BudgetToPurchase_A_fkey";

-- DropForeignKey
ALTER TABLE "_BudgetToPurchase" DROP CONSTRAINT "_BudgetToPurchase_B_fkey";

-- AlterTable
ALTER TABLE "Purchase" ADD COLUMN     "budgetId" INTEGER;

-- DropTable
DROP TABLE "_BudgetToPurchase";

-- AddForeignKey
ALTER TABLE "Purchase" ADD CONSTRAINT "Purchase_budgetId_fkey" FOREIGN KEY ("budgetId") REFERENCES "Budget"("id") ON DELETE SET NULL ON UPDATE CASCADE;
