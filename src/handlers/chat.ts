import { BaileysEventEmitter, Chat } from "@adiwajshing/baileys";
import chalk from "chalk";
import { Sequelize, Op } from "sequelize";
import config from "../configs/conf";
import ChatM from "../models/chat";
import { BaileysEventHandler, MessageSet } from "./types";
import { Promise as PromiseM } from "bluebird";

const sequelize: Sequelize = config.DATABASE;

class ChatHandler {
    private sessionId: string;
    private event: BaileysEventEmitter;

    constructor(sessionId: string, event: BaileysEventEmitter) {
        this.sessionId = sessionId;
        this.event = event;
    }

    public listen() {
        this.event.on("messaging-history.set", this.set);
        this.event.on("chats.upsert", this.upsert);
        this.event.on("chats.update", this.update);
        this.event.on("chats.delete", this.delete);
    }

    public unlisten() {
        this.event.off("messaging-history.set", this.set);
        this.event.off("chats.upsert", this.upsert);
        this.event.off("chats.update", this.update);
        this.event.off("chats.delete", this.delete);
    }

    private set: BaileysEventHandler<"messaging-history.set"> = async ({
        chats,
        isLatest,
    }): Promise<void> => {
        try {
            await sequelize.transaction(async (t) => {
                if (isLatest)
                    ChatM.destroy({
                        where: {
                            sessionId: this.sessionId,
                        },
                        transaction: t,
                    });

                const existingIds = (
                    await ChatM.findAll({
                        where: {
                            sessionId: this.sessionId,
                            id: {
                                [Op.in]: chats.map((c: Chat) => c.id),
                            },
                        },
                        transaction: t,
                    })
                ).map((val: ChatM) => val.id);
                const pushData: any[] = [];
                const dts = chats.filter(
                    (c: Chat) => !existingIds.includes(c.id)
                );
                for (const dt of dts) {
                    pushData.push({
                        sessionId: this.sessionId,
                        archived: dt.archived,
                        contactPrimaryIdentityKey: dt.contactPrimaryIdentityKey,
                        conversationTimestamp: dt.conversationTimestamp,
                        createdAt: dt.createdAt,
                        createdBy: dt.createdBy,
                        description: dt.description,
                        disappearingMode: dt.disappearingMode,
                        displayName: dt.displayName,
                        endOfHistoryTransfer: dt.endOfHistoryTransfer,
                        endOfHistoryTransferType: dt.endOfHistoryTransferType,
                        ephemeralExpiration: dt.ephemeralExpiration,
                        ephemeralSettingTimestamp: dt.ephemeralSettingTimestamp,
                        id: dt.id,
                        isDefaultSubgroup: dt.isDefaultSubgroup,
                        isParentGroup: dt.isParentGroup,
                        lastMessageRecvTimestamp: dt.lastMessageRecvTimestamp,
                        lastMsgTimestamp: dt.lastMsgTimestamp,
                        lidJid: dt.lidJid,
                        markedAsUnread: dt.markedAsUnread,
                        mediaVisibility: dt.mediaVisibility,
                        messages: dt.messages,
                        muteEndTime: dt.muteEndTime,
                        name: dt.name,
                        newJid: dt.newJid,
                        notSpam: dt.notSpam,
                        oldJid: dt.oldJid,
                        pHash: dt.pHash,
                        parentGroupId: dt.parentGroupId,
                        participant: dt.participant,
                        pinned: dt.pinned,
                        pnJid: dt.pnJid,
                        pnhDuplicateLidThread: dt.pnhDuplicateLidThread,
                        readOnly: dt.readOnly,
                        shareOwnPn: dt.shareOwnPn,
                        support: dt.support,
                        suspended: dt.suspended,
                        tcToken: dt.tcToken,
                        tcTokenSenderTimestamp: dt.tcTokenSenderTimestamp,
                        tcTokenTimestamp: dt.tcTokenTimestamp,
                        terminated: dt.terminated,
                        unreadCount: dt.unreadCount,
                        unreadMentionCount: dt.unreadMentionCount,
                        wallpaper: dt.wallpaper,
                    });
                }
                const dataChats = await ChatM.bulkCreate(pushData, {
                    transaction: t,
                });
                console.log(
                    chalk.greenBright.bold(
                        "[chats.set] ",
                        dataChats.length,
                        " Synced chats"
                    )
                );
            });
        } catch (e) {
            console.log(chalk.redBright.bold("[chats.set] ", e));
        }
    };

    private upsert: BaileysEventHandler<"chats.upsert"> = async (
        args: Chat[]
    ): Promise<void> => {
        try {
            await PromiseM.map(args, async (val) => {
                await ChatM.upsert(
                    {
                        sessionId: this.sessionId,
                        archived: val.archived,
                        contactPrimaryIdentityKey:
                            val.contactPrimaryIdentityKey,
                        conversationTimestamp: val.conversationTimestamp,
                        createdAt: val.createdAt,
                        createdBy: val.createdBy,
                        description: val.description,
                        disappearingMode: val.disappearingMode,
                        displayName: val.displayName,
                        endOfHistoryTransfer: val.endOfHistoryTransfer,
                        endOfHistoryTransferType: val.endOfHistoryTransferType,
                        ephemeralExpiration: val.ephemeralExpiration,
                        ephemeralSettingTimestamp:
                            val.ephemeralSettingTimestamp,
                        id: val.id,
                        isDefaultSubgroup: val.isDefaultSubgroup,
                        isParentGroup: val.isParentGroup,
                        lastMessageRecvTimestamp: val.lastMessageRecvTimestamp,
                        lastMsgTimestamp: val.lastMsgTimestamp,
                        lidJid: val.lidJid,
                        markedAsUnread: val.markedAsUnread,
                        mediaVisibility: val.mediaVisibility,
                        messages: val.messages,
                        muteEndTime: val.muteEndTime,
                        name: val.name,
                        newJid: val.newJid,
                        notSpam: val.notSpam,
                        oldJid: val.oldJid,
                        pHash: val.pHash,
                        parentGroupId: val.parentGroupId,
                        participant: val.participant,
                        pinned: val.pinned,
                        pnJid: val.pnJid,
                        pnhDuplicateLidThread: val.pnhDuplicateLidThread,
                        readOnly: val.readOnly,
                        shareOwnPn: val.shareOwnPn,
                        support: val.support,
                        suspended: val.suspended,
                        tcToken: val.tcToken,
                        tcTokenSenderTimestamp: val.tcTokenSenderTimestamp,
                        tcTokenTimestamp: val.tcTokenTimestamp,
                        terminated: val.terminated,
                        unreadCount: val.unreadCount,
                        unreadMentionCount: val.unreadMentionCount,
                        wallpaper: val.wallpaper,
                    },
                    {
                        conflictWhere: {
                            sessionId: this.sessionId,
                            id: val.id,
                        },
                    }
                );
            });
        } catch (e) {
            console.log(chalk.redBright.bold("[chats.upsert] ", e));
        }
    };

    private update: BaileysEventHandler<"chats.update"> = async (
        args: Partial<Chat>[]
    ) => {
        for (const update of args) {
            try {
                await ChatM.update(
                    {
                        sessionId: this.sessionId,
                        archived: update.archived,
                        contactPrimaryIdentityKey:
                            update.contactPrimaryIdentityKey,
                        conversationTimestamp: update.conversationTimestamp,
                        createdAt: update.createdAt,
                        createdBy: update.createdBy,
                        description: update.description,
                        disappearingMode: update.disappearingMode,
                        displayName: update.displayName,
                        endOfHistoryTransfer: update.endOfHistoryTransfer,
                        endOfHistoryTransferType:
                            update.endOfHistoryTransferType,
                        ephemeralExpiration: update.ephemeralExpiration,
                        ephemeralSettingTimestamp:
                            update.ephemeralSettingTimestamp,
                        id: update.id,
                        isDefaultSubgroup: update.isDefaultSubgroup,
                        isParentGroup: update.isParentGroup,
                        lastMessageRecvTimestamp:
                            update.lastMessageRecvTimestamp,
                        lastMsgTimestamp: update.lastMsgTimestamp,
                        lidJid: update.lidJid,
                        markedAsUnread: update.markedAsUnread,
                        mediaVisibility: update.mediaVisibility,
                        messages: update.messages,
                        muteEndTime: update.muteEndTime,
                        name: update.name,
                        newJid: update.newJid,
                        notSpam: update.notSpam,
                        oldJid: update.oldJid,
                        pHash: update.pHash,
                        parentGroupId: update.parentGroupId,
                        participant: update.participant,
                        pinned: update.pinned,
                        pnJid: update.pnJid,
                        pnhDuplicateLidThread: update.pnhDuplicateLidThread,
                        readOnly: update.readOnly,
                        shareOwnPn: update.shareOwnPn,
                        support: update.support,
                        suspended: update.suspended,
                        tcToken: update.tcToken,
                        tcTokenSenderTimestamp: update.tcTokenSenderTimestamp,
                        tcTokenTimestamp: update.tcTokenTimestamp,
                        terminated: update.terminated,
                        unreadCount: update.unreadCount,
                        unreadMentionCount: update.unreadMentionCount,
                        wallpaper: update.wallpaper,
                    },
                    {
                        where: {
                            sessionId: this.sessionId,
                            id: update.id,
                        },
                    }
                );
            } catch (e) {
                // if (e instanceof )
                console.log(chalk.redBright.bold("[chats.update] ", e));
            }
        }
    };

    private delete: BaileysEventHandler<"chats.delete"> = async (
        args: string[]
    ): Promise<void> => {
        try {
            await ChatM.destroy({
                where: {
                    id: {
                        [Op.in]: args,
                    },
                },
            });
        } catch (e) {
            console.log(chalk.redBright.bold("[chats.delete] ", e));
        }
    };
}

export default ChatHandler;
