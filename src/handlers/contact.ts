import { BaileysEventEmitter, Contact } from "@adiwajshing/baileys";
import ContactModel from "../models/contact";
import { BaileysEventHandler } from "./types";
import { Op } from "sequelize";
import { Promise as PromiseM } from "bluebird";
import chalk from "chalk";

class ContactHandler {
    private sessionId: string;
    private event: BaileysEventEmitter;

    constructor(sessionId: string, event: BaileysEventEmitter) {
        this.sessionId = sessionId;
        this.event = event;
        this.init();
    }

    private init() {
        this.event.on("contacts.set", this.set);
        this.event.on("contacts.update", this.update);
        this.event.on("contacts.upsert", this.upsert);
    }

    private update: BaileysEventHandler<"contacts.update"> = async (
        updates: Partial<Contact>[]
    ): Promise<void> => {
        for (const update of updates) {
            try {
                await ContactModel.update(
                    {
                        sessionId: this.sessionId,
                        id: update.id,
                        name: update.name,
                        notify: update.notify,
                        verifiedName: update.verifiedName,
                        imgUrl: update.imgUrl,
                        status: update.status,
                    },
                    {
                        where: {
                            sessionId: this.sessionId,
                            id: update.id,
                        },
                    }
                );
            } catch (e) {
                console.log(chalk.redBright.bold(e));
            }
        }
    };

    private upsert: BaileysEventHandler<"contacts.upsert"> = async (
        args: Contact[]
    ): Promise<void> => {
        try {
            await PromiseM.map(args, async (val: Contact) => {
                await ContactModel.upsert(
                    {
                        sessionId: this.sessionId,
                        id: val.id,
                        name: val.name,
                        notify: val.notify,
                        verifiedName: val.verifiedName,
                        imgUrl: val.imgUrl,
                        status: val.status,
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
            console.log(chalk.redBright.bold(e));
        }
    };

    private set: BaileysEventHandler<"contacts.set"> = async (arg: {
        contacts: Contact[];
        isLatest: boolean;
    }): Promise<void> => {
        try {
            const contactIds = arg.contacts.map((val: Contact) => val.id);
            const deleteOldContactIds = (
                await ContactModel.findAll({
                    where: {
                        id: {
                            [Op.notIn]: contactIds,
                        },
                    },
                })
            ).map((val: ContactModel) => val.id);

            const upsertPromises = await PromiseM.map(
                arg.contacts,
                async (val) => {
                    await ContactModel.upsert({
                        sessionId: this.sessionId,
                        id: val.id,
                        name: val.name,
                        notify: val.notify,
                        verifiedName: val.verifiedName,
                        imgUrl: val.imgUrl,
                        status: val.status,
                    });
                }
            );
            await PromiseM.any([
                ...upsertPromises,
                await ContactModel.destroy({
                    where: {
                        id: {
                            [Op.in]: deleteOldContactIds,
                        },
                    },
                }),
            ]);
            console.log(
                chalk.greenBright.bold(
                    {
                        deletedContacts: deleteOldContactIds.length,
                        newContacts: arg.contacts.length,
                    },
                    "Synced contacts"
                )
            );
        } catch (e) {
            console.log(chalk.redBright.bold(e));
        }
    };
}

export default ContactHandler;
