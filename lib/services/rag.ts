import { GoogleGenerativeAI } from "@google/generative-ai";
import { prisma } from "@/lib/prisma";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const EMBEDDING_MODEL = "gemini-embedding-001";
const GENERATION_MODEL = "gemini-2.5-flash-lite";

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

export function formatEmbeddingForPg(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

interface TranscriptChunkResult {
  id: string;
  courseId: string;
  startTime: number;
  endTime: number;
  content: string;
  similarity: number;
}

export async function searchTranscriptChunks(
  courseId: string,
  embedding: number[],
  limit: number = 5
): Promise<TranscriptChunkResult[]> {
  const embeddingStr = formatEmbeddingForPg(embedding);

  const chunks = await prisma.$queryRaw<TranscriptChunkResult[]>`
    SELECT id, "courseId", "startTime", "endTime", content,
           1 - (embedding <=> ${embeddingStr}::vector) as similarity
    FROM "TranscriptChunk"
    WHERE "courseId" = ${courseId}
      AND embedding IS NOT NULL
    ORDER BY embedding <=> ${embeddingStr}::vector ASC
    LIMIT ${limit}
  `;

  return chunks;
}

const SYSTEM_PROMPT = `You are a teaching assistant. Your ONLY job is to answer questions using the provided transcript excerpts.

STRICT RULES:
1. Answer ONLY using information from the provided transcript excerpts.
2. If the answer is NOT found in the excerpts, respond EXACTLY with: "This is not covered in the transcript."
3. Include timestamp references in format [MM:SS - MM:SS] for every claim you make.
4. Do NOT use any external knowledge.
5. Do NOT make assumptions or inferences beyond what is stated in the excerpts.
6. Do NOT hallucinate any information.
7. Keep answers concise and directly grounded in the transcript text.`;

interface ChatResponse {
  answer: string;
  references: Array<{
    startTime: number;
    endTime: number;
    content: string;
  }>;
}

export async function generateGroundedAnswer(
  question: string,
  chunks: TranscriptChunkResult[]
): Promise<ChatResponse> {
  const model = genAI.getGenerativeModel({
    model: GENERATION_MODEL,
    generationConfig: {
      temperature: 0.2,
    },
  });

  const excerpts = chunks
    .map((chunk, i) => {
      const startMin = Math.floor(chunk.startTime / 60);
      const startSec = Math.floor(chunk.startTime % 60);
      const endMin = Math.floor(chunk.endTime / 60);
      const endSec = Math.floor(chunk.endTime % 60);
      const timeRange = `${startMin.toString().padStart(2, "0")}:${startSec.toString().padStart(2, "0")} - ${endMin.toString().padStart(2, "0")}:${endSec.toString().padStart(2, "0")}`;
      return `[Excerpt ${i + 1}] [${timeRange}]\n${chunk.content}`;
    })
    .join("\n\n");

  const prompt = `${SYSTEM_PROMPT}

TRANSCRIPT EXCERPTS:
${excerpts}

STUDENT QUESTION:
${question}

Provide your answer. Include timestamp references [MM:SS - MM:SS] for every claim.`;

  const result = await model.generateContent(prompt);
  const answer = result.response.text();

  return {
    answer,
    references: chunks.map((c) => ({
      startTime: c.startTime,
      endTime: c.endTime,
      content: c.content,
    })),
  };
}
