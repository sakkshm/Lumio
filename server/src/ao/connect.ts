// ================================
// bun-node-ao.ts
// ================================

import 'dotenv/config'; // Loads .env variables
import { readFileSync } from "node:fs";
import * as path from "path";
import { fileURLToPath } from "url";
import { addModerationMessage } from "./moderationMessageMap.js";
import { message, result, createDataItemSigner } from "@permaweb/aoconnect";

// --- Path setup ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Wallet setup ---
const walletPath = path.join(__dirname, "wallet.json");
const wallet = JSON.parse(readFileSync(walletPath, "utf-8"));

// --- AO Processes from .env ---
const moderationProcessID = process.env.MODERATION_AO_PROCESS;
const logProcessID = process.env.LOGS_AO_PROCESS;

if (!moderationProcessID || !logProcessID) {
  throw new Error("Process IDs not found in env! Make sure .env has MODERATION_AO_PROCESS and LOGS_AO_PROCESS");
}

// --- Helpers ---
function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

// ================================
// Moderation functions
// ================================

/**
 * Send a message to moderation process
 */
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
      process: moderationProcessID!,
      tags: [
        { name: "Action", value: "Moderate" },
        { name: "Server", value: serverID },
      ],
      signer: createDataItemSigner(wallet),
      data: messageText,
    });

    // Track moderation request
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

/**
 * Configure moderation strictness + banned words
 */
export async function setModerationConfig(
  serverID: string,
  strictness: string,
  bannedWords: string
) {
  try {
    const messageId = await message({
      process: moderationProcessID!,
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

// ================================
// Logging functions
// ================================

/**
 * Store a log in AO
 */
export async function storeLog(
  serverID: string,
  logType: string,
  logData: string,
  processID: string = logProcessID!
) {
  try {
    const messageId = await message({
      process: processID,
      tags: [
        { name: "Action", value: "StoreLog" },
        { name: "Server", value: serverID },
        { name: "LogType", value: logType },
      ],
      signer: createDataItemSigner(wallet),
      data: logData,
    });

    console.log("Log stored:", messageId);
    return messageId;
  } catch (err) {
    console.error("storeLog error:", err);
    throw err;
  }
}

/**
 * Retrieve logs for a server with pagination
 * Waits for AO result (up to timeoutMs).
 */
export async function getLogs(
  serverID: string,
  limit: number = 10,
  offset: number = 0,
  processID: string = logProcessID!,
  timeoutMs: number = 30_000
) {
  try {
    // Step 1: Send query
    const queryMsgId = await message({
      process: processID,
      tags: [
        { name: "Action", value: "GetLogs" },
        { name: "Server", value: serverID },
        { name: "Limit", value: limit.toString() },
        { name: "Offset", value: offset.toString() },
      ],
      signer: createDataItemSigner(wallet),
      data: "",
    });
    
    // Step 2: Race AO result vs timeout
    const res = await Promise.race([
      result({ message: queryMsgId, process: processID }),
      (async () => {
        await sleep(timeoutMs);
        throw new Error("Timeout waiting for AO result");
      })(),
    ]);

    if (res?.Error) {
      console.error("AO error:", res.Error);
      throw new Error(res.Error);
    }

    if (res?.Messages && res.Messages.length > 0) {
      try {
        return JSON.parse(res.Messages[0].Data);
      } catch {
        return [res.Messages[0].Data];
      }
    }

    if (res?.Output) {
      try {
        return JSON.parse(res.Output);
      } catch {
        return [res.Output];
      }
    }

    return [];
  } catch (err) {
    console.error("getLogs error:", err);
    return [];
  }
}
