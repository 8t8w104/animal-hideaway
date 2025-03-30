/*
  Warnings:

  - Added the required column `name` to the `Organization` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Organization" ADD COLUMN "name" TEXT;
UPDATE "public"."Organization" SET "name" = 'Default Organization' WHERE "name" IS NULL;
ALTER TABLE "public"."Organization" ALTER COLUMN "name" SET NOT NULL;
