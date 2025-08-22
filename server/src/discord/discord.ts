import { Client, GatewayIntentBits } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const bot = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

bot.once("ready", () => {
  if(!bot.user){
    throw new Error("Discord bot cannot log in.")
  }
});

bot.on("messageCreate", (message) => {
  if (message.author.bot) return;

  message.react("✅")

  if (message.content === "!ping") {
    message.reply("Pong from Discord bot!");
  }
});

export default bot;