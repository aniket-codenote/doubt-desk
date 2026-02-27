import { prisma } from "@/lib/prisma";
import { requireAuth, requireInstructor } from "@/lib/auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult.error) return authResult.error;

  const { userId } = authResult;

  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: { id: true, name: true, email: true, image: true },
        },
        enrollments: {
          where: { userId: userId! },
          select: { id: true, status: true },
        },
        _count: {
          select: { enrollments: true, chunks: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = courses.map((course) => ({
      id: course.id,
      name: course.name,
      description: course.description,
      instructor: course.instructor,
      enrollmentStatus: course.enrollments[0]?.status || null,
      enrollmentId: course.enrollments[0]?.id || null,
      studentCount: course._count.enrollments,
      chunkCount: course._count.chunks,
      createdAt: course.createdAt,
    }));

    return NextResponse.json({ courses: formatted });
  } catch (error) {
    console.error("Error fetching courses:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const authResult = await requireInstructor(request);
  if (authResult.error) return authResult.error;

  const { userId } = authResult;

  try {
    const body = await request.json();
    const { name, description } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { success: false, error: "Course name is required" },
        { status: 400 }
      );
    }

    const course = await prisma.course.create({
      data: {
        name: name.trim(),
        description: description?.trim() || null,
        instructorId: userId!,
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error) {
    console.error("Error creating course:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create course" },
      { status: 500 }
    );
  }
}
