import { GroupParticipant } from "@adiwajshing/baileys";

class BotsApp {
    declare mimeType: string | null;
    declare type: string | null;
    declare body: string | null | undefined;
    declare commandName: string | null | undefined;
    declare chatId: string | null | undefined;
    declare owner: string;
    declare logGroup: string;
    declare sender: string | null | undefined;
    declare groupName: string | null | undefined;
    declare groupMembers: GroupParticipant[] | null | undefined;
    declare groupAdmins: string[] | null;
    declare groupId: string | null | undefined;
    declare replyMessageId: string | any;
    declare replyMessage: string | any;
    declare imageCaption: string | any;
    declare replyParticipant: string | any;

    declare isTextReply: boolean;
    declare isCmd: boolean;
    declare fromMe: boolean | any;
    declare isGroup: boolean;
    declare isPm: boolean;
    declare isBotGroupAdmin: boolean | undefined;
    declare isSenderGroupAdmin: boolean | undefined;
    declare isSenderSUDO: boolean;
    declare isImage: boolean;
    declare isReplyImage: boolean;
    declare isGIF: boolean | null | undefined;
    declare isReplyGIF: boolean;
    declare isSticker: boolean;
    declare isReplySticker: boolean;
    declare isReplyVideo: boolean;
    declare isReplyAudio: boolean;
    declare isVideo: boolean;
    declare isAudio: boolean;
    declare isReplyAnimatedSticker: boolean | any;
}

export = BotsApp;
