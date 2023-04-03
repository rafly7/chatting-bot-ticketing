import {
    BaileysEventEmitter,
    MessageUpsertType,
    WAMessageUpdate,
    jidNormalizedUser,
    toNumber,
    MessageUserReceiptUpdate,
    MessageUserReceipt,
    WAMessageKey,
} from "@adiwajshing/baileys";

import { proto } from "@adiwajshing/baileys";
import type { BaileysEventHandler, MessageSet } from "./types";

import Message from "../models/message";
import chalk from "chalk";
import Chat from "../models/chat";
import { Sequelize, Op } from "sequelize";
import config from "../configs/conf";

type MessageUpsert = {
    messages: proto.IWebMessageInfo[];
    type: MessageUpsertType;
};

// type MessageSet = {
//     messages: proto.IWebMessageInfo[];
//     isLatest: boolean;
// };

const sequelize: Sequelize = config.DATABASE;

class MessageHandler {
    private sessionId: string;
    private event: BaileysEventEmitter;

    constructor(sessionId: string, event: BaileysEventEmitter) {
        this.sessionId = sessionId;
        this.event = event;
        this.init();
    }

    private init() {
        this.event.on("messages.upsert", this.upsert);
        this.event.on("messages.set", this.set);
        this.event.on("messages.update", this.update);
        this.event.on("messages.delete", this.del);
        this.event.on("message-receipt.update", this.updateReceipt);
        this.event.on("messages.reaction", this.updateReaction);
    }

    private getKeyAuthor = (key: WAMessageKey | undefined | null) =>
        (key?.fromMe ? "me" : key?.participant || key?.remoteJid) || "";

    private set: BaileysEventHandler<"messages.set"> = async (
        ms: MessageSet
    ): Promise<void> => {
        try {
            await sequelize.transaction(async (t) => {
                if (ms.isLatest) {
                    await Message.destroy({
                        where: {
                            sessionId: this.sessionId,
                        },
                        transaction: t,
                    });
                }
                const pushData: any[] = [];
                for (const val of ms.messages) {
                    pushData.push({
                        sessionId: this.sessionId,
                        remoteJid: val.key.remoteJid,
                        id: val.key.id,
                        agentId: val.agentId,
                        bizPrivacyStatus: val.bizPrivacyStatus,
                        broadcast: val.broadcast,
                        clearMedia: val.clearMedia,
                        duration: val.duration,
                        ephemeralDuration: val.ephemeralDuration,
                        ephemeralOffToOn: val.ephemeralOffToOn,
                        ephemeralOutOfSync: val.ephemeralOutOfSync,
                        ephemeralStartTimestamp: val.ephemeralStartTimestamp,
                        finalLiveLocation: val.finalLiveLocation,
                        futureproofData: val.futureproofData,
                        ignore: val.ignore,
                        keepInChat: val.keepInChat,
                        key: val.key,
                        labels: val.labels,
                        mediaCiphertextSha256: val.mediaCiphertextSha256,
                        mediaData: val.mediaData,
                        message: val.message,
                        messageC2STimestamp: val.messageC2STimestamp,
                        messageSecret: val.messageSecret,
                        messageStubParameters: val.messageStubParameters,
                        messageStubType: val.messageStubType,
                        messageTimestamp: val.messageTimestamp,
                        multicast: val.multicast,
                        originalSelfAuthorUserJidString:
                            val.originalSelfAuthorUserJidString,
                        participant: val.participant,
                        paymentInfo: val.paymentInfo,
                        photoChange: val.photoChange,
                        pollAdditionalMetadata: val.pollAdditionalMetadata,
                        pollUpdates: val.pollUpdates,
                        pushName: val.pushName,
                        quotedPaymentInfo: val.quotedPaymentInfo,
                        quotedStickerData: val.quotedStickerData,
                        reactions: val.reactions,
                        revokeMessageTimestamp: val.revokeMessageTimestamp,
                        starred: val.starred,
                        status: val.status,
                        statusAlreadyViewed: val.statusAlreadyViewed,
                        statusPsa: val.statusPsa,
                        urlNumber: val.urlNumber,
                        urlText: val.urlText,
                        userReceipt: val.userReceipt,
                        verifiedBizName: val.verifiedBizName,
                    });
                }
                await Message.bulkCreate(pushData, { transaction: t });
            });
        } catch (e) {
            console.log(chalk.redBright.bold(e));
        }
    };

    private upsert: BaileysEventHandler<"messages.upsert"> = async (
        mu: MessageUpsert
    ): Promise<void> => {
        switch (mu.type) {
            case "append":
            case "notify":
                for (const message of mu.messages) {
                    try {
                        const jid = jidNormalizedUser(message.key.remoteJid!);
                        await Message.upsert({
                            sessionId: this.sessionId,
                            remoteJid: jid,
                            id: message.key.id!,
                            agentId: message.agentId,
                            bizPrivacyStatus: message.bizPrivacyStatus,
                            broadcast: message.broadcast,
                            clearMedia: message.clearMedia,
                            duration: message.duration,
                            ephemeralDuration: message.ephemeralDuration,
                            ephemeralOffToOn: message.ephemeralOffToOn,
                            ephemeralOutOfSync: message.ephemeralOutOfSync,
                            ephemeralStartTimestamp:
                                message.ephemeralStartTimestamp,
                            finalLiveLocation: message.finalLiveLocation,
                            futureproofData: message.futureproofData,
                            ignore: message.ignore,
                            keepInChat: message.keepInChat,
                            key: message.key,
                            labels: message.labels,
                            mediaCiphertextSha256:
                                message.mediaCiphertextSha256,
                            mediaData: message.mediaData,
                            message: message.message,
                            messageC2STimestamp: message.messageC2STimestamp,
                            messageSecret: message.messageSecret,
                            messageStubParameters:
                                message.messageStubParameters,
                            messageStubType: message.messageStubType,
                            messageTimestamp: message.messageTimestamp,
                            multicast: message.multicast,
                            originalSelfAuthorUserJidString:
                                message.originalSelfAuthorUserJidString,
                            participant: message.participant,
                            paymentInfo: message.paymentInfo,
                            photoChange: message.photoChange,
                            pollAdditionalMetadata:
                                message.pollAdditionalMetadata,
                            pollUpdates: message.pollUpdates,
                            pushName: message.pushName,
                            quotedPaymentInfo: message.quotedPaymentInfo,
                            quotedStickerData: message.quotedStickerData,
                            reactions: message.reactions,
                            revokeMessageTimestamp:
                                message.revokeMessageTimestamp,
                            starred: message.starred,
                            status: message.status,
                            statusAlreadyViewed: message.statusAlreadyViewed,
                            statusPsa: message.statusPsa,
                            urlNumber: message.urlNumber,
                            urlText: message.urlText,
                            userReceipt: message.userReceipt,
                            verifiedBizName: message.verifiedBizName,
                        });

                        const chatExists =
                            (await Chat.count({
                                where: { id: jid, sessionId: this.sessionId },
                            })) > 0;
                        if (mu.type === "notify" && !chatExists) {
                            this.event.emit("chats.upsert", [
                                {
                                    id: jid,
                                    conversationTimestamp: toNumber(
                                        message.messageTimestamp
                                    ),
                                    unreadCount: 1,
                                },
                            ]);
                        }
                    } catch (e) {
                        console.log(chalk.redBright.bold(e));
                        // logger!.error(
                        //     e,
                        //     "An error occured during message upsert"
                        // );
                    }
                }
                break;
        }
    };

    private update: BaileysEventHandler<"messages.update"> = async (
        datas: WAMessageUpdate[]
    ): Promise<void> => {
        for (const { key, update } of datas) {
            try {
                await sequelize.transaction(async (t) => {
                    const prevData = await Message.findOne({
                        where: {
                            id: key.id,
                            remoteJid: key.remoteJid,
                            sessionId: this.sessionId,
                        },
                    });
                    if (!prevData) {
                        return console.log(
                            chalk.redBright.bold(
                                { update },
                                "Got update for non existent message"
                            )
                        );
                    }
                    const data = {
                        ...prevData,
                        ...update,
                    } as proto.IWebMessageInfo;
                    await Message.destroy({
                        where: {
                            sessionId: this.sessionId,
                            remoteJid: key.remoteJid,
                            id: key.id,
                        },
                        transaction: t,
                    });
                    await Message.create(
                        {
                            sessionId: this.sessionId,
                            remoteJid: data.key.remoteJid,
                            id: data.key.id,
                            agentId: data.agentId,
                            bizPrivacyStatus: data.bizPrivacyStatus,
                            broadcast: data.broadcast,
                            clearMedia: data.clearMedia,
                            duration: data.duration,
                            ephemeralDuration: data.ephemeralDuration,
                            ephemeralOffToOn: data.ephemeralOffToOn,
                            ephemeralOutOfSync: data.ephemeralOutOfSync,
                            ephemeralStartTimestamp:
                                data.ephemeralStartTimestamp,
                            finalLiveLocation: data.finalLiveLocation,
                            futureproofData: data.futureproofData,
                            ignore: data.ignore,
                            keepInChat: data.keepInChat,
                            key: data.key,
                            labels: data.labels,
                            mediaCiphertextSha256: data.mediaCiphertextSha256,
                            mediaData: data.mediaData,
                            message: data.message,
                            messageC2STimestamp: data.messageC2STimestamp,
                            messageSecret: data.messageSecret,
                            messageStubParameters: data.messageStubParameters,
                            messageStubType: data.messageStubType,
                            messageTimestamp: data.messageTimestamp,
                            multicast: data.multicast,
                            originalSelfAuthorUserJidString:
                                data.originalSelfAuthorUserJidString,
                            participant: data.participant,
                            paymentInfo: data.paymentInfo,
                            photoChange: data.photoChange,
                            pollAdditionalMetadata: data.pollAdditionalMetadata,
                            pollUpdates: data.pollUpdates,
                            pushName: data.pushName,
                            quotedPaymentInfo: data.quotedPaymentInfo,
                            quotedStickerData: data.quotedStickerData,
                            reactions: data.reactions,
                            revokeMessageTimestamp: data.revokeMessageTimestamp,
                            starred: data.starred,
                            status: data.status,
                            statusAlreadyViewed: data.statusAlreadyViewed,
                            statusPsa: data.statusPsa,
                            urlNumber: data.urlNumber,
                            urlText: data.urlText,
                            userReceipt: data.userReceipt,
                            verifiedBizName: data.verifiedBizName,
                        },
                        {
                            transaction: t,
                        }
                    );
                });
            } catch (e) {
                console.log(chalk.redBright.bold(e));
            }
        }
    };

    private del: BaileysEventHandler<"messages.delete"> = async (
        md:
            | {
                  keys: proto.IMessageKey[];
              }
            | {
                  jid: string;
                  all: true;
              }
    ): Promise<void> => {
        try {
            if ("all" in md) {
                await Message.destroy({
                    where: {
                        sessionId: this.sessionId,
                        remoteJid: md.jid,
                    },
                });
                return;
            }
            const jid = md.keys[0].remoteJid;
            await Message.destroy({
                where: {
                    id: {
                        [Op.in]: md.keys.map((k: proto.IMessageKey) => k.id),
                    },
                    remoteJid: jid,
                    sessionId: this.sessionId,
                },
            });
        } catch (e) {
            console.log(chalk.redBright.bold(e));
        }
    };

    private updateReceipt: BaileysEventHandler<"message-receipt.update"> =
        async (datas: MessageUserReceiptUpdate[]): Promise<void> => {
            for (const { key, receipt } of datas) {
                try {
                    await sequelize.transaction(async (t) => {
                        const message = await Message.findOne({
                            where: {
                                sessionId: this.sessionId,
                                id: key.id,
                                remoteJid: key.remoteJid,
                            },
                            raw: true,
                            transaction: t,
                        });
                        if (!message) {
                            return console.log(
                                chalk.redBright.bold(
                                    { datas },
                                    "Got receipt update for non existent message"
                                )
                            );
                        }
                        let userReceipt = (message.userReceipt ||
                            []) as unknown as MessageUserReceipt[];
                        const recepient = userReceipt.find(
                            (m: proto.IUserReceipt) =>
                                m.userJid === receipt.userJid
                        );

                        if (recepient) {
                            userReceipt = [
                                ...userReceipt.filter(
                                    (m: proto.IUserReceipt) =>
                                        m.userJid !== receipt.userJid
                                ),
                                receipt,
                            ];
                        } else {
                            userReceipt.push(receipt);
                        }

                        await Message.update(
                            {
                                userReceipt: userReceipt,
                            },
                            {
                                where: {
                                    sessionId: this.sessionId,
                                    remoteJid: key.remoteJid,
                                    id: key.id,
                                },
                            }
                        );
                    });
                } catch (e) {
                    console.log(chalk.redBright.bold(e));
                }
            }
        };

    private updateReaction: BaileysEventHandler<"messages.reaction"> = async (
        args: {
            key: proto.IMessageKey;
            reaction: proto.IReaction;
        }[]
    ): Promise<void> => {
        for (const { key, reaction } of args) {
            try {
                await sequelize.transaction(async (t) => {
                    const message = await Message.findOne({
                        where: {
                            id: key.id,
                            remoteJid: key.remoteJid!,
                            sessionId: this.sessionId,
                        },
                        transaction: t,
                        raw: true,
                    });
                    if (!message) {
                        return console.log(
                            chalk.redBright.bold(
                                "Got reaction update for non existent message"
                            )
                        );
                    }
                    const authorID = this.getKeyAuthor(reaction.key);
                    const reactions = (
                        (message.reactions || []) as proto.IReaction[]
                    ).filter(
                        (r: proto.IReaction) =>
                            this.getKeyAuthor(r.key) !== authorID
                    );
                    if (reaction.text) reactions.push(reaction);
                    await Message.update(
                        {
                            reaction: reaction,
                        },
                        {
                            where: {
                                sessionId: this.sessionId,
                                id: key.id,
                                remoteJid: key.remoteJid,
                            },
                            transaction: t,
                        }
                    );
                });
            } catch (e) {
                console.log(chalk.redBright.bold(e));
            }
        }
    };

    static listen(sessionId: string, event: BaileysEventEmitter) {}
    static unlisten(sessionId: string, event: BaileysEventEmitter) {}
}

export default MessageHandler;
