-- CreateEnum
CREATE TYPE "public"."Gender" AS ENUM ('オス', 'メス', '不明');

-- CreateEnum
CREATE TYPE "public"."ApplicationStatus" AS ENUM ('募集中', '審査中', '決定');

-- CreateEnum
CREATE TYPE "public"."PublicStatus" AS ENUM ('下書き', '公開', '非公開');

-- CreateEnum
CREATE TYPE "public"."MessageCategory" AS ENUM ('問合せ', '回答');

-- CreateTable
CREATE TABLE "public"."Animal" (
    "id" SERIAL NOT NULL,
    "animalTypeId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "gender" "public"."Gender",
    "age" INTEGER,
    "description" TEXT,
    "applicationStatus" "public"."ApplicationStatus" NOT NULL,
    "publicStatus" "public"."PublicStatus" NOT NULL,

    CONSTRAINT "Animal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AnimalType" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,

    CONSTRAINT "AnimalType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Individual" (
    "id" SERIAL NOT NULL,
    "individualId" UUID NOT NULL,

    CONSTRAINT "Individual_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Organization" (
    "id" SERIAL NOT NULL,
    "organizationId" UUID NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InquiryMeta" (
    "id" SERIAL NOT NULL,
    "animalId" INTEGER NOT NULL,
    "individualId" UUID NOT NULL,
    "organizationId" UUID NOT NULL,

    CONSTRAINT "InquiryMeta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InquiryContent" (
    "id" SERIAL NOT NULL,
    "metaId" INTEGER NOT NULL,
    "messageCategory" "public"."MessageCategory" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InquiryContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."IndividualAnimal" (
    "id" SERIAL NOT NULL,
    "individualId" UUID NOT NULL,
    "animalId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "IndividualAnimal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."OrganizationAnimal" (
    "id" SERIAL NOT NULL,
    "organizationId" UUID NOT NULL,
    "animalId" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "OrganizationAnimal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Image" (
    "id" SERIAL NOT NULL,
    "parentId" INTEGER NOT NULL,
    "imageUrl" TEXT,
    "fileName" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "contentType" TEXT,
    "publicFlag" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AdoptionApplication" (
    "id" SERIAL NOT NULL,
    "animalId" INTEGER NOT NULL,
    "individualId" UUID NOT NULL,
    "applicationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdBy" UUID NOT NULL,
    "updatedBy" UUID NOT NULL,

    CONSTRAINT "AdoptionApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AnimalType_type_key" ON "public"."AnimalType"("type");

-- CreateIndex
CREATE UNIQUE INDEX "Individual_individualId_key" ON "public"."Individual"("individualId");

-- CreateIndex
CREATE UNIQUE INDEX "Organization_organizationId_key" ON "public"."Organization"("organizationId");

-- CreateIndex
CREATE UNIQUE INDEX "AdoptionApplication_animalId_individualId_key" ON "public"."AdoptionApplication"("animalId", "individualId");

-- AddForeignKey
ALTER TABLE "public"."Animal" ADD CONSTRAINT "Animal_animalTypeId_fkey" FOREIGN KEY ("animalTypeId") REFERENCES "public"."AnimalType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InquiryMeta" ADD CONSTRAINT "InquiryMeta_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "public"."Animal"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InquiryMeta" ADD CONSTRAINT "InquiryMeta_individualId_fkey" FOREIGN KEY ("individualId") REFERENCES "public"."Individual"("individualId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InquiryMeta" ADD CONSTRAINT "InquiryMeta_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InquiryContent" ADD CONSTRAINT "InquiryContent_metaId_fkey" FOREIGN KEY ("metaId") REFERENCES "public"."InquiryMeta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IndividualAnimal" ADD CONSTRAINT "IndividualAnimal_individualId_fkey" FOREIGN KEY ("individualId") REFERENCES "public"."Individual"("individualId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."IndividualAnimal" ADD CONSTRAINT "IndividualAnimal_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "public"."Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationAnimal" ADD CONSTRAINT "OrganizationAnimal_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "public"."Organization"("organizationId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."OrganizationAnimal" ADD CONSTRAINT "OrganizationAnimal_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "public"."Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Image" ADD CONSTRAINT "Image_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdoptionApplication" ADD CONSTRAINT "AdoptionApplication_animalId_fkey" FOREIGN KEY ("animalId") REFERENCES "public"."Animal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdoptionApplication" ADD CONSTRAINT "AdoptionApplication_individualId_fkey" FOREIGN KEY ("individualId") REFERENCES "public"."Individual"("individualId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdoptionApplication" ADD CONSTRAINT "AdoptionApplication_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "public"."Individual"("individualId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."AdoptionApplication" ADD CONSTRAINT "AdoptionApplication_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "public"."Individual"("individualId") ON DELETE RESTRICT ON UPDATE CASCADE;
