-- DropForeignKey
ALTER TABLE "public"."OrganizationAnimal" DROP CONSTRAINT "OrganizationAnimal_animalId_fkey";

-- DropForeignKey
ALTER TABLE "public"."OrganizationAnimal" DROP CONSTRAINT "OrganizationAnimal_organizationId_fkey";

-- AddForeignKey
ALTER TABLE "public"."OrganizationAnimal" ADD CONSTRAINT "OrganizationAnimal_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationAnimal" ADD CONSTRAINT "OrganizationAnimal_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "public"."Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
