/*
  Warnings:

  - Added the required column `slug` to the `LearningPath` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "LearningPath" ADD COLUMN     "slug" TEXT NOT NULL;
