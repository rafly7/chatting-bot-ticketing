import { Router } from "express";
import type { Request, Response } from "express";
import WASession from "../wa";
import { SessionWA } from "../types/session";
import { proto } from "@adiwajshing/baileys";
import SessionController from "../controllers/session";
import MessageController from "../controllers/message";

const router: Router = Router();

const sess = new WASession();
const sessController = new SessionController();
const messageController = new MessageController();
router.post("/session", (req: Request, res: Response, next: Function) =>
    sessController.addSession(req, res, next, sess)
);
router.delete(
    "/session/:sessionId",
    (req: Request, res: Response, next: Function) =>
        sessController.deleteSession(req, res, next, sess)
);

router.get("/session", async (req: Request, res: Response, next: Function) =>
    sessController.getAllSession(req, res, next, sess)
);

router.post(
    "/message/reminder-absensi/:sessionId",
    async (req: Request, res: Response, next: Function) =>
        messageController.reminderAbsence(req, res, next, sess)
);

router.post(
    "/message/:sessionId",
    async (req: Request, res: Response, next: Function) => {
        try {
            const waSession = new WASession();
            const {
                jid,
                type = "number",
                message,
                options,
                mentions = [],
            } = req.body;
            const session: SessionWA | undefined = waSession.getSession(
                req.params.sessionId
            )!;

            if (session === undefined) {
                return res
                    .status(400)
                    .json({ error: "session does not exists" });
            }
            const exists = await waSession.jidExists(session, jid, type);
            if (!exists) {
                return res.status(400).json({ error: "JID does not exists" });
            }
            const buttons = [
                {
                    buttonId: "id1",
                    buttonText: { displayText: "Button 1" },
                    type: 1,
                },
            ];

            const btnText: proto.Message.ButtonsMessage.Button.IButtonText = {
                displayText: "Test",
            };
            const btnType: proto.Message.ButtonsMessage.Button.Type = 1;
            // const btn: proto.Message.ButtonsMessage.IButton = {
            //     buttonId: "id1",
            //     buttonText: btnText,
            //     type: btnType,
            // };
            const urlBtn: proto.HydratedTemplateButton.IHydratedURLButton = {
                displayText: "Web Samantha Apps",
                url: "https://apps.samantha.id",
            };
            const btn: proto.IHydratedTemplateButton = {
                urlButton: urlBtn,
                index: 1,
            };

            // const btns: proto.Message.ButtonsMessage.IButton[] = [];
            const btns: proto.IHydratedTemplateButton[] = [];
            btns.push(btn);

            // const buttonMessage = {
            //     text: "Hi it's button message",
            //     footer: "Hello World",
            //     buttons: buttons,
            //     headerType: 1,
            // };
            const result = await session.sendMessage(jid, {
                text:
                    "Selamat siang Pak Gilang, Pak Dwi, Pak Andih, dan Pak Rizki Damanhuri ngin mengingatkan untuk absen hari ini di mobile app samantha atau melalui website dibawah ini,\n\n" +
                    "Abaikan pesan ini jika merasa sedang cuti atau sakit,\n" +
                    "Terimakasih",
                footer: "Testing By Bot Samantha",
                templateButtons: btns,
                mentions: mentions,
            });
            res.status(200).json(result);
        } catch (e) {
            res.status(400).json({ error: "Failed list session" });
        }
    }
);

export default router;
