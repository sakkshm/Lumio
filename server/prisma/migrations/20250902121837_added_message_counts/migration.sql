-- DropIndex
DROP INDEX "public"."Server_serverID_walletID_key";

-- AlterTable
ALTER TABLE "public"."DiscordServer" ADD COLUMN     "messageCount" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "public"."TelegramServer" ADD COLUMN     "messageCount" INTEGER NOT NULL DEFAULT 0;
