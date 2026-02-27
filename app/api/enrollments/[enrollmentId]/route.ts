import { prisma } from "@/lib/prisma";
import { requireInstructor } from "@/lib/auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ enrollmentId: string }> }
) {
  const authResult = await requireInstructor(request);
  if (authResult.error) return authResult.error;

  const { userId } = authResult;
  const { enrollmentId } = await params;

  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !["ACTIVE", "REJECTED"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status must be ACTIVE or REJECTED" },
        { status: 400 }
      );
    }

    // Verify enrollment exists and instructor owns the course
    const enrollment = await prisma.enrollment.findUnique({
      where: { id: enrollmentId },
      include: {
        course: {
          select: { instructorId: true },
        },
      },
    });

    if (!enrollment) {
      return NextResponse.json(
        { success: false, error: "Enrollment not found" },
        { status: 404 }
      );
    }

    if (enrollment.course.instructorId !== userId) {
      return NextResponse.json(
        { success: false, error: "You are not the owner of this course" },
        { status: 403 }
      );
    }

    const updated = await prisma.enrollment.update({
      where: { id: enrollmentId },
      data: { status },
    });

    return NextResponse.json({ enrollment: updated });
  } catch (error) {
    console.error("Error updating enrollment:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update enrollment" },
      { status: 500 }
    );
  }
}
