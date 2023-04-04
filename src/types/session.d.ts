import { SocketConfig } from "@adiwajshing/baileys";
import type { Response } from "express";
import type { WASocket } from "@adiwajshing/baileys";
import HandlersSock from "../handlers/handlers";

export type createSessionOptions = {
    sessionId: string;
    res?: Response;
    SSE?: boolean;
    readIncomingMessages?: boolean;
    socketConfig?: SocketConfig;
};

export type SessionWA = WASocket & {
    destroy: () => Promise<void>;
    store: HandlersSock;
};
