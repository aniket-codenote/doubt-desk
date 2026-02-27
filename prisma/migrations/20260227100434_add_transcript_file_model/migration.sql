-- AlterTable
ALTER TABLE "TranscriptChunk" ADD COLUMN     "transcriptFileId" TEXT;

-- CreateTable
CREATE TABLE "TranscriptFile" (
    "id" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'processing',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TranscriptFile_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TranscriptFile_courseId_idx" ON "TranscriptFile"("courseId");

-- CreateIndex
CREATE INDEX "TranscriptChunk_transcriptFileId_idx" ON "TranscriptChunk"("transcriptFileId");

-- AddForeignKey
ALTER TABLE "TranscriptFile" ADD CONSTRAINT "TranscriptFile_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TranscriptChunk" ADD CONSTRAINT "TranscriptChunk_transcriptFileId_fkey" FOREIGN KEY ("transcriptFileId") REFERENCES "TranscriptFile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
