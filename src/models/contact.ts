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

class Contact extends Model {
    declare pkId: number;
    declare sessionId: string;
    declare id: string | null;
    declare name: string | null;
    declare notify: string | null;
    declare verifiedName: string | null;
    declare imgUrl: string | null;
    declare status: string | null;

    public static options: InitOptions = {
        sequelize,
        timestamps: false,
        indexes: [
            {
                unique: true,
                name: "contact_unique_id_per_session_id",
                fields: ["sessionId", "id"],
                using: "BTREE",
            },
            {
                name: "contact_sessionId_idx",
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
        },
        name: {
            type: DataTypes.STRING,
        },
        notify: {
            type: DataTypes.STRING,
        },
        verifiedName: {
            type: DataTypes.STRING,
        },
        imgUrl: {
            type: DataTypes.STRING,
        },
        status: {
            type: DataTypes.STRING,
        },
    };

    public static $options: ModelOptions = {
        tableName: "contact",
        timestamps: false,
        indexes: [
            {
                unique: true,
                name: "contact_unique_id_per_session_id",
                fields: ["sessionId", "id"],
                using: "BTREE",
            },
            {
                name: "contact_sessionId_idx",
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

Contact.init();

export default Contact;
