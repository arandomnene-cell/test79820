/*
  Warnings:

  - A unique constraint covering the columns `[title]` on the table `LearningPath` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `LearningPath` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "LearningPath" ADD COLUMN     "thumbnailUrl" TEXT NOT NULL DEFAULT '/thumbnail.jpeg';

-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_title_key" ON "LearningPath"("title");

-- CreateIndex
CREATE UNIQUE INDEX "LearningPath_slug_key" ON "LearningPath"("slug");
