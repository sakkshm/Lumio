import express, { type Request, type Response } from "express"

import telegram from "./telegram/telegram"
import discord from "./discord/discord"

import dotenv from 'dotenv';
import { getModerationResponses } from "./ao/response";

dotenv.config();

const app = express();
const PORT = 3000;

//Launch bots
telegram.launch();
discord.login(process.env.DISCORD_BOT_TOKEN);

setInterval(getModerationResponses, 5000);


app.listen(PORT, () => {
    console.log("Server started at http://localhost:3000")
})