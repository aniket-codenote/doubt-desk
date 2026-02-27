import { prisma } from "@/lib/prisma";
import { requireInstructor } from "@/lib/auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authResult = await requireInstructor(request);
  if (authResult.error) return authResult.error;

  const { userId } = authResult;

  try {
    // Get enrollments for all courses owned by this instructor
    const enrollments = await prisma.enrollment.findMany({
      where: {
        course: {
          instructorId: userId!,
        },
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, image: true },
        },
        course: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ enrollments });
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch enrollments" },
      { status: 500 }
    );
  }
}
