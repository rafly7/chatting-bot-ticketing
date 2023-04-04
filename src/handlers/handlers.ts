import { BaileysEventEmitter } from "@adiwajshing/baileys";
import ChatHandler from "./chat";
import ContactHandler from "./contact";
import MessageHandler from "./message";
import GroupHandler from "./group";

class HandlersSock {
    private readonly messageHandler;
    private readonly chatHandler;
    private readonly contactHandler;
    private readonly groupMetadataHandle;

    constructor(sessionId: string, event: BaileysEventEmitter) {
        this.messageHandler = new MessageHandler(sessionId, event);
        this.chatHandler = new ChatHandler(sessionId, event);
        this.contactHandler = new ContactHandler(sessionId, event);
        this.groupMetadataHandle = new GroupHandler(sessionId, event);

        // Make singleton
        // if ("instance" in HandlersSock)
        //     return Object.getOwnPropertyDescriptor(HandlersSock, "instance")
        //         ?.value;
        // Object.assign(HandlersSock, { instance: this });
    }

    public listen() {
        this.messageHandler.listen();
        this.chatHandler.listen();
        this.contactHandler.listen();
        this.groupMetadataHandle.listen();
    }

    public unlisten() {
        this.messageHandler.unlisten();
        this.chatHandler.unlisten();
        this.contactHandler.unlisten();
        this.groupMetadataHandle.unlisten();
    }
}

export default HandlersSock;
