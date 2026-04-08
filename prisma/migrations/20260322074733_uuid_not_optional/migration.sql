/*
  Warnings:

  - Made the column `uuid` on table `Book` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uuid` on table `Category` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Book" ALTER COLUMN "uuid" SET NOT NULL;

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "bookCount" INTEGER NOT NULL DEFAULT 0,
ALTER COLUMN "uuid" SET NOT NULL;
