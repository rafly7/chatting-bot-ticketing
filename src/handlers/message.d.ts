import { MessageUpsertType, proto } from "@adiwajshing/baileys";

export type MessageUpsert = {
    messages: proto.IWebMessageInfo[];
    type: MessageUpsertType;
};

export type MessageSet = {
    messages: proto.IWebMessageInfo[];
    isLatest: boolean;
};
