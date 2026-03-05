import express, { Router } from "express";
import Groq from "groq-sdk";
import { RAGChat } from "../controllers/rag.chat.controller.js";

const chatRouter = Router();


// chatRouter.post("/chat", async (req, res) => {

//   const { message } = req.body;

//   const queryEmbedding = await createEmbedding(message);

//   const results = await search(queryEmbedding);

//   const context = results.map(r => r.content).join("\n");

//   const completion = await groq.chat.completions.create({
//     model: "llama-3.1-8b-instant",
//     messages: [
//       {
//         role: "system",
//         content: `Answer questions about Pritam using this context:

// ${context}`
//       },
//       {
//         role: "user",
//         content: message
//       }
//     ]
//   });

//   res.json({
//     reply: completion.choices[0].message.content
//   });

// });

chatRouter.route("/chat").post(RAGChat);

export default chatRouter;