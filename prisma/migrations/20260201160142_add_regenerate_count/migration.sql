/*
  Warnings:

  - Added the required column `updatedAt` to the `DailySummary` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `dailysummary` ADD COLUMN `regenerateCount` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE INDEX `DailySummary_date_idx` ON `DailySummary`(`date`);
