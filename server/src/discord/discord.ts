import { Client, Events, GatewayIntentBits, PermissionsBitField } from "discord.js";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { sendMessageforModeration } from "../ao/connect.js";

dotenv.config();
const prisma = new PrismaClient();
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = process.env.GROQ_API_URL;

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

bot.once("ready", () => {
  if (!bot.user) {
    throw new Error("Discord bot cannot log in.");
  }
  console.log(`Discord Bot Logged in as ${bot.user.tag}`);
});

// Onboarding/Welcome message
bot.on(Events.GuildMemberAdd, async (member) => {
  try {
    // Look up onboarding message for this guild
    const response = await prisma.server.findFirst({
      where: {
        discordInfo: {
          guildID: String(member.guild.id),
        },
      },
    });

    if (!response || !response.onboardingMessage) {
      console.error("No onboarding message found for this server!");
      return;
    }

    // Send DM to the new member
    try {
      await member.send(response.onboardingMessage);
      console.log(`Sent onboarding DM to ${member.user.tag}`);
    } catch (err: any) {
      console.error(
        `Could not send DM to ${member.user.tag}:`,
        err.message || err
      );
    }
  } catch (e) {
    console.error("Error handling new member:", e);
  }
});

bot.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Only allow in servers
  if (!message.guild) return;

  prisma.discordServer.update({
    where: {
      guildID: message.guild.id
    },
    data: {
      messageCount: {
        increment: 1
      }
    }
  }).catch(err => {
    console.error("Failed to increment message count:", err);
  });

  // Command trigger
  if (message.content.startsWith("!link")) {
    const args = message.content.split(" ").slice(1);
    const code = args[0];

    if (!code) {
      return message.reply("Please provide a code. Usage: `!link <code>`");
    }

    // Check admin permissions
    const member = await message.guild.members.fetch(message.author.id);
    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return message.reply("You must be an admin to use this command.");
    }

    const serverID = code;
    const guildId = message.guild.id;

    try {
      await prisma.discordServer.upsert({
        where: { guildID: guildId },
        update: { 
          guildID: guildId,
          server: {
            connect: { serverID: serverID }
          }  
        },
        create: {
          guildID: guildId,
          server: {
            connect: { serverID: serverID },
          },
        },
      });

      await message.reply("Your server is now linked to Lumio!");
    } catch (e) {
      console.error(e);
      await message.reply("Unable to link server!");
    }
  }

  //Community chatbot
  if (message.content.startsWith("!ask")) {

    await message.channel.sendTyping();

    try {
      const serverData = await prisma.server.findFirst({
        where: {
           discordInfo: {
            guildID: message.guild.id
           }
        }
      })

      //Make grok call
      const response = await fetch( GROQ_API_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
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
          { role: "user", content: message.content || "" },
          ],
        }),
      });
      
      const data: any = await response.json();

      if(!response.ok){
        throw new Error("Unable to generate response");
      }
      
      const replyText = data?.choices?.[0]?.message?.content || "No response generated."
      await message.reply(replyText);
    } catch (e) {
      console.error(e);
      await message.reply("Unable to generate a response!");
    }

    return;
  }  

  //Moderate message

  //get serverid
  const resposne = await prisma.server.findFirst({
    where: {
      discordInfo: {
        is: {
          guildID: message.guild.id
        }
      }
    }
  })

  if(resposne){

    console.log("Sending message for moderation: " + message.content)

    sendMessageforModeration(
      resposne?.serverID,
      message.guild.id,
      message.author.id,
      message.id,
      message.content,
      "discord"
    );
  }
});

export async function handleDiscordMessageModerationResult(
  message: string,
  serverID: string,
  guildID: string,
  userId: string,
  chatMessageId: string,
  messageText: string
) {
  const messageElements = message.split("|");

  const decision = messageElements[0]?.trim();
  const reason = messageElements[1]?.trim();

  if (decision !== "allow") {
    try {
      const guild = await bot.guilds.fetch(guildID);
      const member = await guild.members.fetch(userId);

      const channel = await guild.channels.fetch(member.guild.systemChannelId || chatMessageId);

      if (channel?.isTextBased()) {
        const msg = await channel?.messages.fetch(chatMessageId); // fetch the message
        await msg.delete();
      }

      // Ban the user
      member.ban({ reason: reason || "Policy violation" })
      .then(() => {
        if (channel?.isTextBased())
        channel.send(
          `Banned: ${member.user.tag}\nReason: ${reason || "Policy violation"}`
        );
      })
      .catch(() => {
        if (channel?.isTextBased())
        channel.send(
          `Cannot ban Admin!`
        );
      });
      
    } catch (error) {
      console.error("Error banning user:", error);
    }
  }
}

async function getDiscordMemberCount(guildID: string) {
  const guild = bot.guilds.cache.get(guildID);
  if (!guild) return;

  const totalMembers = guild.memberCount;
  return totalMembers;
}

export {
  bot as discord,
  getDiscordMemberCount
}
