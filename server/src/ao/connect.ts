import { readFileSync } from "node:fs";
import * as path from "path";
import { addModerationMessage } from "./moderationMessageMap";

const {
  result,
  results,
  message,
  spawn,
  monitor,
  unmonitor,
  dryrun,
  createDataItemSigner
} = require("@permaweb/aoconnect");

const walletPath = path.join(__dirname, "wallet.json");

const wallet = JSON.parse(
  readFileSync(walletPath).toString(),
);

const moderationProcessID = process.env.MODERATION_AO_PROCESS;


export async function sendMessageforModeration(serverID: string, chatId: string, userId: string, chatMessageId: string, messageText: string, platform: string){

    await message({
        process: moderationProcessID,
        tags: [
            { name: "Action", value: "Moderate" },
            { name: "Server", value: serverID },
        ],
        // A signer function used to build the message "signature"
        signer: createDataItemSigner(wallet),
        data: messageText
    })
    .then((messageId: string) => {
        addModerationMessage(
            messageId, 
            serverID, 
            chatId, 
            userId, 
            chatMessageId, 
            messageText,
            platform
        )
    })
    .catch(console.error);
}

export async function setModerationConfig(serverID: string, strictness: string, bannedWords: string){

    await message({
        process: moderationProcessID,
        tags: [
            { name: "Action", value: "SetConfig" },
            { name: "Server", value: serverID },
            { name: "Strictness", value: strictness.toString() },
            { name: "BannedWords", value: bannedWords },
        ],
        // A signer function used to build the message "signature"
        signer: createDataItemSigner(wallet),
        data: ""
    })
    .then((messageId: string) => {
        console.log("Config set:", messageId)
    })
    .catch(console.error);
}