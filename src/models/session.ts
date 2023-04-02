import {
    DataTypes,
    InitOptions,
    Model,
    ModelAttributes,
    ModelOptions,
    Sequelize,
} from "sequelize";

import config from "../configs/conf";

const sequelize: Sequelize = config.DATABASE;

class Session extends Model {
    declare pkId: number;
    declare sessionId: string;
    declare id: string;
    declare data: string;

    public static options: InitOptions = {
        sequelize,
        timestamps: false,
        indexes: [
            {
                unique: true,
                name: "session_unique_id_per_session_id",
                fields: ["sessionId", "id"],
                using: "BTREE",
            },
            {
                name: "session_sessionId_idx",
                fields: ["sessionId"],
                using: "BTREE",
            },
        ],
    };

    private static attributes: ModelAttributes = {
        pkId: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false,
        },
        sessionId: {
            type: DataTypes.STRING(512),
            allowNull: false,
        },
        id: {
            type: DataTypes.STRING(512),
            allowNull: false,
        },
        data: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
    };

    private static $options: ModelOptions = {
        tableName: "session",
        timestamps: false,
        indexes: [
            {
                unique: true,
                name: "session_unique_id_per_session_id",
                fields: ["sessionId", "id"],
                using: "BTREE",
            },
            {
                name: "session_sessionId_idx",
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

Session.init();

export default Session;
