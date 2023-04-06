import {
    BaileysEventMap,
    MessageUpsertType,
    proto,
} from "@adiwajshing/baileys";

export type BaileysEventHandler<T extends keyof BaileysEventMap> = (
    args: BaileysEventMap[T]
) => void;

export type MessageUpsert = {
    messages: proto.IWebMessageInfo[];
    type: MessageUpsertType;
};

export type MessageSet = {
    chats: Chat[];
    contacts: Contact[];
    messages: proto.IWebMessageInfo[];
    isLatest: boolean;
};
