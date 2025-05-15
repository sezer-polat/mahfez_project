/*
  Warnings:

  - Added the required column `numberOfPeople` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "numberOfPeople" INTEGER NOT NULL;
