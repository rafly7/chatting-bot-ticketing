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

class Message extends Model {
    declare pkId: number;
    declare sessionId: string;
    declare remoteJid: string;
    declare id: string;
    declare agentId: string | null;
    declare bizPrivacyStatus: number | null;
    declare broadcast: boolean | null;
    declare clearMedia: boolean | null;
    declare duration: number | null;
    declare ephemeralDuration: number | null;
    declare ephemeralOffToOn: boolean | null;
    declare ephemeralOutOfSync: boolean | null;
    declare ephemeralStartTimestamp: bigint | null;
    declare finalLiveLocation: any | null;
    declare futureproofData: any | null;
    declare ignore: boolean | null;
    declare keepInChat: any | null;
    declare key: any | null;
    declare labels: any | null;
    declare mediaCiphertextSha256: any | null;
    declare mediaData: any | null;
    declare message: any | null;
    declare messageC2STimestamp: bigint | null;
    declare messageSecret: any | null;
    declare messageStubParameters: any | null;
    declare messageStubType: number | null;
    declare messageTimestamp: bigint | null;
    declare multicast: boolean | null;
    declare originalSelfAuthorUserJidString: string | null;
    declare participant: string | null;
    declare paymentInfo: any | null;
    declare photoChange: any | null;
    declare pollAdditionalMetadata: any | null;
    declare pollUpdates: any | null;
    declare pushName: string | null;
    declare quotedPaymentInfo: any | null;
    declare quotedStickerData: any | null;
    declare reactions: any | null;
    declare revokeMessageTimestamp: bigint | null;
    declare starred: boolean | null;
    declare status: number | null;
    declare statusAlreadyViewed: boolean | null;
    declare statusPsa: any | null;
    declare urlNumber: boolean | null;
    declare urlText: boolean | null;
    declare userReceipt: any | null;
    declare verifiedBizName: string | null;

    public static options: InitOptions = {
        sequelize,
        timestamps: false,
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
            unique: true,
        },
        remoteJid: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true,
        },
        id: {
            type: DataTypes.STRING(128),
            allowNull: false,
            unique: true,
        },
        agentId: {
            type: DataTypes.STRING(128),
        },
        bizPrivacyStatus: {
            type: DataTypes.INTEGER,
        },
        broadcast: {
            type: DataTypes.BOOLEAN,
        },
        clearMedia: {
            type: DataTypes.BOOLEAN,
        },
        duration: {
            type: DataTypes.INTEGER,
        },
        ephemeralDuration: {
            type: DataTypes.INTEGER,
        },
        ephemeralOffToOn: {
            type: DataTypes.BOOLEAN,
        },
        ephemeralOutOfSync: {
            type: DataTypes.BOOLEAN,
        },
        ephemeralStartTimestamp: {
            type: DataTypes.BIGINT,
        },
        finalLiveLocation: {
            type: DataTypes.JSON,
        },
        futureproofData: {
            type: DataTypes.BLOB,
        },
        ignore: {
            type: DataTypes.BOOLEAN,
        },
        keepInChat: {
            type: DataTypes.JSON,
        },
        key: {
            type: DataTypes.JSON,
        },
        labels: {
            type: DataTypes.JSON,
        },
        mediaCiphertextSha256: {
            type: DataTypes.BLOB,
        },
        mediaData: {
            type: DataTypes.JSON,
        },
        message: {
            type: DataTypes.JSON,
        },
        messageC2STimestamp: {
            type: DataTypes.BIGINT,
        },
        messageSecret: {
            type: DataTypes.BLOB,
        },
        messageStubParameters: {
            type: DataTypes.JSON,
        },
        messageStubType: {
            type: DataTypes.INTEGER,
        },
        messageTimestamp: {
            type: DataTypes.BIGINT,
        },
        multicast: {
            type: DataTypes.BOOLEAN,
        },
        originalSelfAuthorUserJidString: {
            type: DataTypes.STRING(128),
        },
        participant: {
            type: DataTypes.STRING(128),
        },
        paymentInfo: {
            type: DataTypes.JSON,
        },
        photoChange: {
            type: DataTypes.JSON,
        },
        pollAdditionalMetadata: {
            type: DataTypes.JSON,
        },
        pollUpdates: {
            type: DataTypes.JSON,
        },
        pushName: {
            type: DataTypes.STRING(128),
        },
        quotedPaymentInfo: {
            type: DataTypes.JSON,
        },
        quotedStickerData: {
            type: DataTypes.JSON,
        },
        reactions: {
            type: DataTypes.JSON,
        },
        revokeMessageTimestamp: {
            type: DataTypes.BIGINT,
        },
        starred: {
            type: DataTypes.BOOLEAN,
        },
        status: {
            type: DataTypes.INTEGER,
        },
        statusAlreadyViewed: {
            type: DataTypes.BOOLEAN,
        },
        statusPsa: {
            type: DataTypes.JSON,
        },
        urlNumber: {
            type: DataTypes.BOOLEAN,
        },
        urlText: {
            type: DataTypes.BOOLEAN,
        },
        userReceipt: {
            type: DataTypes.JSON,
        },
        verifiedBizName: {
            type: DataTypes.STRING(128),
        },
    };

    public static $options: ModelOptions = {
        tableName: "message",
        timestamps: false,
    };

    public static init(): any {
        return super.init.call(this, this.attributes, {
            ...this.options,
            ...this.$options,
        });
    }
}

Message.init();

export default Message;
