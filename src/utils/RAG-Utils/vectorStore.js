import fs from "fs";
import path from "path";
import { createEmbedding } from "./embeddings.js";

const DATA_PATH = "./data";

export let documents = [];

export async function loadDocuments() {
  const files = fs.readdirSync(DATA_PATH);

  for (const file of files) {
    const content = fs.readFileSync(
      path.join(DATA_PATH, file),
      "utf8"
    );

    const embedding = await createEmbedding(content);

    documents.push({
      content,
      embedding
    });
  }

  console.log("Documents embedded:", documents.length);
}

function cosineSimilarity(a, b) {
  let dot = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}

export async function search(queryEmbedding) {
  const scores = documents.map(doc => ({
    content: doc.content,
    score: cosineSimilarity(queryEmbedding, doc.embedding)
  }));

  scores.sort((a, b) => b.score - a.score);

  return scores.slice(0, 3);
}