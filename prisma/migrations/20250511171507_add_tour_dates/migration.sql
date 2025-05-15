/*
  Warnings:

  - Added the required column `endDate` to the `Tour` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startDate` to the `Tour` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tour" ADD COLUMN "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Tour" ADD COLUMN "endDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Remove default values after adding the columns
ALTER TABLE "Tour" ALTER COLUMN "startDate" DROP DEFAULT;
ALTER TABLE "Tour" ALTER COLUMN "endDate" DROP DEFAULT;
