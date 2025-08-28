/*
  Warnings:

  - A unique constraint covering the columns `[userId,query]` on the table `SearchLog` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "SearchLog_userId_query_key" ON "public"."SearchLog"("userId", "query");
