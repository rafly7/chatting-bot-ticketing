import {
    Model,
    ModelAttributes,
    DataTypes,
    ModelOptions,
    Sequelize,
    InitOptions,
} from "sequelize";

import config from "../configs/conf";

const sequelize: Sequelize = config.DATABASE;

class Chat extends Model {
    declare pkId: number;
    declare sessionId: string;
    declare archived: boolean | null;
    declare contactPrimaryIdentityKey: any | null;
    declare conversationTimestamp: bigint | null;
    declare createdAt: bigint | null;
    declare createdBy: string | null;
    declare description: string | null;
    declare disappearingMode: any | null;
    declare displayName: string | null;
    declare endOfHistoryTransfer: boolean | null;
    declare endOfHistoryTransferType: number | null;
    declare ephemeralExpiration: number | null;
    declare ephemeralSettingTimestamp: bigint | null;
    declare id: string | null;
    declare isDefaultSubgroup: boolean | null;
    declare isParentGroup: boolean | null;
    declare lastMsgTimestamp: bigint | null;
    declare lidJid: string | null;
    declare markedAsUnread: boolean | null;
    declare mediaVisibility: number | null;
    declare messages: any | null;
    declare muteEndTime: bigint | null;
    declare name: string | null;
    declare newJid: string | null;
    declare notSpam: boolean | null;
    declare oldJid: string | null;
    declare pHash: string | null;
    declare parentGroupId: string | null;
    declare participant: any | null;
    declare pinned: number | null;
    declare pnJid: string | null;
    declare pnhDuplicateLidThread: boolean | null;
    declare readOnly: boolean | null;
    declare shareOwnPn: boolean | null;
    declare support: boolean | null;
    declare suspended: boolean | null;
    declare tcToken: any | null;
    declare tcTokenSenderTimestamp: bigint | null;
    declare tcTokenTimestamp: bigint | null;
    declare terminated: boolean | null;
    declare unreadCount: number | null;
    declare unreadMentionCount: number | null;
    declare wallpaper: any | null;
    declare lastMessageRecvTimestamp: number | null;

    public static options: InitOptions = {
        sequelize,
        timestamps: false,
        indexes: [
            {
                unique: true,
                name: "chat_unique_id_per_session_id",
                fields: ["sessionId", "id"],
                using: "BTREE",
            },
            {
                name: "chat_sessionId_idx",
                fields: ["sessionId"],
                using: "BTREE",
            },
        ],
    };

    public static attributes: ModelAttributes = {
        pkId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        sessionId: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        archived: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        contactPrimaryIdentityKey: {
            type: DataTypes.BLOB,
        },
        conversationTimestamp: {
            type: DataTypes.BIGINT,
        },
        createdAt: {
            type: DataTypes.BIGINT,
        },
        createdBy: {
            type: DataTypes.STRING,
        },
        description: {
            type: DataTypes.STRING,
        },
        disappearingMode: {
            type: DataTypes.JSONB,
        },
        displayName: {
            type: DataTypes.STRING,
        },
        endOfHistoryTransfer: {
            type: DataTypes.BOOLEAN,
        },
        endOfHistoryTransferType: {
            type: DataTypes.INTEGER,
        },
        ephemeralExpiration: {
            type: DataTypes.INTEGER,
        },
        ephemeralSettingTimestamp: {
            type: DataTypes.BIGINT,
        },
        id: {
            type: DataTypes.STRING,
        },
        isDefaultSubgroup: {
            type: DataTypes.BOOLEAN,
        },
        isParentGroup: {
            type: DataTypes.BOOLEAN,
        },
        lastMsgTimestamp: {
            type: DataTypes.BIGINT,
        },
        lidJid: {
            type: DataTypes.STRING,
        },
        markedAsUnread: {
            type: DataTypes.BOOLEAN,
        },
        mediaVisibility: {
            type: DataTypes.INTEGER,
        },
        messages: {
            type: DataTypes.JSONB,
        },
        muteEndTime: {
            type: DataTypes.BIGINT,
        },
        name: {
            type: DataTypes.STRING,
        },
        newJid: {
            type: DataTypes.STRING,
        },
        notSpam: {
            type: DataTypes.BOOLEAN,
        },
        oldJid: {
            type: DataTypes.STRING,
        },
        pHash: {
            type: DataTypes.STRING,
        },
        parentGroupId: {
            type: DataTypes.STRING,
        },
        participant: {
            type: DataTypes.JSONB,
        },
        pinned: {
            type: DataTypes.INTEGER,
        },
        pnJid: {
            type: DataTypes.STRING,
        },
        pnhDuplicateLidThread: {
            type: DataTypes.BOOLEAN,
        },
        readOnly: {
            type: DataTypes.BOOLEAN,
        },
        shareOwnPn: {
            type: DataTypes.BOOLEAN,
        },
        support: {
            type: DataTypes.BOOLEAN,
        },
        suspended: {
            type: DataTypes.BOOLEAN,
        },
        tcToken: {
            type: DataTypes.BLOB,
        },
        tcTokenSenderTimestamp: {
            type: DataTypes.BIGINT,
        },
        tcTokenTimestamp: {
            type: DataTypes.BIGINT,
        },
        terminated: {
            type: DataTypes.BOOLEAN,
        },
        unreadCount: {
            type: DataTypes.INTEGER,
        },
        unreadMentionCount: {
            type: DataTypes.INTEGER,
        },
        wallpaper: {
            type: DataTypes.JSONB,
        },
        lastMessageRecvTimestamp: {
            type: DataTypes.INTEGER,
        },
    };

    public static $options: ModelOptions = {
        tableName: "chat",
        timestamps: false,
        indexes: [
            {
                unique: true,
                name: "chat_unique_id_per_session_id",
                fields: ["sessionId", "id"],
                using: "BTREE",
            },
            {
                name: "chat_sessionId_idx",
                fields: ["sessionId"],
                using: "BTREE",
            },
        ],
    };

    public static init(): any {
        return super.init.call(this, this.attributes, {
            ...this.options,
            ...this.$options,
        });
    }
}

Chat.init();

export default Chat;
