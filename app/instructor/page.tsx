"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useMemo } from "react";
import { useCourses } from "@/lib/hooks/courses";
import { useEnrollments, Enrollment } from "@/lib/hooks/enrollments";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { getInitials } from "@/lib/utils";
import {
  BookOpen,
  Users,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

export default function InstructorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { courses, loading: coursesLoading } = useCourses();
  const { enrollments, loading: enrollmentsLoading, refetch: refetchEnrollments } = useEnrollments();
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.role !== "INSTRUCTOR") {
      router.push("/courses");
    }
  }, [status, session, router]);

  const myCourses = useMemo(
    () => courses.filter((c) => c.instructor.id === session?.user?.id),
    [courses, session]
  );

  const pendingEnrollments = useMemo(
    () => enrollments.filter((e) => e.status === "PENDING"),
    [enrollments]
  );

  async function handleEnrollmentUpdate(enrollmentId: string, status: string) {
    setUpdatingId(enrollmentId);
    try {
      const res = await fetch(`/api/enrollments/${enrollmentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success(`Enrollment ${status === "ACTIVE" ? "approved" : "rejected"}`);
      refetchEnrollments();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update enrollment"
      );
    } finally {
      setUpdatingId(null);
    }
  }

  if (status === "loading" || coursesLoading || enrollmentsLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-custom">
      <div className="px-6 lg:px-12 py-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl lg:text-3xl font-black tracking-tight mb-1">
            Instructor Dashboard
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your courses and student enrollments
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card className="border-border/40">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black">{myCourses.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Courses
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-700">
                <Clock className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black">{pendingEnrollments.length}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Pending
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/40">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black">
                  {enrollments.filter((e) => e.status === "ACTIVE").length}
                </p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Active
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">My Courses</h2>
          {myCourses.length === 0 ? (
            <Card className="border-border/40 p-8 text-center">
              <p className="text-muted-foreground text-sm">
                No courses yet. Create one from the Courses page.
              </p>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {myCourses.map((course) => (
                <Card
                  key={course.id}
                  className="border-border/40 hover:shadow-md transition-shadow cursor-pointer group"
                  onClick={() => router.push(`/instructor/courses/${course.id}`)}
                >
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <BookOpen className="h-4 w-4" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground/30 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">
                      {course.name}
                    </h3>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.studentCount}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {course.chunkCount} chunks
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-lg font-bold mb-4">
            Enrollments
            {pendingEnrollments.length > 0 && (
              <Badge variant="warning" className="ml-2">
                {pendingEnrollments.length} pending
              </Badge>
            )}
          </h2>
          {enrollments.length === 0 ? (
            <Card className="border-border/40 p-8 text-center">
              <p className="text-muted-foreground text-sm">
                No enrollment requests yet.
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {enrollments.map((enrollment) => (
                <Card
                  key={enrollment.id}
                  className="border-border/40"
                >
                  <CardContent className="p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={enrollment.user.image || ""} />
                        <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                          {getInitials(enrollment.user.name, enrollment.user.email)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-bold">
                          {enrollment.user.name || enrollment.user.email}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {enrollment.course.name}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {enrollment.status === "PENDING" ? (
                        <>
                          <Button
                            size="sm"
                            className="rounded-lg font-bold gap-1.5"
                            onClick={() =>
                              handleEnrollmentUpdate(enrollment.id, "ACTIVE")
                            }
                            disabled={updatingId === enrollment.id}
                          >
                            {updatingId === enrollment.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle className="h-3.5 w-3.5" />
                            )}
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-lg font-bold gap-1.5 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30"
                            onClick={() =>
                              handleEnrollmentUpdate(enrollment.id, "REJECTED")
                            }
                            disabled={updatingId === enrollment.id}
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                        </>
                      ) : enrollment.status === "ACTIVE" ? (
                        <Badge variant="success">Approved</Badge>
                      ) : (
                        <Badge variant="destructive">Rejected</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
