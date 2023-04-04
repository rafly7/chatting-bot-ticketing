import { Router } from "express";
import type { Request, Response } from "express";
import WASession from "../wa";
import { SessionWA } from "../types/session";

const router: Router = Router();

router.post("/session", async (req: Request, res: Response, next: Function) => {
    const { sessionId, readIncomingMessages, ...socketConfig } = req.body;
    const waSession = new WASession();
    if (waSession.sessionExists(sessionId))
        return res.status(400).json({ error: "Session already exists" });
    waSession.createSession({
        sessionId,
        res,
        readIncomingMessages,
        socketConfig,
    });
});

router.delete(
    "/session",
    async (req: Request, res: Response, next: Function) => {
        try {
            const waSession = new WASession();
            await waSession.deleteSession(req.params.sessionId);
            res.status(200).json({ message: "Session deleted" });
        } catch (e) {
            res.status(400).json({ error: "Failed delete session" });
        }
    }
);

router.get("/session", async (req: Request, res: Response, next: Function) => {
    try {
        const waSession = new WASession();
        const datas = waSession.listSession();
        res.status(200).json(datas);
    } catch (e) {
        res.status(400).json({ error: "Failed list session" });
    }
});

router.post(
    "/message/:sessionId",
    async (req: Request, res: Response, next: Function) => {
        try {
            const waSession = new WASession();
            const { jid, type = "number", message, options } = req.body;
            const session: SessionWA | undefined = waSession.getSession(
                req.params.sessionId
            )!;

            if (session === undefined) {
                return res
                    .status(400)
                    .json({ error: "session does not exists" });
            }
            const exists = await waSession.jidExists(session, jid, type);
            if (!exists) {
                return res.status(400).json({ error: "JID does not exists" });
            }
            const buttons = [
                {
                    buttonId: "id1",
                    buttonText: { displayText: "Button 1" },
                    type: 1,
                },
                {
                    buttonId: "id2",
                    buttonText: { displayText: "Button 2" },
                    type: 1,
                },
                {
                    buttonId: "id3",
                    buttonText: { displayText: "Button 3" },
                    type: 1,
                },
            ];

            const buttonMessage = {
                text: "Hi it's button message",
                footer: "Hello World",
                buttons: buttons,
                headerType: 1,
            };
            const result = await session.sendMessage(
                jid,
                buttonMessage,
                options
            );
            res.status(200).json(result);
        } catch (e) {
            res.status(400).json({ error: "Failed list session" });
        }
    }
);

export default router;
