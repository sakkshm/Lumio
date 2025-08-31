import { Telegraf } from "telegraf";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { sendMessageforModeration } from "../ao/connect";

dotenv.config();
const prisma = new PrismaClient();
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = process.env.GROQ_API_URL;

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
    await prisma.telegramServer.upsert({
      where: { chatID: chatId },
      update: { 
        chatID: chatId,
        server: {
          connect: { serverID: serverID }
        }  
      },
      create: {
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
// Ask Command
// ===============================
bot.command("ask", async (ctx) => {
  const chatId = ctx.chat.id
  const userPrompt = ctx.message.text;

  if (!userPrompt) {
    return bot.telegram.sendMessage(chatId, "Please provide a question after /ask")
  }

  try {
    //Send typing action
    await ctx.telegram.sendChatAction(ctx.chat.id, "typing");

    const serverData = await prisma.server.findFirst({
      where: {
        telegramInfo: {
          chatID: String(chatId),
        },
      },
    })

    // Call Groq API
    const response = await fetch(GROQ_API_URL!, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            "content": "You are an AI assistant combining official documentation, community knowledge, and your own reasoning. Keep responses concise and plaintext only unless the user asks for detailed explanations.\n\nRules:\n- Be clear, concise, and technically accurate.\n- Act like a mentor; explain step-by-step only if asked.\n- Use community docs first; reason only if necessary.\n- Give examples or code snippets only if requested.\n- Never hallucinate APIs or facts.\n- Ask clarifying questions if the user query is ambiguous.\n\nResponse style:\n- Direct answer first, followed by optional context only if requested.\n- Keep all responses plaintext; no markdown or formatting unless user asks.\n\nGoal:\n- Provide clear, structured, and correct answers that help users solve problems while staying concise."
          },
          { role: "system", content: serverData?.personaPrompt || "" },
          { role: "system", content: serverData?.docsPrompt || "" },
          { role: "user", content: userPrompt },
        ],
      }),
    })

    if(!response.ok){
      throw new Error("Unable to generate response");
    }

    const data: any = await response.json()

    const replyText = data?.choices?.[0]?.message?.content || "No response generated."
    await ctx.reply(replyText, { parse_mode: "Markdown" })
  } catch (e) {
    console.error(e)
    await ctx.reply("Unable to generate a response!")
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
