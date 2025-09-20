import express, { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";
import { getLogs, setModerationConfig, storeLog } from "../ao/connect.js";
import {
  getDiscordMemberCount,
  launchDiscordAnnouncement,
  launchDiscordPoll,
} from "../discord/discord.js";
import {
  getTelegramMemberCount,
  launchTelegramAnnouncement,
  launchTelegramPoll,
} from "../telegram/telegram.js";

const router = express.Router();
const prisma = new PrismaClient();

// --- ADD SERVER ---
router.post("/add-server", async (req: Request, res: Response) => {
  const { serverID, walletID, name, description } = req.body;

  try {
    const response = await prisma.server.create({
      data: { serverID, walletID, name, description },
    });

    await storeLog(serverID, "CREATE", `Server created: ${name}`);

    res.status(200).json(response);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Unable to add server." });
  }
});

// --- GET SERVERS ---
router.post("/get-servers", async (req: Request, res: Response) => {
  const walletID = req.body.walletID;

  if (!walletID) {
    res.status(500).json({ msg: "No wallet ID." });
    return;
  }

  try {
    const response = await prisma.server.findMany({
      where: { walletID: walletID as string },
    });

    res.status(200).json(response);
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Unable to find server." });
  }
});

// --- SET MODERATION CONFIG ---
router.post("/set-moderation-config", async (req: Request, res: Response) => {
  const { serverID, walletID, strictnessLevel, bannedWords } = req.body;

  try {
    await prisma.server.update({
      where: { serverID, walletID },
      data: { strictnessLevel, bannedWords },
    });

    setModerationConfig(serverID, strictnessLevel, bannedWords);

    await storeLog(
      serverID,
      "CHANGE",
      `Changed moderation config → strictnessLevel: ${strictnessLevel}, bannedWords: ${bannedWords}`
    );

    res.status(200).json({ msg: "Config set for: " + serverID });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Unable to set config for: " + serverID });
  }
});

// --- GET MODERATION CONFIG ---
router.post("/get-moderation-config", async (req: Request, res: Response) => {
  const { serverID, walletID } = req.body;

  try {
    const response = await prisma.server.findFirst({
      where: { serverID, walletID },
    });

    res.status(200).json({
      strictnessLevel: response?.strictnessLevel,
      bannedWords: response?.bannedWords,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Unable to get config for: " + serverID });
  }
});

// --- SET CHATBOT PROMPT ---
router.post("/set-chatbot-prompt", async (req: Request, res: Response) => {
  const { serverID, walletID, personaPrompt, docsPrompt } = req.body;

  try {
    await prisma.server.update({
      where: { serverID, walletID },
      data: { personaPrompt, docsPrompt },
    });

    await storeLog(
      serverID,
      "CHANGE",
      `Updated chatbot prompts → personaPrompt: ${personaPrompt}, docsPrompt: ${docsPrompt}`
    );

    res.status(200).json({ msg: "Chatbot Prompts set for: " + serverID });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Unable to set prompts for: " + serverID });
  }
});

// --- GET CHATBOT PROMPT ---
router.post("/get-chatbot-prompt", async (req: Request, res: Response) => {
  const { serverID, walletID } = req.body;

  try {
    const response = await prisma.server.findFirst({
      where: { serverID, walletID },
    });

    res.status(200).json({
      personaPrompt: response?.personaPrompt,
      docsPrompt: response?.docsPrompt,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Unable to get prompts for: " + serverID });
  }
});

// --- SET ONBOARDING MESSAGE ---
router.post("/set-onboarding-message", async (req: Request, res: Response) => {
  const { serverID, walletID, onboardingMessage } = req.body;

  try {
    await prisma.server.update({
      where: { serverID, walletID },
      data: { onboardingMessage },
    });

    await storeLog(
      serverID,
      "CHANGE",
      `Updated onboarding message → ${onboardingMessage}`
    );

    res.status(200).json({
      msg: "Onboarding message set for: " + serverID,
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "Unable to set Onboarding message for: " + serverID });
  }
});

// --- GET ONBOARDING MESSAGE ---
router.post("/get-onboarding-message", async (req: Request, res: Response) => {
  const { serverID, walletID } = req.body;

  try {
    const response = await prisma.server.findFirst({
      where: { serverID, walletID },
    });

    res.status(200).json({
      onboardingMessage: response?.onboardingMessage,
    });
  } catch (e) {
    console.error(e);
    res
      .status(500)
      .json({ msg: "Unable to get Onboarding message for: " + serverID });
  }
});

// --- GET ANALYTICS ---
router.post("/get-analytics", async (req: Request, res: Response) => {
  const { serverID, walletID } = req.body;

  try {
    const response = await prisma.server.findFirst({
      where: { serverID, walletID },
      include: { telegramInfo: true, discordInfo: true },
    });

    if (!response) throw new Error();

    const discordMemberCount = await getDiscordMemberCount(
      response?.discordInfo?.guildID!
    );
    const telegramMemberCount = await getTelegramMemberCount(
      parseInt(response?.telegramInfo?.chatID!)
    );

    const discordMessageCount = response.discordInfo?.messageCount;
    const telegramMessageCount = response.telegramInfo?.messageCount;

    res.status(200).json({
      discordMemberCount,
      telegramMemberCount,
      discordMessageCount,
      telegramMessageCount,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Unable to get analytics for: " + serverID });
  }
});

// --- POST POLL ---
router.post("/post-poll", async (req: Request, res: Response) => {
  const { serverID, walletID, question, options } = req.body;

  if (!question?.trim()) {
    return res.status(400).json({ msg: "Poll question cannot be empty." });
  }

  if (!Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ msg: "Poll must have at least 2 options." });
  }

  if (options.length > 10) {
    return res
      .status(400)
      .json({ msg: "Poll supports a maximum of 10 options." });
  }

  try {
    const poll = await prisma.poll.create({
      data: { serverID, walletID, question, options },
    });

    const server = await prisma.server.findFirst({
      where: { serverID, walletID },
      include: { telegramInfo: true, discordInfo: true },
    });

    if (server?.telegramInfo?.chatID) {
      await launchTelegramPoll(server.telegramInfo.chatID, question, options);
    }

    if (server?.discordInfo?.guildID) {
      await launchDiscordPoll(server.discordInfo.guildID, question, options);
    }

    await storeLog(
      serverID,
      "CHANGE",
      `New poll created → Q: "${question}", options: ${options.join(", ")}`
    );

    res.status(200).json({ msg: "Poll posted successfully", poll });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to post poll" });
  }
});

// --- GET POLLS ---
router.post("/get-polls", async (req: Request, res: Response) => {
  const { serverID, walletID } = req.body;

  if (!serverID || !walletID) {
    return res.status(400).json({ msg: "serverID and walletID required." });
  }

  try {
    const polls = await prisma.poll.findMany({
      where: { serverID, walletID },
      orderBy: { createdAt: "desc" },
    });

    res.status(200).json({ polls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Failed to fetch polls" });
  }
});

// --- MAKE ANNOUNCEMENT ---
router.post("/make-announcement", async (req: Request, res: Response) => {
  const { serverID, walletID, message } = req.body;

  if (!serverID || !walletID || !message?.trim()) {
    return res
      .status(400)
      .json({ msg: "serverID, walletID, and message are required" });
  }

  try {
    const server = await prisma.server.findFirst({
      where: { serverID, walletID },
      include: { discordInfo: true, telegramInfo: true },
    });

    if (!server) throw new Error("Server not found");

    if (server.discordInfo?.guildID) {
      await launchDiscordAnnouncement(server.discordInfo.guildID, message);
    }

    if (server.telegramInfo?.chatID) {
      await launchTelegramAnnouncement(
        parseInt(server.telegramInfo.chatID),
        message
      );
    }

    await storeLog(
      serverID,
      "CHANGE",
      `Announcement sent → ${message.substring(0, 100)}...`
    );

    return res.status(200).json({ msg: "Announcement sent successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Failed to send announcement" });
  }
});

// --- GET LOGS ---
router.post("/get-logs", async (req: Request, res: Response) => {
  const { serverID, limit = 10, offset = 0 } = req.body;

  if (!serverID) {
    return res.status(400).json({ msg: "serverID is required" });
  }

  try {
    const logs = await getLogs(
      serverID,
      Number(limit),
      Number(offset),
      process.env.LOGS_AO_PROCESS!
    );
    return res.status(200).json({ logs });
  } catch (err) {
    console.error("get-logs error:", err);
    return res.status(500).json({ msg: "Unable to fetch logs" });
  }
});

export default router;
