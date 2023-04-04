import express from "express";
import type { Express } from "express";
import appMiddleware from "./middlewares/middleware";
import appRouters from "./routers";
import { createServer } from "http";

const app: Express = express();

app.use(appMiddleware);
app.use(appRouters);

export default createServer(app);
