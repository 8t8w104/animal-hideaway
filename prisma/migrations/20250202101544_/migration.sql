/*
  Warnings:

  - Added the required column `userId` to the `IndividualAnimal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `OrganizationAnimal` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "IndividualAnimal" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "OrganizationAnimal" ADD COLUMN     "userId" TEXT NOT NULL;
