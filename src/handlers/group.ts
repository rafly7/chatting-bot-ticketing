import {
    BaileysEventEmitter,
    GroupMetadata,
    ParticipantAction,
} from "@adiwajshing/baileys";
import { BaileysEventHandler } from "./types";
import GroupMetadataM from "../models/group_metadata";
import chalk from "chalk";

class GroupHandler {
    private sessionId: string;
    private event: BaileysEventEmitter;

    constructor(sessionId: string, event: BaileysEventEmitter) {
        this.sessionId = sessionId;
        this.event = event;
    }

    public listen() {
        this.event.on("groups.upsert", this.upsert);
        this.event.on("groups.update", this.update);
        this.event.on("group-participants.update", this.participantUpdate);
    }

    public unlisten() {
        this.event.off("groups.upsert", this.upsert);
        this.event.off("groups.update", this.update);
        this.event.off("group-participants.update", this.participantUpdate);
    }

    private upsert: BaileysEventHandler<"groups.upsert"> = async (
        datas: GroupMetadata[]
    ) => {
        try {
            for (const data of datas) {
                await GroupMetadataM.upsert(
                    {
                        sessionId: this.sessionId,
                        id: data.id,
                        owner: data.owner,
                        subject: data.subject,
                        subjectOwner: data.subjectOwner,
                        subjectTime: data.subjectTime,
                        creation: data.creation,
                        desc: data.desc,
                        descOwner: data.descOwner,
                        descId: data.descId,
                        restrict: data.restrict,
                        announce: data.announce,
                        size: data.size,
                        participants: data.participants,
                        ephemeralDuration: data.ephemeralDuration,
                    },
                    {
                        conflictWhere: {
                            sessionId: this.sessionId,
                            id: data.id,
                            subject: data.subject,
                        },
                    }
                );
            }
        } catch (e) {
            console.log(chalk.redBright.bold("[groups.upsert] ", e));
        }
    };

    private update: BaileysEventHandler<"groups.update"> = async (
        datas: Partial<GroupMetadata>[]
    ) => {
        for (const data of datas) {
            try {
                await GroupMetadataM.update(
                    {
                        sessionId: this.sessionId,
                        id: data.id,
                        owner: data.owner,
                        subject: data.subject,
                        subjectOwner: data.subjectOwner,
                        subjectTime: data.subjectTime,
                        creation: data.creation,
                        desc: data.desc,
                        descOwner: data.descOwner,
                        descId: data.descId,
                        restrict: data.restrict,
                        announce: data.announce,
                        size: data.size,
                        participants: data.participants,
                        ephemeralDuration: data.ephemeralDuration,
                    },
                    {
                        where: {
                            sessionId: this.sessionId,
                            id: data.id,
                            subject: data.subject,
                        },
                    }
                );
            } catch (e) {
                console.log(chalk.redBright.bold("[groups.update] ", e));
            }
        }
    };

    private participantUpdate: BaileysEventHandler<"group-participants.update"> =
        async (arg: {
            id: string;
            participants: string[];
            action: ParticipantAction;
        }) => {};
}

export default GroupHandler;
