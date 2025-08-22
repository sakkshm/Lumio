import { Telegraf, Telegram } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from 'dotenv';
import { sendMessageforModeration } from "../ao/connect";

dotenv.config();

if(!process.env.TELEGRAM_BOT_TOKEN){
    throw new Error("TELEGRAM_BOT_TOKEN not found!")
}

const bot: Telegraf = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.on("text", async (ctx) => {
  //Send Message to Mod Agent
  console.log("Sending for moderation: " + ctx.message.text);
  sendMessageforModeration(
    "123", 
    ctx.chat.id.toString(), 
    ctx.from.id.toString(), 
    ctx.message.message_id.toString(), 
    ctx.message.text
  );

})

export async function handleMessageModerationResult(message: string,serverID: string, chatId: string, userId: string, chatMessageId: string, messageText: string) {
  const messageElements = message.split("|");

  const descision = messageElements[0]?.trim();
  const reason = messageElements[1]?.trim();

  if(descision != "allow"){

    const date = new Date();
    const currentTimestamp = Math.floor(date.getTime() / 1000);

    try{
      bot.telegram.banChatMember(chatId, parseInt(userId), currentTimestamp + 100000)
  
      const bannedUser = await bot.telegram.getChatMember(chatId, parseInt(userId))
  
      bot.telegram.sendMessage(chatId, "Banned: "  + bannedUser.user.first_name + " \nReason: " + reason);
    }
    catch(error){
      console.log(error);
    }

  }
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export default bot