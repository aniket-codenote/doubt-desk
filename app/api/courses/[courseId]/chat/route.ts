import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import {
  classifyIntent,
  generateEmbedding,
  searchTranscriptChunks,
  generateGroundedAnswer,
} from "@/lib/services/rag";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const authResult = await requireAuth(request);
  if (authResult.error) return authResult.error;

  const { userId } = authResult;
  const { courseId } = await params;

  try {
    // Verify enrollment status = ACTIVE
    const enrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId!,
          courseId,
        },
      },
    });

    if (!enrollment || enrollment.status !== "ACTIVE") {
      return NextResponse.json(
        { success: false, error: "You must have active enrollment to ask questions." },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { question } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { success: false, error: "Question is required" },
        { status: 400 }
      );
    }

    const trimmedQuestion = question.trim();
    if (!trimmedQuestion) {
      return NextResponse.json(
        { success: false, error: "Question is required" },
        { status: 400 }
      );
    }

    let intentResult = { intent: "course_question", response: "" };
    try {
      intentResult = await classifyIntent(trimmedQuestion);
    } catch (intentError) {
      console.error("Intent classification failed:", intentError);
    }

    if (intentResult.intent !== "course_question") {
      return NextResponse.json({
        answer:
          intentResult.response ||
          "I can help with questions about the course content. Ask me anything from the transcript.",
        references: [],
      });
    }

    // Generate embedding for the question
    const questionEmbedding = await generateEmbedding(trimmedQuestion);

    // Search for relevant transcript chunks (filtered by courseId)
    const chunks = await searchTranscriptChunks(courseId, questionEmbedding, 5);

    if (chunks.length === 0) {
      return NextResponse.json({
        answer: "This is not covered in the transcript.",
        references: [],
      });
    }

    // Generate grounded answer using Gemini
    const response = await generateGroundedAnswer(question, chunks);

    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in chat:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process question" },
      { status: 500 }
    );
  }
}
