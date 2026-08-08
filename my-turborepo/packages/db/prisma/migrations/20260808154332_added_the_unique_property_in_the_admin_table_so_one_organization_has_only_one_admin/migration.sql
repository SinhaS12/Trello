/*
  Warnings:

  - A unique constraint covering the columns `[organizationId]` on the table `admin` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "admin_organizationId_key" ON "admin"("organizationId");
