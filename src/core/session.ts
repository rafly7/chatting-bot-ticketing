import type {
    AuthenticationCreds,
    SignalDataSet,
    SignalDataTypeMap,
} from "@adiwajshing/baileys";
import { proto } from "@adiwajshing/baileys";
import { BufferJSON, initAuthCreds } from "@adiwajshing/baileys";
import Session from "../models/session";
import chalk from "chalk";

const fixId = (file: string) => {
    var _a;
    return (_a =
        file === null || file === void 0
            ? void 0
            : file.replace(/\//g, "__")) === null || _a === void 0
        ? void 0
        : _a.replace(/:/g, "-");
};
export async function useSession(sessionId: string) {
    const write = async (data: any, id: string) => {
        try {
            await Session.upsert(
                {
                    data: JSON.stringify(data, BufferJSON.replacer),
                    id: fixId(id),
                    sessionId: sessionId,
                },
                {
                    conflictWhere: {
                        sessionId: sessionId,
                        id: id,
                    },
                }
            );
        } catch (e) {
            console.log(chalk.greenBright.bold(e));
            //   logger!.error(e, 'An error occured during session write');
        }
    };

    const read = async (id: string) => {
        try {
            const sess = await Session.findOne({
                where: {
                    sessionId: sessionId,
                    id: fixId(id),
                },
                raw: true,
            });
            if (sess !== null) {
                return JSON.parse(sess?.data!, BufferJSON.reviver);
            }
            return null;
        } catch (e) {
            console.log(chalk.yellowBright.bold(e));
            return null;
        }
    };

    const del = async (id: string) => {
        try {
            await Session.destroy({
                where: {
                    sessionId: sessionId,
                    id: fixId(id),
                },
            });
        } catch (e) {
            console.log(chalk.redBright.bold(e));
        }
    };

    const creds: AuthenticationCreds = (await read("creds")) || initAuthCreds();

    return {
        state: {
            creds,
            keys: {
                get: async (type: keyof SignalDataTypeMap, ids: string[]) => {
                    const data: {
                        [key: string]: SignalDataTypeMap[typeof type];
                    } = {};
                    await Promise.all(
                        ids.map(async (id: string) => {
                            let value = await read(`${type}-${id}`);
                            if (type === "app-state-sync-key" && value) {
                                value =
                                    proto.Message.AppStateSyncKeyData.fromObject(
                                        value
                                    );
                            }
                            data[id] = value;
                        })
                    );
                    return data;
                },
                set: async (data: any) => {
                    const tasks = [];
                    for (const category in data) {
                        for (const id in data[category]) {
                            const value = data[category][id];
                            const file = `${category}-${id}`;
                            tasks.push(value ? write(value, file) : del(file));
                        }
                    }
                    await Promise.all(tasks);
                },
            },
        },
        saveCreds: () => write(creds, "creds"),
    };
}
