import { prisma } from "@/lib/prisma";
import { requireAuth } from "@/lib/auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  const authResult = await requireAuth(request);
  if (authResult.error) return authResult.error;

  const { userId } = authResult;
  const { courseId } = await params;

  try {
    // Verify course exists
    const course = await prisma.course.findUnique({
      where: { id: courseId },
    });

    if (!course) {
      return NextResponse.json(
        { success: false, error: "Course not found" },
        { status: 404 }
      );
    }

    // Check if already enrolled
    const existing = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: userId!,
          courseId,
        },
      },
    });

    if (existing) {
      if (existing.status === "REJECTED") {
        return NextResponse.json(
          { success: false, error: "Your enrollment request was rejected. You cannot re-request." },
          { status: 403 }
        );
      }
      return NextResponse.json(
        { success: false, error: "You have already requested enrollment for this course." },
        { status: 409 }
      );
    }

    const enrollment = await prisma.enrollment.create({
      data: {
        userId: userId!,
        courseId,
        status: "PENDING",
      },
    });

    return NextResponse.json({ enrollment }, { status: 201 });
  } catch (error) {
    console.error("Error creating enrollment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create enrollment" },
      { status: 500 }
    );
  }
}
