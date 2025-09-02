import express, { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";
import { setModerationConfig } from "../ao/connect";
import { getDiscordMemberCount } from "../discord/discord";
import { getTelegramMemberCount } from "../telegram/telegram";

const router = express.Router();
const prisma = new PrismaClient();

router.post("/add-server", async (req: Request, res: Response) => {
    const { serverID, walletID, name, description } = req.body;

    try{
        const response = await prisma.server.create({
            data: {
                serverID: serverID,
                walletID: walletID,
                name: name,
                description: description
            }
        })

        res.status(200).json(response)
    }
    catch(e){
        console.error(e);

        res.status(500).json({
            msg: "Unable to add server."
        })
    }
});

router.post("/get-servers", async (req: Request, res: Response) => {
    const walletID = req.body.walletID;

    if(!walletID){
        res.status(500).json({
            msg: "No wallet ID."
        }) 

        return;
    }        

    try{
        const response = await prisma.server.findMany({
            where: {
                walletID: walletID as string
            }
        })

        res.status(200).json(response)
    }
    catch(e){
        console.error(e);

        res.status(500).json({
            msg: "Unable to find server."
        })
    }
});

router.post("/set-moderation-config", async (req: Request, res: Response) => {
    const { serverID, walletID, strictnessLevel, bannedWords } = req.body;

    try{
        await prisma.server.update({
            where: {
                serverID: serverID,
                walletID: walletID
            },
            data: {
                strictnessLevel: strictnessLevel,
                bannedWords: bannedWords
            }
        })

        setModerationConfig(serverID, strictnessLevel, bannedWords);
        res.status(200).json({
            msg: "Config set for: " + serverID
        })
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            msg: "Unable to set config for: " + serverID
        })
    }
});

router.post("/get-moderation-config", async (req: Request, res: Response) => {
    const { serverID, walletID } = req.body;

    try{
        const response = await prisma.server.findFirst({
            where: {
                serverID: serverID,
                walletID: walletID
            }
        })

        res.status(200).json({
            strictnessLevel: response?.strictnessLevel,
            bannedWords: response?.bannedWords
        })
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            msg: "Unable to get config for: " + serverID
        })
    }
});

router.post("/set-chatbot-prompt", async (req: Request, res: Response) => {
    const { serverID, walletID, personaPrompt, docsPrompt } = req.body;

    try{
        await prisma.server.update({
            where: {
                serverID: serverID,
                walletID: walletID
            },
            data: {
                personaPrompt: personaPrompt,
                docsPrompt: docsPrompt
            }
        })
        
        res.status(200).json({
            msg: "Chatbot Prompts set for: " + serverID
        })
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            msg: "Unable to set prompts for: " + serverID
        })
    }
});

router.post("/get-chatbot-prompt", async (req: Request, res: Response) => {
    const { serverID, walletID } = req.body;

    try{
        const response = await prisma.server.findFirst({
            where: {
                serverID: serverID,
                walletID: walletID
            }
        })
        
        res.status(200).json({
            personaPrompt: response?.personaPrompt,
            docsPrompt: response?.docsPrompt
        })
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            msg: "Unable to get prompts for: " + serverID
        })
    }
});

router.post("/set-onboarding-message", async (req: Request, res: Response) => {
    const { serverID, walletID, onboardingMessage } = req.body;

    try{
        await prisma.server.update({
            where: {
                serverID: serverID,
                walletID: walletID
            },
            data: {
                onboardingMessage: onboardingMessage
            }
        })
        
        res.status(200).json({
            msg: "Onboarding message set for: " + serverID
        })
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            msg: "Unable to set Onboarding message for: " + serverID
        })
    }
});

router.post("/get-onboarding-message", async (req: Request, res: Response) => {
    const { serverID, walletID } = req.body;

    try{
        const response = await prisma.server.findFirst({
            where: {
                serverID: serverID,
                walletID: walletID
            }
        })
        
        res.status(200).json({
            onboardingMessage: response?.onboardingMessage
        })
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            msg: "Unable to get Onboarding message for: " + serverID
        })
    }
});

router.post("/get-analytics", async (req: Request, res: Response) => {
    const { serverID, walletID } = req.body;

    try{
        const response = await prisma.server.findFirst({
            where: {
                serverID: serverID,
                walletID: walletID
            },
            include: {
                telegramInfo: true,
                discordInfo: true
            }
        })

        if (!response) throw new Error();

        const discordMemberCount = await getDiscordMemberCount(response?.discordInfo?.guildID!);
        const telegramMemberCount = await getTelegramMemberCount(parseInt(response?.telegramInfo?.chatID!));

        const discordMessageCount = response.discordInfo?.messageCount;
        const telegramMessageCount = response.telegramInfo?.messageCount;

        res.status(200).json({
            discordMemberCount,
            telegramMemberCount,
            discordMessageCount,
            telegramMessageCount
        })
    }
    catch(e){
        console.error(e);
        res.status(500).json({
            msg: "Unable to get analytics for: " + serverID
        })
    }
});


export default router;
