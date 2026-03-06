-- AlterTable
ALTER TABLE "News" ADD COLUMN     "images" TEXT[],
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "priority" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "News_priority_idx" ON "News"("priority");

-- CreateIndex
CREATE INDEX "News_published_isFeatured_idx" ON "News"("published", "isFeatured");

-- CreateIndex
CREATE INDEX "Project_priority_idx" ON "Project"("priority");

-- CreateIndex
CREATE INDEX "Project_isActive_idx" ON "Project"("isActive");
