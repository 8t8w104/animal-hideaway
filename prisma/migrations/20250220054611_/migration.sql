/*
  Warnings:

  - You are about to drop the column `userId` on the `IndividualAnimal` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `OrganizationAnimal` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[animalId,individualId]` on the table `IndividualAnimal` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[animalId,organizationId]` on the table `OrganizationAnimal` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."IndividualAnimal" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "public"."OrganizationAnimal" DROP COLUMN "userId";

-- CreateIndex
CREATE UNIQUE INDEX "IndividualAnimal_animalId_individualId_key" ON "public"."IndividualAnimal"("animalId", "individualId");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizationAnimal_animalId_organizationId_key" ON "public"."OrganizationAnimal"("animalId", "organizationId");
