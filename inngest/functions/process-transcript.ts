import { inngest } from "@/lib/services/inngest";
import { prisma } from "@/lib/prisma";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const EMBEDDING_MODEL = "gemini-embedding-001";

interface SrtBlock {
  index: number;
  startTime: number;
  endTime: number;
  content: string;
}

function parseTimestamp(timestamp: string): number {
  const parts = timestamp.trim().split(":");
  const hours = parseInt(parts[0], 10);
  const minutes = parseInt(parts[1], 10);
  const secParts = parts[2].split(/[,.]/);
  const seconds = parseInt(secParts[0], 10);
  const millis = parseInt(secParts[1], 10);
  return hours * 3600 + minutes * 60 + seconds + millis / 1000;
}

function parseSubtitles(content: string): SrtBlock[] {
  const blocks: SrtBlock[] = [];
  const normalized = content.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const cleaned = normalized.replace(/^WEBVTT[^\n]*\n(\n|[A-Z-]+:.*\n)*/i, "");
  const rawBlocks = cleaned.split(/\n\n+/).filter((b) => b.trim());

  const timeRegex = /(\d{2}:\d{2}:\d{2}[,.]\d{3})\s*-->\s*(\d{2}:\d{2}:\d{2}[,.]\d{3})/;

  let idx = 0;
  for (const raw of rawBlocks) {
    const lines = raw.trim().split("\n");
    if (lines.length < 2) continue;

    let timeLineIdx = -1;
    for (let i = 0; i < lines.length; i++) {
      if (timeRegex.test(lines[i])) {
        timeLineIdx = i;
        break;
      }
    }
    if (timeLineIdx === -1) continue;

    const timeMatch = lines[timeLineIdx].match(timeRegex);
    if (!timeMatch) continue;

    const startTime = parseTimestamp(timeMatch[1]);
    const endTime = parseTimestamp(timeMatch[2]);
    const textContent = lines.slice(timeLineIdx + 1).join(" ").replace(/<[^>]+>/g, "").trim();

    if (textContent) {
      idx++;
      blocks.push({ index: idx, startTime, endTime, content: textContent });
    }
  }

  return blocks;
}

interface MergedChunk {
  startTime: number;
  endTime: number;
  content: string;
}

function mergeChunks(blocks: SrtBlock[], targetWordCount: number = 200): MergedChunk[] {
  const chunks: MergedChunk[] = [];
  let currentChunk: MergedChunk | null = null;
  let currentWordCount = 0;

  for (const block of blocks) {
    const blockWords = block.content.split(/\s+/).length;

    if (!currentChunk) {
      currentChunk = {
        startTime: block.startTime,
        endTime: block.endTime,
        content: block.content,
      };
      currentWordCount = blockWords;
    } else if (currentWordCount + blockWords <= targetWordCount) {
      currentChunk.endTime = block.endTime;
      currentChunk.content += " " + block.content;
      currentWordCount += blockWords;
    } else {
      chunks.push(currentChunk);
      currentChunk = {
        startTime: block.startTime,
        endTime: block.endTime,
        content: block.content,
      };
      currentWordCount = blockWords;
    }
  }

  if (currentChunk) {
    chunks.push(currentChunk);
  }

  return chunks;
}

async function generateEmbedding(text: string): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  const result = await model.embedContent(text);
  return result.embedding.values;
}

function formatEmbeddingForPg(embedding: number[]): string {
  return `[${embedding.join(",")}]`;
}

export const processTranscript = inngest.createFunction(
  { id: "process-transcript" },
  { event: "transcript.uploaded" },
  async ({ event, step }) => {
    const { courseId, srtContent, transcriptFileId } = event.data as {
      courseId: string;
      srtContent: string;
      transcriptFileId?: string;
    };

    try {
      const blocks = await step.run("parse-subtitles", async () => {
        const parsed = parseSubtitles(srtContent);
        if (parsed.length === 0) {
          throw new Error("No valid subtitle blocks found in content");
        }
        return parsed;
      });

      const chunks = await step.run("merge-chunks", async () => {
        return mergeChunks(blocks, 200);
      });

      await step.run("generate-embeddings-and-store", async () => {
        for (const chunk of chunks) {
          const record = await prisma.transcriptChunk.create({
            data: {
              courseId,
              transcriptFileId: transcriptFileId || null,
              startTime: chunk.startTime,
              endTime: chunk.endTime,
              content: chunk.content,
            },
          });

          const embedding = await generateEmbedding(chunk.content);
          const embeddingStr = formatEmbeddingForPg(embedding);

          await prisma.$executeRawUnsafe(
            `UPDATE "TranscriptChunk" SET embedding = $1::vector WHERE id = $2`,
            embeddingStr,
            record.id
          );
        }

        if (transcriptFileId) {
          await prisma.transcriptFile.update({
            where: { id: transcriptFileId },
            data: { status: "processed" },
          });
        }
      });

      return {
        success: true,
        courseId,
        chunksProcessed: chunks.length,
      };
    } catch (error) {
      if (transcriptFileId) {
        try {
          await prisma.transcriptFile.update({
            where: { id: transcriptFileId },
            data: { status: "error" },
          });
        } catch (updateError) {
          console.error("Failed to mark transcript file as error:", updateError);
        }
      }

      console.error("Transcript processing failed:", error);
      throw error;
    }
  }
);
