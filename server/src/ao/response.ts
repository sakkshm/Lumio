import { result } from "@permaweb/aoconnect";
import { moderationMessageMap, removeModerationMessage } from "./moderationMessageMap.js";
import { handleTelegramMessageModerationResult } from "../telegram/telegram.js";
import { handleDiscordMessageModerationResult } from "../discord/discord.js";

const responsePromises = new Map();

export function getModerationResponses(){

    if(moderationMessageMap.size == 0){
        return;
    }

    console.log("Running through response queue.")

    const map = moderationMessageMap;
    const moderationProcessID = process.env.MODERATION_AO_PROCESS!;

    map.forEach(async (value: any, key: any) => {
        try{
            if(!responsePromises.has(key)){
                console.log("Adding responseHandler for: " + key);

                let responsePromise = result({
                    // the arweave TxID of the message
                    message: key,
                    // the arweave TxID of the process
                    process: moderationProcessID,
                }).then(({ Messages, Spawns, Output, Error }) => {
                    if(Messages != undefined){
                        //@ts-ignore
                        console.log(Messages[0].Data);
                        const response = Messages[0].Data;

                        if(value.platform == 'telegram'){
                            handleTelegramMessageModerationResult(
                                response, 
                                value.serverID, 
                                value.chatId, 
                                value.userId, 
                                value.chatMessageId, 
                                value.messageText
                            );
                        }
                        if(value.platform == 'discord'){
                            handleDiscordMessageModerationResult(
                                response, 
                                value.serverID, 
                                value.chatId, 
                                value.userId, 
                                value.chatMessageId, 
                                value.messageText
                            );
                        }                    

                        responsePromises.delete(key);
                        removeModerationMessage(key);
                    }
    
                    if(Error){
                        console.log(Error)
                    }
                });
    
                responsePromises.set(key, { responsePromise, value });
            }

        }
        catch{
            console.log("Unable to get responses for: " + key);
        }
    })

}

