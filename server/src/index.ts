import express, { type Request, type Response } from "express"
import cors from "cors";

import { telegram } from "./telegram/telegram"
import { discord } from "./discord/discord"

import dotenv from 'dotenv';
import { getModerationResponses } from "./ao/response";
import serveRouter from "./server/route";

dotenv.config();

const app = express();
// Convert PORT to number - process.env.PORT is always a string
const PORT: number = parseInt(process.env.PORT || "3000", 10);

//Launch bots
telegram.launch();
discord.login(process.env.DISCORD_BOT_TOKEN);

setInterval(getModerationResponses, 5000);

app.use(express.json());
app.use(cors());

app.use("/server", serveRouter);
app.get("/", (req: Request, res: Response) => {
    res.send("Server running....")
})

// Important: Listen on 0.0.0.0 for Railway
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server started at http://0.0.0.0:${PORT}`)
})
