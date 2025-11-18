/*
  Warnings:

  - You are about to alter the column `radius` on the `Geofencing` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- DropIndex
DROP INDEX "public"."Geofencing_reminderId_key";

-- AlterTable
ALTER TABLE "public"."Geofencing" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "radius" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "photo" TEXT;
