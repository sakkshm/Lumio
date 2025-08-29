import { Telegraf } from "telegraf";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { sendMessageforModeration } from "../ao/connect";

dotenv.config();

const prisma = new PrismaClient();

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN not found!");
}

const bot: Telegraf = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// ===============================
// /link Command
// ===============================
bot.command("link", async (ctx) => {
  if (ctx.chat.type === "private") {
    return ctx.reply("This command must be used in groups.");
  }

  const userIsAdmin = await isAdmin(ctx);
  if (!userIsAdmin) {
    return ctx.reply("You must be an admin to use this command.");
  }

  const args = ctx.message.text.split(" ").slice(1);
  const code = args[0];
  if (!code) {
    return ctx.reply("Please provide a code. Usage: /link <code>");
  }

  const serverID = code;
  const chatId = ctx.chat.id.toString();

  try {
    // Check if server exists in parent table
    const server = await prisma.server.findUnique({
      where: { serverID: serverID },
    });

    if (!server) {
      return ctx.reply("Invalid code: No matching server found in Lumio.");
    }

    // Create TelegramServer and link to existing Server
    await prisma.telegramServer.create({
      data: {
        chatID: chatId,
        server: {
          connect: { serverID: serverID },
        },
      },
    });

    await ctx.reply("Your server is now linked to Lumio!");
  } catch (e) {
    console.error("Error linking server:", e);
    await ctx.reply("Unable to link server!");
  }
});

// ===============================
// Text Moderation
// ===============================
bot.on("text", async (ctx) => {
  console.log("Sending for moderation: " + ctx.message.text);

  //get serverid
  const resposne = await prisma.server.findFirst({
    where: {
      telegramInfo: {
        is: {
          chatID: ctx.chat.id.toString()
        }
      }
    }
  })

  if(resposne){
    sendMessageforModeration(
      resposne?.serverID,
      ctx.chat.id.toString(),
      ctx.from.id.toString(),
      ctx.message.message_id.toString(),
      ctx.message.text,
      "telegram"
    );
  }

});

// ===============================
// Moderation Result Handler
// ===============================
export async function handleTelegramMessageModerationResult(
  message: string,
  serverID: string,
  chatId: string,
  userId: string,
  chatMessageId: string,
  messageText: string
) {
  const messageElements = message.split("|");

  const decision = messageElements[0]?.trim();
  const reason = messageElements[1]?.trim();

  if (decision !== "allow") {
    const date = new Date();
    const currentTimestamp = Math.floor(date.getTime() / 1000);

    try {
      await bot.telegram.deleteMessage(
        chatId,
        parseInt(chatMessageId)
      )

      await bot.telegram.banChatMember(
        chatId,
        parseInt(userId),
        currentTimestamp + 100000
      ).then(async () => {
        const bannedUser = await bot.telegram.getChatMember(
          chatId,
          parseInt(userId)
        );

        await bot.telegram.sendMessage(
          chatId,
          "Banned: " +
            bannedUser.user.first_name +
            "\nReason: " +
            (reason || "Policy violation")
        );
      })
      .catch(() => {
        bot.telegram.sendMessage(chatId, "Cannot ban Admin!")
      });

    } catch (error) {
      console.error("Error banning user:", error);
    }
  }
}

// ===============================
// Utils
// ===============================
async function isAdmin(ctx: any) {
  try {
    const member = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
    const status = member.status;
    return ["creator", "administrator"].includes(status);
  } catch (err) {
    console.error("Error checking admin status:", err);
    return false;
  }
}

// ===============================
// Graceful stop
// ===============================
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

export default bot;
