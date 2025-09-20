import { Telegraf } from "telegraf";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { sendMessageforModeration } from "../ao/connect.js";

dotenv.config();
const prisma = new PrismaClient();
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = process.env.GROQ_API_URL;

if (!process.env.TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN not found!");
}

const bot: Telegraf = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// ===============================
// Utility: Escape MarkdownV2
// ===============================
function escapeMarkdownV2(text: string) {
  return text.replace(/[_*[\]()~`>#+-=|{}.!]/g, "\\$&");
}

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
    const server = await prisma.server.findUnique({ where: { serverID } });
    if (!server) return ctx.reply("Invalid code: No matching server found.");

    await prisma.telegramServer.upsert({
      where: { chatID: chatId },
      update: { chatID: chatId, server: { connect: { serverID } } },
      create: { chatID: chatId, server: { connect: { serverID } } },
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
  const chatId = ctx.chat.id;
  const userPrompt = ctx.message.text.split(" ").slice(1).join(" ");

  if (!userPrompt) {
    return bot.telegram.sendMessage(chatId, "Please provide a question after /ask");
  }

  try {
    await ctx.telegram.sendChatAction(chatId, "typing");

    const serverData = await prisma.server.findFirst({
      where: { telegramInfo: { chatID: String(chatId) } },
    });

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
            content: "You are an AI assistant combining official documentation, community knowledge, and your own reasoning. Keep responses concise and plaintext only unless the user asks for detailed explanations.\n\nRules:\n- Be clear, concise, and technically accurate.\n- Act like a mentor; explain step-by-step only if asked.\n- Use community docs first; reason only if necessary.\n- Give examples or code snippets only if requested.\n- Never hallucinate APIs or facts.\n- Ask clarifying questions if the user query is ambiguous.\n\nResponse style:\n- Direct answer first, followed by optional context only if requested.\n- Keep all responses plaintext; no markdown or formatting unless user asks.\n\nGoal:\n- Provide clear, structured, and correct answers that help users solve problems while staying concise."
          },
          { role: "system", content: serverData?.personaPrompt || "" },
          { role: "system", content: serverData?.docsPrompt || "" },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) throw new Error("Unable to generate response");

    const data: any = await response.json();
    const replyText = data?.choices?.[0]?.message?.content || "No response generated.";
    await ctx.reply(replyText, { parse_mode: "Markdown" });
  } catch (e) {
    console.error(e);
    await ctx.reply("Unable to generate a response!");
  }
});

// ===============================
// Text Moderation
// ===============================
bot.on("text", async (ctx) => {
  prisma.telegramServer.update({
    where: { chatID: ctx.chat.id.toString() },
    data: { messageCount: { increment: 1 } }
  }).catch(console.error);

  const serverData = await prisma.server.findFirst({
    where: { telegramInfo: { is: { chatID: ctx.chat.id.toString() } } },
  });

  if (serverData) {
    sendMessageforModeration(
      serverData.serverID,
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
  const [decision, reason] = message.split("|").map(s => s.trim());

  if (decision !== "allow") {
    const currentTimestamp = Math.floor(Date.now() / 1000);

    try {
      await bot.telegram.deleteMessage(chatId, parseInt(chatMessageId));
      await bot.telegram.banChatMember(chatId, parseInt(userId), currentTimestamp + 100000);

      const bannedUser = await bot.telegram.getChatMember(chatId, parseInt(userId));
      await bot.telegram.sendMessage(
        chatId,
        `Banned: ${bannedUser.user.first_name}\nReason: ${reason || "Policy violation"}`
      );
    } catch (error) {
      console.error("Error banning user:", error);
      await bot.telegram.sendMessage(chatId, "Cannot ban Admin!");
    }
  }
}

// ===============================
// Launch Poll
// ===============================
export async function launchTelegramPoll(
  chatId: number | string,
  question: string,
  options: string[]
) {
  try {
    return await bot.telegram.sendPoll(String(chatId), question, options, {
      is_anonymous: false,
      allows_multiple_answers: false,
    });
  } catch (error) {
    console.error("Failed to launch poll:", error);
    throw error;
  }
}

// ===============================
// Onboarding/Welcome Message
// ===============================
bot.on("new_chat_members", async (ctx) => {
  try {
    const chatId = ctx.chat.id.toString();
    const serverData = await prisma.server.findFirst({
      where: { telegramInfo: { is: { chatID: chatId } } },
    });

    if (!serverData || !serverData.onboardingMessage) return;

    for (const member of ctx.message.new_chat_members) {
      const welcomeText = escapeMarkdownV2(
        serverData.onboardingMessage.replace("{user}", member.first_name)
      );

      await bot.telegram.sendMessage(chatId, welcomeText, {
        parse_mode: "MarkdownV2",
      });
    }
  } catch (err) {
    console.error("Failed to send onboarding message:", err);
  }
});

// ===============================
// Utils
// ===============================
async function isAdmin(ctx: any) {
  try {
    const member = await ctx.telegram.getChatMember(ctx.chat.id, ctx.from.id);
    return ["creator", "administrator"].includes(member.status);
  } catch (err) {
    console.error("Error checking admin status:", err);
    return false;
  }
}

export async function launchTelegramAnnouncement(chatID: number, message: string) {
  await bot.telegram.sendMessage(chatID, escapeMarkdownV2(message), { parse_mode: "MarkdownV2" });
}

async function getTelegramMemberCount(chatId: number) {
  try {
    return await bot.telegram.getChatMembersCount(chatId);
  } catch (e) {
    console.error("Unable to get member count!", e);
    return 0;
  }
}

// ===============================
// Graceful stop
// ===============================
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));

export {
  bot as telegram,
  getTelegramMemberCount
};
