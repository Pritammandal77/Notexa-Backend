import Groq from "groq-sdk";
import { asyncHandler } from "../utils/asyncHandler.js";
import { createEmbedding } from "../utils/RAG-Utils/embeddings.js";
import { search } from "../utils/RAG-Utils/vectorStore.js";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY
});

export const RAGChat = asyncHandler(async (req, res) => {

    const { message } = req.body;

    const queryEmbedding = await createEmbedding(message);

    const results = await search(queryEmbedding);

    const context = results.map(r => r.content).join("\n");

    const completion = await groq.chat.completions.create({
        model: "llama-3.1-8b-instant",
        messages: [
            {
                role: "system",
                content: `
You are Notexa AI assistant.

Answer ONLY from the given context.
If the answer is not in the context, say:
"I don't have information about that."

Context:
${context}
`
            },
            {
                role: "user",
                content: message
            }
        ]
    });

    res.json({
        reply: completion.choices[0].message.content
    });

});