-- CreateTable
CREATE TABLE "public"."Server" (
    "serverID" TEXT NOT NULL,
    "walletID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("serverID")
);

-- CreateTable
CREATE TABLE "public"."DiscordServer" (
    "id" SERIAL NOT NULL,
    "serverID" TEXT NOT NULL,
    "guildID" TEXT NOT NULL,
    "prefix" TEXT,
    "otherInfo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DiscordServer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TelegramServer" (
    "id" SERIAL NOT NULL,
    "serverID" TEXT NOT NULL,
    "chatID" TEXT NOT NULL,
    "otherInfo" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TelegramServer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DiscordServer_serverID_key" ON "public"."DiscordServer"("serverID");

-- CreateIndex
CREATE UNIQUE INDEX "DiscordServer_guildID_key" ON "public"."DiscordServer"("guildID");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramServer_serverID_key" ON "public"."TelegramServer"("serverID");

-- CreateIndex
CREATE UNIQUE INDEX "TelegramServer_chatID_key" ON "public"."TelegramServer"("chatID");

-- AddForeignKey
ALTER TABLE "public"."DiscordServer" ADD CONSTRAINT "DiscordServer_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "public"."Server"("serverID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."TelegramServer" ADD CONSTRAINT "TelegramServer_serverID_fkey" FOREIGN KEY ("serverID") REFERENCES "public"."Server"("serverID") ON DELETE RESTRICT ON UPDATE CASCADE;
