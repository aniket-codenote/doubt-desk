import { prisma } from "@/lib/prisma";
import { requireInstructor } from "@/lib/auth/middleware";
import { NextRequest, NextResponse } from "next/server";
import { inngest } from "@/lib/services/inngest";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const authResult = await requireInstructor(request);
  if (authResult.error) return authResult.error;

  const { userId } = authResult;
  const { courseId } = await params;

  try {
    // Verify course ownership
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    if (course.instructorId !== userId) {
      return NextResponse.json(
        { success: false, error: "You are not the owner of this course" },
        { status: 403 }
      );
    }

    // Read the SRT file content from the request body
    const contentType = request.headers.get("content-type") || "";
    let srtContent: string;

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File;
      if (!file) {
        return NextResponse.json(
          { success: false, error: "No file provided" },
          { status: 400 }
        );
      }
      srtContent = await file.text();
    } else {
      const body = await request.json();
      srtContent = body.srtContent;
    }

    if (!srtContent || typeof srtContent !== "string") {
      return NextResponse.json(
        { success: false, error: "SRT content is required" },
        { status: 400 }
      );
    }

    // Fire Inngest event for async processing
    await inngest.send({
      name: "transcript.uploaded",
      data: {
        courseId,
        srtContent,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Transcript uploaded. Processing will begin shortly.",
    });
  } catch (error) {
    console.error("Error uploading transcript:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload transcript" },
      { status: 500 }
    );
  }
}
