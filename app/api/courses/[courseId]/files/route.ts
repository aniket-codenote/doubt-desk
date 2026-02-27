import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const authResult = await requireAuth(request);
  if (authResult.error) return authResult.error;

  const { courseId } = await params;

  try {
    const files = await prisma.transcriptFile.findMany({
      where: { courseId },
      include: {
        _count: {
          select: { chunks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = files.map((f) => ({
      id: f.id,
      fileName: f.fileName,
      fileSize: f.fileSize,
      status: f.status,
      chunkCount: f._count.chunks,
      createdAt: f.createdAt,
    }));

    return NextResponse.json({ files: formatted });
  } catch (error) {
    console.error("Error fetching transcript files:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch transcript files" },
      { status: 500 }
    );
  }
}
