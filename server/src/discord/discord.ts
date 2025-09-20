import {
  ChannelType,
  Client,
  Events,
  GatewayIntentBits,
  PermissionsBitField,
  REST,
  Routes,
  SlashCommandBuilder,
  TextChannel,
} from "discord.js";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { sendMessageforModeration } from "../ao/connect.js";

dotenv.config();
const prisma = new PrismaClient();
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = process.env.GROQ_API_URL;
const DISCORD_TOKEN = process.env.DISCORD_BOT_TOKEN!;
const CLIENT_ID = process.env.DISCORD_CLIENT_ID!;

const bot = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// ===============================
// Slash Commands Registration
// ===============================
const commands = [
  new SlashCommandBuilder()
    .setName("link")
    .setDescription("Link this Discord server with Lumio")
    .addStringOption(option =>
      option.setName("code")
        .setDescription("The link code")
        .setRequired(true)
    ),
  new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Ask the Lumio AI Assistant")
    .addStringOption(option =>
      option.setName("question")
        .setDescription("Your question for the AI assistant")
        .setRequired(true)
    ),
].map(cmd => cmd.toJSON());

const rest = new REST({ version: "10" }).setToken(DISCORD_TOKEN);

async function registerCommands() {
  try {
    console.log("Registering application commands...");
    await rest.put(Routes.applicationCommands(CLIENT_ID), { body: commands });
    console.log("Discord commands registered globally");
  } catch (error) {
    console.error("Error registering commands:", error);
  }
}

// ===============================
// Utility: Escape Markdown
// ===============================
function escapeMarkdown(text: string) {
  return text.replace(/([*_`~])/g, "\\$1");
}

// ===============================
// On Ready
// ===============================
bot.once("ready", async () => {
  if (!bot.user) throw new Error("Discord bot cannot log in.");
  console.log(`Discord Bot Logged in as ${bot.user.tag}`);
  await registerCommands();
});

// ===============================
// Onboarding/Welcome Message
// ===============================
bot.on(Events.GuildMemberAdd, async (member) => {
  try {
    const serverData = await prisma.server.findFirst({
      where: { discordInfo: { guildID: String(member.guild.id) } },
    });

    if (!serverData?.onboardingMessage) return;

    const welcomeMessage = serverData.onboardingMessage.replace("{user}", `${member.displayName}`);

    try {
      await member.send(escapeMarkdown(welcomeMessage));
      console.log(`Sent onboarding DM to ${member.user.tag}`);
    } catch (err: any) {
      console.error(`Could not send DM to ${member.user.tag}:`, err.message || err);
    }
  } catch (e) {
    console.error("Error handling new member:", e);
  }
});

// ===============================
// Slash Command Handling
// ===============================
bot.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  // /link
  if (interaction.commandName === "link") {
    const code = interaction.options.getString("code", true);
    const member = await interaction.guild!.members.fetch(interaction.user.id);

    if (!member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      return interaction.reply({ content: "You must be an admin to use this command.", ephemeral: true });
    }

    try {
      await prisma.discordServer.upsert({
        where: { guildID: interaction.guildId! },
        update: { guildID: interaction.guildId!, server: { connect: { serverID: code } } },
        create: { guildID: interaction.guildId!, server: { connect: { serverID: code } } },
      });
      await interaction.reply("Your server is now linked to Lumio!");
    } catch (e) {
      console.error(e);
      await interaction.reply("Unable to link server!");
    }
  }

  // /ask
  if (interaction.commandName === "ask") {
    const question = interaction.options.getString("question", true);
    await interaction.deferReply();

    try {
      const serverData = await prisma.server.findFirst({
        where: { discordInfo: { guildID: interaction.guildId! } },
      });

      const response = await fetch(GROQ_API_URL!, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: "You are an AI assistant combining official documentation, community knowledge, and your own reasoning. Keep responses concise and plaintext only unless the user asks for detailed explanations.\n\nRules:\n- Be clear, concise, and technically accurate.\n- Act like a mentor; explain step-by-step only if asked.\n- Use community docs first; reason only if necessary.\n- Give examples or code snippets only if requested.\n- Never hallucinate APIs or facts.\n- Ask clarifying questions if the user query is ambiguous.\n\nResponse style:\n- Direct answer first, followed by optional context only if requested.\n- Keep all responses plaintext; no markdown or formatting unless user asks.\n\nGoal:\n- Provide clear, structured, and correct answers that help users solve problems while staying concise." },
            { role: "system", content: serverData?.personaPrompt || "" },
            { role: "system", content: serverData?.docsPrompt || "" },
            { role: "user", content: question },
          ],
        }),
      });

      if (!response.ok) throw new Error("Unable to generate response");
      const data: any = await response.json();
      const replyText = data?.choices?.[0]?.message?.content || "No response generated.";

      await interaction.editReply(replyText);
    } catch (e) {
      console.error(e);
      await interaction.editReply("Unable to generate a response!");
    }
  }
});

// ===============================
// Message Moderation Relay
// ===============================
bot.on("messageCreate", async (message) => {
  if (message.author.bot || !message.guild) return;

  prisma.discordServer.update({
    where: { guildID: message.guild.id },
    data: { messageCount: { increment: 1 } },
  }).catch(console.error);

  const serverData = await prisma.server.findFirst({
    where: { discordInfo: { is: { guildID: message.guild.id } } },
  });

  if (serverData) {
    sendMessageforModeration(
      serverData.serverID,
      message.guild.id,
      message.author.id,
      message.id,
      message.content,
      "discord"
    );
  }
});

// ===============================
// Poll Command (exported function)
// ===============================
export async function launchDiscordPoll(
  guildId: string,
  question: string,
  options: string[]
) {
  try {
    const guild = await bot.guilds.fetch(guildId);
    await guild.channels.fetch();

    let general: TextChannel | undefined =
      guild.channels.cache.find(
        ch => ch.type === ChannelType.GuildText && ch.name.toLowerCase() === "general"
      ) as TextChannel;

    if (!general) general = guild.systemChannel as TextChannel;
    if (!general) {
      general = guild.channels.cache.find(
        ch =>
          ch.type === ChannelType.GuildText &&
          (ch as TextChannel).permissionsFor(guild.members.me!)?.has("SendMessages")
      ) as TextChannel;
    }

    if (!general) throw new Error("No suitable text channel found");

    const numberEmojis = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
    if (options.length > numberEmojis.length) throw new Error("Too many options! Max supported = 10");

    const pollText =
      `📊 **${question}**\n\n` +
      options.map((opt, idx) => `${numberEmojis[idx]} ${opt}`).join("\n") +
      `\n\nReact below to vote!`;

    const pollMessage = await general.send(pollText);
    await Promise.allSettled(options.map((_, i) => pollMessage.react(numberEmojis[i]!)));

    return pollMessage;
  } catch (error) {
    console.error("Failed to launch poll on Discord:", error);
    throw error;
  }
}

// ===============================
// Moderation Result
// ===============================
export async function handleDiscordMessageModerationResult(
  message: string,
  serverID: string,
  guildID: string,
  userId: string,
  chatMessageId: string,
  messageText: string
) {
  const [decision, reason] = message.split("|").map(s => s.trim());

  if (decision !== "allow") {
    try {
      const guild = await bot.guilds.fetch(guildID);
      const member = await guild.members.fetch(userId);
      const channel = await guild.channels.fetch(member.guild.systemChannelId || chatMessageId);

      if (channel?.isTextBased()) {
        const msg = await channel?.messages.fetch(chatMessageId);
        await msg.delete();
      }

      member.ban({ reason: reason || "Policy violation" })
        .then(() => {
          if (channel?.isTextBased())
            channel.send(`Banned: ${member.user.tag}\nReason: ${reason || "Policy violation"}`);
        })
        .catch(() => {
          if (channel?.isTextBased()) channel.send(`Cannot ban Admin!`);
        });
    } catch (error) {
      console.error("Error banning user:", error);
    }
  }
}

// ===============================
// Announcements
// ===============================
export async function launchDiscordAnnouncement(guildID: string, message: string) {
  const guild = await bot.guilds.fetch(guildID);
  if (!guild) throw new Error("Guild not found");

  const channels = await guild.channels.fetch();
  const textChannel = channels.find(
    (ch: any): ch is TextChannel => ch?.type === ChannelType.GuildText
  );

  if (!textChannel) throw new Error("No text channel found in the guild");

  await textChannel.send(message);
}

// ===============================
// Utils
// ===============================
async function getDiscordMemberCount(guildID: string) {
  const guild = bot.guilds.cache.get(guildID);
  if (!guild) return;
  return guild.memberCount;
}

export {
  bot as discord,
  getDiscordMemberCount
};

// ===============================
// Login
// ===============================
bot.login(DISCORD_TOKEN);
