import { readFileSync } from "node:fs";
import * as path from "path";
import { addModerationMessage } from "./moderationMessageMap.js";

const {
  message,
  createDataItemSigner
} = require("@permaweb/aoconnect");

// Load wallet.json from disk
const walletPath = path.join(__dirname, "wallet.json");
const wallet = JSON.parse(readFileSync(walletPath, "utf-8"));

const moderationProcessID = process.env.MODERATION_AO_PROCESS;

export async function sendMessageforModeration(
  serverID: string,
  chatId: string,
  userId: string,
  chatMessageId: string,
  messageText: string,
  platform: string
) {
  try {
    const messageId = await message({
      process: moderationProcessID,
      tags: [
        { name: "Action", value: "Moderate" },
        { name: "Server", value: serverID },
      ],
      signer: createDataItemSigner(wallet),
      data: messageText,
    });

    addModerationMessage(
      messageId,
      serverID,
      chatId,
      userId,
      chatMessageId,
      messageText,
      platform
    );
  } catch (err) {
    console.error("sendMessageforModeration error:", err);
  }
}

export async function setModerationConfig(
  serverID: string,
  strictness: string,
  bannedWords: string
) {
  try {
    const messageId = await message({
      process: moderationProcessID,
      tags: [
        { name: "Action", value: "SetConfig" },
        { name: "Server", value: serverID },
        { name: "Strictness", value: strictness.toString() },
        { name: "BannedWords", value: bannedWords },
      ],
      signer: createDataItemSigner(wallet),
      data: "",
    });

    console.log("Config set:", messageId);
  } catch (err) {
    console.error("setModerationConfig error:", err);
  }
}
