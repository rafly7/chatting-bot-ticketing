import { BaileysEventEmitter } from "@adiwajshing/baileys";
import MessageHandler from "./message";

class HandlersSock {
    private readonly messageHandler;
    constructor(sessionId: string, event: BaileysEventEmitter) {
        this.messageHandler = new MessageHandler(sessionId, event);
    }

    public listen() {
        // this.chatHandler.listen();
        // this.messageHandler.listen();
        // this.contactHandler.listen();
    }
}

export default HandlersSock;
