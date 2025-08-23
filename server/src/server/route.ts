import express, { type Request, type Response } from "express";
import { PrismaClient } from "@prisma/client";

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

export default router;
