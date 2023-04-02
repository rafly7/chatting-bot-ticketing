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

class GroupMetadata extends Model {
    declare pkId: number;
    declare sessionId: string;
    declare id: string;
    declare owner: string | null;
    declare subject: string | null;
    declare subjectOwner: string | null;
    declare subjectTime: number | null;
    declare creation: number | null;
    declare desc: string | null;
    declare descOwner: string | null;
    declare descId: string | null;
    declare restrict: boolean | null;
    declare announce: boolean | null;
    declare size: number | null;
    declare participants: any | null;
    declare ephemeralDuration: number | null;
    declare inviteCode: string | null;

    public static options: InitOptions = {
        sequelize,
        timestamps: false,
        indexes: [
            {
                unique: true,
                name: "group_metadata_unique_id_per_session_id",
                fields: ["sessionId", "id"],
                using: "BTREE",
            },
            {
                name: "group_metadata_sessionId_idx",
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
            allowNull: false,
        },
        sessionId: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        owner: {
            type: DataTypes.STRING,
        },
        subject: {
            type: DataTypes.INTEGER,
        },
        subjectOwner: {
            type: DataTypes.INTEGER,
        },
        subjectTime: {
            type: DataTypes.STRING,
        },
        creation: {
            type: DataTypes.STRING,
        },
        desc: {
            type: DataTypes.STRING,
        },
        descOwner: {
            type: DataTypes.STRING,
        },
        descId: {
            type: DataTypes.STRING,
        },
        restrict: {
            type: DataTypes.BOOLEAN,
        },
        announce: {
            type: DataTypes.BOOLEAN,
        },
        size: {
            type: DataTypes.INTEGER,
        },
        participants: {
            type: DataTypes.JSONB,
        },
        ephemeralDuration: {
            type: DataTypes.INTEGER,
        },
        inviteCode: {
            type: DataTypes.STRING,
        },
    };

    public static $options: ModelOptions = {
        tableName: "group_metadata",
        timestamps: false,
        indexes: [
            {
                unique: true,
                name: "group_metadata_unique_id_per_session_id",
                fields: ["sessionId", "id"],
                using: "BTREE",
            },
            {
                name: "group_metadata_sessionId_idx",
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

GroupMetadata.init();

export default GroupMetadata;
