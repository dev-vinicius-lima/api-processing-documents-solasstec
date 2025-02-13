-- DropForeignKey
ALTER TABLE "HistoryTracking" DROP CONSTRAINT "HistoryTracking_documentId_fkey";

-- AddForeignKey
ALTER TABLE "HistoryTracking" ADD CONSTRAINT "HistoryTracking_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
