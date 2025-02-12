/*
  Warnings:

  - You are about to drop the column `number` on the `Document` table. All the data in the column will be lost.
  - You are about to drop the column `registrationDate` on the `Document` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Document_number_key";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "number",
DROP COLUMN "registrationDate",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
