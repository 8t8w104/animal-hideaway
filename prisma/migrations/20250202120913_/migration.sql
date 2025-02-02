/*
  Warnings:

  - You are about to drop the column `createdBy` on the `Image` table. All the data in the column will be lost.
  - You are about to drop the column `updatedBy` on the `Image` table. All the data in the column will be lost.
  - Made the column `path` on table `Image` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Image" DROP COLUMN "createdBy",
DROP COLUMN "updatedBy",
ALTER COLUMN "path" SET NOT NULL;
