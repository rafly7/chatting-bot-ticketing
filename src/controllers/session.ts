import { Request, Response } from "express";
import WASession from "../wa";

class SessionController {
    public async addSession(
        req: Request,
        res: Response,
        next: Function,
        client: WASession
    ) {
        const { sessionId, readIncomingMessages, ...socketConfig } = req.body;
        if (client.sessionExists(sessionId))
            return res.status(400).json({ error: "Session already exists" });
        client.createSession({
            sessionId,
            res,
            readIncomingMessages,
            socketConfig,
        });
    }

    public async deleteSession(
        req: Request,
        res: Response,
        next: Function,
        client: WASession
    ) {
        try {
            await client.deleteSession(req.params.sessionId);
            res.status(200).json({ message: "Session deleted" });
        } catch (e) {
            res.status(400).json({ error: "Failed delete session" });
        }
    }

    public async getAllSession(
        req: Request,
        res: Response,
        next: Function,
        client: WASession
    ) {
        try {
            const datas = client.listSession();
            res.status(200).json(datas);
        } catch (e) {
            res.status(400).json({ error: "Failed list session" });
        }
    }
}

export default SessionController;
