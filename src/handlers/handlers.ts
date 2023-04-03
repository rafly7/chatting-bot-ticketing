import { BaileysEventEmitter } from "@adiwajshing/baileys";
import ChatHandler from "./chat";
import ContactHandler from "./contact";
import MessageHandler from "./message";

class HandlersSock {
    private readonly messageHandler;
    private readonly chatHandler;
    private readonly contactHandler;
    constructor(sessionId: string, event: BaileysEventEmitter) {
        this.messageHandler = new MessageHandler(sessionId, event);
        this.chatHandler = new ChatHandler(sessionId, event);
        this.contactHandler = new ContactHandler(sessionId, event);
    }

    public listen() {
        // this.chatHandler.listen();
        // this.messageHandler.listen();
        // this.contactHandler.listen();
    }
}

export default HandlersSock;
