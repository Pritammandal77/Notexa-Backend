import { Router } from "express";
import { RAGChat } from "../controllers/rag.chat.controller.js";

const chatRouter = Router();

chatRouter.route("/chat").post(RAGChat);

export default chatRouter;