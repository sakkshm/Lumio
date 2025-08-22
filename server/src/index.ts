import express, { type Request, type Response } from "express"
import cors from "cors";

import telegram from "./telegram/telegram"
import discord from "./discord/discord"

import dotenv from 'dotenv';
import { getModerationResponses } from "./ao/response";
import serveRouter from "./server/route";

dotenv.config();

const app = express();
const PORT = 3000;

//Launch bots
telegram.launch();
discord.login(process.env.DISCORD_BOT_TOKEN);

setInterval(getModerationResponses, 5000);

app.use(express.json());
app.use(cors());

app.use("/server", serveRouter);

app.listen(PORT, () => {
    console.log("Server started at http://localhost:3000")
})