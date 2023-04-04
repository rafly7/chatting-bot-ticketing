import { Boom } from "@hapi/boom";
import P, { Logger } from "pino";
import makeWASocket, {
    MessageRetryMap,
    DisconnectReason,
    fetchLatestBaileysVersion,
    makeInMemoryStore,
    WASocket,
    proto,
    useMultiFileAuthState,
    SignalDataTypeMap,
    initAuthCreds,
    SignalDataSet,
    jidNormalizedUser,
    ConnectionState,
    delay,
} from "@adiwajshing/baileys";
// @ts-ignore
import { useRemoteFileAuthState } from "./core/dbAuth";
import fs from "fs";
import { join } from "path";
import config from "./configs/conf";
import { banner } from "./lib/banner";
import chalk from "chalk";
// import Greetings from "./database/greeting";
import STRINGS from "./lib/db";
import Blacklist from "./database/blacklist";
import clearance from "./core/clearance";
import { start } from "repl";
import format from "string-format";
import resolve from "./core/helper";
import { CreateOptions, Op, Sequelize } from "sequelize";
import Command from "./sidekick/command";
import BotsApp from "./sidekick/sidekick";
import Client from "./sidekick/client";
import { MessageType } from "./sidekick/message-type";
import fsProm from "fs/promises";
import Message from "./models/message";
import { useSession } from "./core/session";
import Session from "./models/session";
import { Greeting } from "./database/greeting";
import Handlers from "./handlers/handlers";
import HandlersSock from "./handlers/handlers";
import Chat from "./models/chat";
import GroupMetadata from "./models/group_metadata";
import Contact from "./models/contact";
import { SessionWA, createSessionOptions } from "./types/session";
import { Response } from "express";
// import { useSession } from "./core/session";
import { toDataURL } from "qrcode";
import Util from "./utils/util";
import { WebSocket } from "ws";
const sequelize: Sequelize = config.DATABASE;
const GENERAL: any = STRINGS.general;
const msgRetryCounterMap: MessageRetryMap = {};
const logger: Logger = P({
    timestamp: () => `,"time":"${new Date().toJSON()}"`,
}).child({});
logger.level = "error";

// the store maintains the data of the WA connection in memory
// can be written out to a file & read from it
// const store = makeInMemoryStore({ logger });
// store?.readFromFile("./session.data.json");
// save every 10s
// setInterval(() => {
//     store?.writeToFile("./session.data.json");
// }, 10_000);

// (async (): Promise<void> => {
//     // console.log(banner);

//     let commandHandler: Map<string, Command> = new Map();

//     console.log(
//         chalk.yellowBright.bold("[INFO] Installing Plugins... Please wait.")
//     );
//     let moduleFiles: string[] = fs
//         .readdirSync(join(__dirname, "modules"))
//         .filter((file) => file.endsWith(".js"));
//     for (let file of moduleFiles) {
//         try {
//             const command: Command = require(join(
//                 __dirname,
//                 "modules",
//                 `${file}`
//             ));
//             console.log(
//                 chalk.magentaBright("[INFO] Successfully imported module"),
//                 chalk.cyanBright.bold(`${file}`)
//             );
//             commandHandler.set(command.name, command);
//         } catch (error) {
//             console.log(
//                 chalk.blueBright.bold("[INFO] Could not import module"),
//                 chalk.redBright.bold(`${file}`)
//             );
//             console.log(`[ERROR] `, error);
//             continue;
//         }
//     }
//     console.log(
//         chalk.green.bold(
//             "[INFO] Plugins Installed Successfully. The bot is ready to use."
//         )
//     );
//     console.log(chalk.yellowBright.bold("[INFO] Connecting to Database."));
//     try {
//         await sequelize.authenticate();
//         console.log(
//             chalk.greenBright.bold(
//                 "[INFO] Connection has been established successfully."
//             )
//         );
//     } catch (error) {
//         console.error("[ERROR] Unable to connect to the database:", error);
//     }
//     console.log(chalk.yellowBright.bold("[INFO] Syncing Database..."));
//     await sequelize.sync();
//     console.log(
//         chalk.greenBright.bold(
//             "[INFO] All models were synchronized successfully."
//         )
//     );

//     await sequelize.sync();
//     console.log(
//         chalk.greenBright.bold(
//             "[INFO] All models were synchronized successfully."
//         )
//     );

//     let firstInit: boolean = true;

//     const startSock = async () => {
//         // @ts-ignore
//         // const { state, saveCreds } = await useMultiFileAuthState(
//         //     "auth_info_baileys_deleted"
//         // );
//         // const { state, saveCreds } = await useRemoteFileAuthState();
//         const { state, saveCreds } = await useSession("rafly");
//         const { version, isLatest } = await fetchLatestBaileysVersion();
//         console.log(">>>ISLATEST>>>");
//         console.log(isLatest);
//         console.log(version);
//         console.log(">>>ISLATEST>>>");
//         const sock: WASocket = makeWASocket({
//             version,
//             logger,
//             printQRInTerminal: true,
//             auth: state,
//             browser: ["Samantha-Ticketing", "Chrome", "4.0.0"],
//             msgRetryCounterMap,
//             // implement to handle retries
//             getMessage: async (key: proto.IMessageKey) => {
//                 const data = await Message.findOne({
//                     where: {
//                         id: key.id,
//                         remoteJid: key.remoteJid,
//                         sessionId: "rafly",
//                     },
//                 });

//                 return (data?.message || undefined) as
//                     | proto.IMessage
//                     | undefined;
//             },
//         });

//         // store?.bind(sock.ev);

//         let client: Client = new Client(sock, null);
//         new HandlersSock("rafly", sock.ev).listen();

//         sock.ev.process(async (events) => {
//             //         console.log(">>>>>>11>>>>>>>");
//             //         console.log(events);
//             //         console.log(">>>>>>22>>>>>>>");
//             if (events["connection.update"]) {
//                 const update = events["connection.update"];
//                 const { connection, lastDisconnect } = update;
//                 if (connection === "close") {
//                     if (
//                         (lastDisconnect?.error as Boom)?.output?.statusCode !==
//                         DisconnectReason.loggedOut
//                     ) {
//                         startSock();
//                     } else {
//                         // await fsProm.unlink(join("BotsApp.sqlite"));
//                         // await fsProm.unlink(join("session.data.json"));
//                         new HandlersSock("rafly", sock.ev).unlisten();
//                         await Session.drop();
//                         await Message.drop();
//                         await Chat.drop();
//                         await GroupMetadata.drop();
//                         await Contact.drop();
//                         console.log(
//                             chalk.redBright(
//                                 "Connection closed. You are logged out. Delete the BotsApp.db and session.data.json files to rescan the code."
//                             )
//                         );
//                         process.exit(0);
//                     }
//                 } else if (connection === "connecting") {
//                     console.log(
//                         chalk.yellowBright("[INFO] Connecting to WhatsApp...")
//                     );
//                 } else if (connection === "open") {
//                     console.log(
//                         chalk.greenBright.bold(
//                             "[INFO] Connected! Welcome to BotsApp"
//                         )
//                     );
//                 }
//             }
//             if (events["creds.update"]) {
//                 await saveCreds();
//             }
//             if (events["messages.upsert"]) {
//                 const upsert = events["messages.upsert"];
//                 // console.log(JSON.stringify(upsert, undefined, 2));
//                 if (upsert.type !== "notify") {
//                     return;
//                 }
//                 for (const msg of upsert.messages) {
//                     let chat: proto.IWebMessageInfo = msg;
//                     console.log(msg);
//                     let BotsApp: BotsApp = await resolve(chat, sock);
//                     console.log(BotsApp);
//                     if (BotsApp.isCmd) {
//                         let isBlacklist: boolean =
//                             await Blacklist.getBlacklistUser(
//                                 BotsApp.sender!,
//                                 BotsApp.chatId!
//                             );
//                         const cleared: boolean | void = await clearance(
//                             BotsApp,
//                             client,
//                             isBlacklist
//                         );
//                         if (!cleared) {
//                             return;
//                         }
//                         const reactionMessage = {
//                             react: {
//                                 text: "🪄",
//                                 key: chat.key,
//                             },
//                         };
//                         await sock.sendMessage(
//                             chat!.key!.remoteJid!,
//                             reactionMessage
//                         );
//                         console.log(
//                             chalk.redBright.bold(
//                                 `[INFO] ${BotsApp.commandName} command executed.`
//                             )
//                         );
//                         const command = commandHandler.get(
//                             BotsApp.commandName!
//                         );
//                         let args = BotsApp.body?.trim().split(/\s+/).slice(1);
//                         console.log(args);
//                         if (!command) {
//                             client.sendMessage(
//                                 BotsApp.chatId!,
//                                 "```Woops, invalid command! Use```  *.help*  ```to display the command list.```",
//                                 MessageType.text
//                             );
//                             return;
//                         } else if (command && BotsApp.commandName == "help") {
//                             try {
//                                 command.handle(
//                                     client,
//                                     chat,
//                                     BotsApp,
//                                     args,
//                                     commandHandler
//                                 );
//                                 return;
//                             } catch (err) {
//                                 console.log(chalk.red("[ERROR] ", err));
//                                 return;
//                             }
//                         }
//                         try {
//                             await command
//                                 .handle(client, chat, BotsApp, args)
//                                 .catch((err: any) =>
//                                     console.log("[ERROR] " + err)
//                                 );
//                         } catch (err) {
//                             console.log(chalk.red("[ERROR] ", err));
//                         }
//                     }
//                 }
//             }
//         });

//         return sock;
//     };

//     startSock();
//     process.on("SIGINT", async function () {
//         console.log("Caught interrupt signal");
//         // await fsProm.unlink("BotsApp.sqlite");
//         // await fsProm.unlink("session.data.json");
//         // await Session.drop();
//         // await Greeting.drop();
//         // await Message.drop();
//         // await Chat.drop();
//         // await GroupMetadata.drop();
//         // await Contact.drop();
//         process.exit();
//     });
// })().catch((err) => console.log("[MAINERROR] : %s", chalk.redBright.bold(err)));

const sessions = new Map<string, SessionWA>();
const retries = new Map<string, number>();

class WASession {
    public async init() {
        const sessions = await Session.findAll({
            where: {
                id: {
                    [Op.iLike]: `'%${Util.SESSION_CONFIG_ID}'`,
                },
            },
            raw: true,
        });
        for (const { sessionId, data } of sessions) {
            const { readIncomingMessages, ...socketConfig } = JSON.parse(data);
            this.createSession({
                sessionId,
                readIncomingMessages,
                socketConfig,
            });
        }
    }

    private socket: WASocket | null = null;

    private connectionState: Partial<ConnectionState> = { connection: "close" };

    private RECONNECT_INTERVAL: number = Number(
        process.env.RECONNECT_INTERVAL || 0
    );
    public MAX_RECONNECT_RETRIES = Number(
        process.env.MAX_RECONNECT_RETRIES || 5
    );

    public async createSession(options: createSessionOptions): Promise<void> {
        const {
            sessionId,
            res,
            SSE = false,
            readIncomingMessages = false,
            socketConfig,
        } = options;
        const configID = `${Util.SESSION_CONFIG_ID}-${sessionId}`;
        // let connectionState: Partial<ConnectionState> = { connection: "close" };
        const { state, saveCreds } = await useSession("rafly");
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(chalk.cyanBright.bold(JSON.stringify(socketConfig)));
        this.socket = makeWASocket({
            version,
            logger,
            printQRInTerminal: true,
            auth: state,
            browser: ["Samantha-Ticketing", "Chrome", "4.0.0"],
            msgRetryCounterMap,
            ...socketConfig,
            // implement to handle retries
            getMessage: async (key: proto.IMessageKey) => {
                const data = await Message.findOne({
                    where: {
                        id: key.id,
                        remoteJid: key.remoteJid,
                        sessionId: sessionId,
                    },
                });

                return (data?.message || undefined) as
                    | proto.IMessage
                    | undefined;
            },
        });
        const store = new HandlersSock(sessionId, this.socket.ev);
        store.listen();
        sessions.set(sessionId, {
            ...this.socket,
            store,
            destroy: () => this.destroy(true, sessionId),
            // destroy: this.destroy,
        });

        console.log(chalk.cyanBright.bold(">>>>>>>>>>>>"));
        console.log(chalk.cyanBright.bold(sessions.get(sessionId)));
        console.log(chalk.cyanBright.bold(">>>>>>>>>>>>"));

        this.socket.ev.on("creds.update", saveCreds);
        this.socket.ev.on("connection.update", async (update) => {
            this.connectionState = update;
            const { connection } = update;

            if (connection === "open") {
                retries.delete(sessionId);
                // SSEQRGenerations.delete(sessionId);
            }
            if (connection === "close") {
                this.handleConnectionClose(options);
            }
            await this.handleNormalConnectionUpdate(res!, options.sessionId);
        });

        if (readIncomingMessages) {
            this.socket.ev.on("messages.upsert", async (m) => {
                const message = m.messages[0];
                if (message.key.fromMe || m.type !== "notify") return;

                await Util.delay(1000);
                await this.socket!.readMessages([message.key]);
            });
        }

        await Session.upsert(
            {
                id: configID,
                sessionId: sessionId,
                data: JSON.stringify({ readIncomingMessages, ...socketConfig }),
            },
            {
                conflictWhere: {
                    sessionId: sessionId,
                    id: configID,
                },
            }
        );
    }

    private destroy = async (logout = true, sessionId: string) => {
        try {
            await Promise.all([
                logout && this.socket?.logout(),
                Session.destroy({
                    where: {
                        sessionId: sessionId,
                    },
                }),
                Chat.destroy({
                    where: {
                        sessionId: sessionId,
                    },
                }),
                Contact.destroy({
                    where: {
                        sessionId: sessionId,
                    },
                }),
                Message.destroy({
                    where: {
                        sessionId: sessionId,
                    },
                }),
                GroupMetadata.destroy({
                    where: {
                        sessionId: sessionId,
                    },
                }),
            ]);
        } catch (e) {
            logger.error(e, "An error occured during session destroy");
        } finally {
            sessions.delete(sessionId);
        }
    };

    private handleConnectionClose = async (options: createSessionOptions) => {
        const code = (this.connectionState.lastDisconnect?.error as Boom)
            ?.output?.statusCode;
        const restartRequired = code === DisconnectReason.restartRequired;
        const doNotReconnect = !this.shouldReconnect(options.sessionId);

        if (code === DisconnectReason.loggedOut || doNotReconnect) {
            if (options.res) {
                !options.res.headersSent &&
                    options.res
                        .status(500)
                        .json({ error: "Unable to create session" });
                options.res.end();
            }
            await this.destroy(doNotReconnect, options.sessionId);
            return;
        }

        if (!restartRequired) {
            console.log(
                chalk.greenBright.bold(
                    JSON.stringify({
                        attempts: retries.get(options.sessionId) ?? 1,
                        sessionId: options.sessionId,
                    }),
                    "Reconnecting..."
                )
            );
        }
        setTimeout(
            async () => await this.createSession(options),
            restartRequired ? 0 : this.RECONNECT_INTERVAL
        );
    };

    private shouldReconnect(sessionId: string) {
        let attempts = retries.get(sessionId) ?? 0;

        if (attempts < this.MAX_RECONNECT_RETRIES) {
            attempts += 1;
            retries.set(sessionId, attempts);
            return true;
        }
        return false;
    }

    private handleNormalConnectionUpdate = async (
        res: Response,
        sessionId: string
    ) => {
        if (this.connectionState.qr?.length) {
            if (res && !res.headersSent) {
                try {
                    const qr = await toDataURL(this.connectionState.qr);
                    res.status(200).json({ qr });
                    return;
                } catch (e) {
                    logger.error(e, "An error occured during QR generation");
                    res.status(500).json({ error: "Unable to generate QR" });
                }
            }
            this.destroy(true, sessionId);
        }
    };

    public sessionExists = (sessionId: string): boolean => {
        return sessions.has(sessionId);
    };

    public deleteSession = async (sessionId: string): Promise<void> => {
        const sess: SessionWA | undefined = sessions.get(sessionId);
        if (sess !== undefined) {
            return await sess.destroy();
        }
        return;
    };

    public getSessionStatus(session: SessionWA): string {
        const state = [
            "CONNECTING",
            "CONNECTED",
            "DISCONNECTING",
            "DISCONNECTED",
        ];
        console.log(
            chalk.cyanBright.bold((sessions as unknown as WebSocket).readyState)
        );
        let status = state[(session.ws as WebSocket).readyState];
        console.log(chalk.cyanBright.bold(status));
        console.log(chalk.cyanBright.bold(session.user));
        status = session.user ? "AUTHENTICATED" : status;
        return status;
    }

    public listSession() {
        const list = Array.from(sessions.entries()).map(([id, session]) => {
            return {
                id,
                status: this.getSessionStatus(session),
            };
        });
        console.log(chalk.cyanBright.bold(sessions.size));
        console.log(chalk.cyanBright.bold(list));
        return list;
    }

    public getSession = (sessionId: string): SessionWA | undefined => {
        return sessions.get(sessionId);
    };

    public jidExists = async (
        session: SessionWA,
        jid: string,
        type: "group" | "number" = "number"
    ) => {
        try {
            // s
            if (type === "number") {
                const [result] = await session.onWhatsApp(jid);
                return !!result?.exists;
            }

            const groupMeta = await session.groupMetadata(jid);
            return !!groupMeta.id;
        } catch (e) {
            return Promise.reject(e);
        }
    };
}

export default WASession;
