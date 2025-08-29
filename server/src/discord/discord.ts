import { Client, GatewayIntentBits, PermissionsBitField } from "discord.js";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { sendMessageforModeration } from "../ao/connect";

dotenv.config();
const prisma = new PrismaClient();

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
  console.log(`Logged in as ${bot.user.tag}`);
});

bot.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  // Only allow in servers
  if (!message.guild) return;

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
      await prisma.discordServer.create({
        data: {
          serverID: serverID,
          guildID: guildId,
        },
      });

      await message.reply("Your server is now linked to Lumio!");
    } catch (e) {
      console.error(e);
      await message.reply("Unable to link server!");
    }
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


export default bot;
