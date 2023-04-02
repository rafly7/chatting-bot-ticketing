import { BaileysEventMap } from "@adiwajshing/baileys";

export type BaileysEventHandler<T extends keyof BaileysEventMap> = (
    args: BaileysEventMap[T]
) => void;
