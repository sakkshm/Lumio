/*
  Warnings:

  - A unique constraint covering the columns `[serverID,walletID]` on the table `Server` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Server_serverID_walletID_key" ON "public"."Server"("serverID", "walletID");
