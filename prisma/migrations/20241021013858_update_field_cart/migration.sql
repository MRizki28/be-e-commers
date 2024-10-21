/*
  Warnings:

  - You are about to drop the column `quantity` on the `Cart` table. All the data in the column will be lost.
  - Added the required column `qty` to the `Cart` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Cart" DROP COLUMN "quantity",
ADD COLUMN     "qty" INTEGER NOT NULL;
