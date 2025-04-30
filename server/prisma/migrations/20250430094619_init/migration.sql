/*
  Warnings:

  - You are about to drop the column `price` on the `Product` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `Product` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('IN_STOCK', 'OUT_OF_STOCK');

-- AlterTable
ALTER TABLE "Product" DROP COLUMN "price",
DROP COLUMN "quantity",
ADD COLUMN     "image" TEXT,
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'OUT_OF_STOCK';
