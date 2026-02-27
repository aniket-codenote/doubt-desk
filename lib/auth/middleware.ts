import { auth } from "@/auth";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function requireAuth(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { success: false, error: "Unauthorized. Please sign in to continue." },
        { status: 401 }
      ),
      userId: null,
      user: null,
      session: null,
    };
  }

  return {
    error: null,
    userId: session.user.id,
    user: session.user,
    session: session,
  };
}

export async function requireInstructor(request: NextRequest) {
  const authResult = await requireAuth(request);
  if (authResult.error) return authResult;

  // Check role from session first, fallback to DB
  let role = authResult.user?.role;
  if (!role) {
    const dbUser = await prisma.user.findUnique({
      where: { id: authResult.userId! },
      select: { role: true },
    });
    role = dbUser?.role;
  }

  if (role !== "INSTRUCTOR") {
    return {
      error: NextResponse.json(
        { success: false, error: "Forbidden. Instructor access required." },
        { status: 403 }
      ),
      userId: authResult.userId,
      user: authResult.user,
      session: authResult.session,
    };
  }

  return authResult;
}
