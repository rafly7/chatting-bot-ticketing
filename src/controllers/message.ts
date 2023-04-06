import { Request, Response } from "express";
import WASession from "../wa";
import { proto } from "@adiwajshing/baileys";
import { SessionWA } from "../types/session";

class MessageController {
    public async reminderAbsence(
        req: Request,
        res: Response,
        next: Function,
        client: WASession
    ) {
        try {
            const {
                jid,
                type = "number",
                persons = [],
                mentions = [],
            } = req.body;
            if (client === undefined) {
                return res
                    .status(400)
                    .json({ error: "session does not exists" });
            }
            const sess: SessionWA | undefined = client.getSession(
                req.params.sessionId
            )!;
            // const urlBtn: proto.HydratedTemplateButton.IHydratedURLButton = {
            //     displayText: "Web Samantha Apps",
            //     url: "https://apps.samantha.id",
            // };
            const btn1: proto.IHydratedTemplateButton = {
                urlButton: {
                    displayText: "Website Samantha",
                    url: "https://apps.samantha.id",
                },
                index: 1,
            };
            const btn2: proto.IHydratedTemplateButton = {
                urlButton: {
                    displayText: "Android Mobile Samantha",
                    url: "https://play.google.com/store/apps/details?id=net.smm.flutter_samantha",
                },
                index: 2,
            };
            const btn3: proto.IHydratedTemplateButton = {
                callButton: {
                    displayText: "Rafly",
                    phoneNumber: "6289611322917",
                },
                index: 3,
            };
            const btns: proto.IHydratedTemplateButton[] = [];
            btns.push(btn1);
            btns.push(btn2);
            btns.push(btn3);
            // btns.push(btn4);
            // btns.push(btn5);
            const msgBtn = await sess.sendMessage(jid, {
                text:
                    `Selamat siang ingin mengingatkan untuk absen hari ini di mobile app samantha atau melalui website dibawah ini,\n\n` +
                    "Abaikan pesan ini jika merasa sedang cuti atau sakit,\n" +
                    "Jika ada pertanyaan terkait app silahkan tekan button dibawah ini,\n" +
                    "Terimakasih.",
                footer: "Samantha",
                templateButtons: btns,
                mentions: mentions,
            });
            const msgMentions = await sess.sendMessage(jid, {
                text: "",
                mentions: mentions,
            });
            res.status(200).json({ msgBtn, msgMentions });
        } catch (e) {
            res.status(400).json({
                error: "Failed send message reminder absensce",
            });
        }
    }
}

export default MessageController;
