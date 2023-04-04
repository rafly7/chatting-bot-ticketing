import app, { urlencoded, raw, json } from "express";
import type { Express } from "express";

const router: Express = app();

router.use(json());
router.use(urlencoded({ extended: true }));
router.use(raw());

export default router;
