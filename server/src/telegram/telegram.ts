import { Telegraf, Telegram } from "telegraf";
import { message } from "telegraf/filters";
import dotenv from 'dotenv';
import { sendMessageforModeration } from "../ao/connect";
import { PrismaClient } from "@prisma/client";

dotenv.config();

const prisma = new PrismaClient();

if(!process.env.TELEGRAM_BOT_TOKEN){
    throw new Error("TELEGRAM_BOT_TOKEN not found!")
}

const bot: Telegraf = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);


//Command to link server to Lumio server entity
bot.command('link', async (ctx) => {
  if (ctx.chat.type === 'private') {
    return ctx.reply('This command must be used in groups.');
  }

  const userIsAdmin = await isAdmin(ctx);
  if (!userIsAdmin) {
    return ctx.reply('❌ You must be an admin to use this command.');
  }

  const args = ctx.message.text.split(' ').slice(1);
  const code = args[0];
  if (!code) {
    return ctx.reply('Please provide a code. Usage: /link <code>');
  }

  const serverID = ctx.message.text.split(' ')[1];
  
  const userId = ctx.from.id;
  const chatId = ctx.chat.id;

  try{
    const response = await prisma.telegramServer.create({
      data: {
        serverID: serverID!,
        chatID: chatId.toString()
      }
    })

    await bot.telegram.sendMessage(chatId, "Your server is now linekd to Lumio!")
  }
  catch(e){
    await bot.telegram.sendMessage(chatId, "Unable to link server!")
  }
});

//Text Moderation
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

//Moderation result handler
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

//Utils

//Check is user is Admin of chat
async function isAdmin(ctx: any) {
  try {
    const member = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
    const status = member.status;
    return ['creator', 'administrator'].includes(status);
  } catch (err) {
    console.error('Error checking admin status:', err);
    return false;
  }
}

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

export default bot