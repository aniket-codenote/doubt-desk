"use client";

import { useState } from "react";
import { useCourses, Course } from "@/lib/hooks/courses";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Plus,
  BookOpen,
  Users,
  FileText,
  Loader2,
  GraduationCap,
  Search,
} from "lucide-react";

function getStatusBadge(status: string | null) {
  switch (status) {
    case "ACTIVE":
      return <Badge variant="success">Enrolled</Badge>;
    case "PENDING":
      return <Badge variant="warning">Pending</Badge>;
    case "REJECTED":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return null;
  }
}

export default function CoursesPage() {
  const { data: session } = useSession();
  const { courses, loading, refetch } = useCourses();
  const [searchQuery, setSearchQuery] = useState("");
  const [enrollingId, setEnrollingId] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [createForm, setCreateForm] = useState({ name: "", description: "" });
  const [creating, setCreating] = useState(false);
  const router = useRouter();

  const isInstructor = session?.user?.role === "INSTRUCTOR";

  const filteredCourses = courses.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  async function handleEnroll(courseId: string) {
    setEnrollingId(courseId);
    try {
      const res = await fetch(`/api/courses/${courseId}/enroll`, {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Enrollment requested!");
      refetch();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to enroll"
      );
    } finally {
      setEnrollingId(null);
    }
  }

  async function handleCreate() {
    if (!createForm.name.trim()) {
      toast.error("Course name is required");
      return;
    }
    setCreating(true);
    try {
      const res = await fetch("/api/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(createForm),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Course created!");
      setShowCreateDialog(false);
      setCreateForm({ name: "", description: "" });
      refetch();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create course"
      );
    } finally {
      setCreating(false);
    }
  }

  function handleCourseClick(course: Course) {
    if (course.enrollmentStatus === "ACTIVE") {
      router.push(`/courses/${course.id}`);
    } else if (isInstructor && course.instructor.id === session?.user?.id) {
      router.push(`/instructor/courses/${course.id}`);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-custom">
      <div className="w-full flex flex-col min-h-full">
        <div className="sticky top-0 bg-background/80 backdrop-blur-xl z-20 border-b border-border/10 px-6 lg:px-12 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="shrink-0">
              <h1 className="text-2xl lg:text-3xl font-black tracking-tight mb-0.5">
                Courses
              </h1>
              <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-60">
                {filteredCourses.length}{" "}
                {filteredCourses.length === 1 ? "course" : "courses"} available
              </p>
            </div>

            <div className="hidden md:flex flex-1 justify-center max-w-xl group">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/30 group-focus-within:text-primary transition-colors" />
                <Input
                  placeholder="Search courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-11 rounded-full border-border/40 bg-muted/20 focus-visible:ring-primary/20 placeholder:text-muted-foreground/30 font-medium"
                />
              </div>
            </div>

            {isInstructor && (
              <Button
                onClick={() => setShowCreateDialog(true)}
                className="rounded-full h-11 px-6 shadow-xl shadow-primary/10 transition-all hover:scale-105 active:scale-95 font-bold"
              >
                <Plus className="mr-2 h-5 w-5" />
                <span className="hidden sm:inline">Create Course</span>
                <span className="sm:hidden">Create</span>
              </Button>
            )}
          </div>
        </div>

        <div className="px-8 lg:px-12 py-6 flex-1">
          {filteredCourses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <GraduationCap className="h-16 w-16 text-muted-foreground/20 mb-4" />
              <h3 className="text-lg font-bold mb-1">No courses found</h3>
              <p className="text-sm text-muted-foreground">
                {isInstructor
                  ? "Create your first course to get started."
                  : "Check back later for available courses."}
              </p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <Card
                  key={course.id}
                  className="group hover:shadow-lg hover:shadow-primary/5 transition-all duration-300 cursor-pointer border-border/40"
                  onClick={() => handleCourseClick(course)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 text-primary shrink-0">
                        <BookOpen className="h-5 w-5" />
                      </div>
                      {getStatusBadge(course.enrollmentStatus)}
                    </div>
                    <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
                      {course.name}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground font-medium">
                      By {course.instructor.name || course.instructor.email}
                    </p>
                    {course.description && (
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {course.studentCount} students
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3.5 w-3.5" />
                        {course.chunkCount} chunks
                      </span>
                    </div>

                    {!course.enrollmentStatus &&
                      course.instructor.id !== session?.user?.id && (
                        <Button
                          className="w-full rounded-lg font-bold"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEnroll(course.id);
                          }}
                          disabled={enrollingId === course.id}
                        >
                          {enrollingId === course.id ? (
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                          ) : null}
                          Enroll
                        </Button>
                      )}

                    {course.enrollmentStatus === "ACTIVE" && (
                      <Button
                        className="w-full rounded-lg font-bold"
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/courses/${course.id}`);
                        }}
                      >
                        Ask Doubts
                      </Button>
                    )}

                    {isInstructor &&
                      course.instructor.id === session?.user?.id && (
                        <Button
                          className="w-full rounded-lg font-bold"
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/instructor/courses/${course.id}`);
                          }}
                        >
                          Manage
                        </Button>
                      )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
            <DialogDescription>
              Add a new course. You can upload transcripts after creating it.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Course Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Introduction to Machine Learning"
                value={createForm.name}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Brief description of the course"
                value={createForm.description}
                onChange={(e) =>
                  setCreateForm((f) => ({ ...f, description: e.target.value }))
                }
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCreateDialog(false)}
            >
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={creating}>
              {creating && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
