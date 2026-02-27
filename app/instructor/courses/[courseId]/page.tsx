"use client";

import { useState, useEffect, useCallback, use } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  ArrowLeft,
  BookOpen,
  Users,
} from "lucide-react";
import Link from "next/link";

interface CourseDetail {
  id: string;
  name: string;
  description: string | null;
  chunkCount: number;
  studentCount: number;
}

export default function InstructorCoursePage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const { data: session, status } = useSession();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const fetchCourse = useCallback(async () => {
    try {
      const res = await fetch("/api/courses");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      const found = data.courses.find((c: any) => c.id === courseId);
      if (found) {
        setCourse({
          id: found.id,
          name: found.name,
          description: found.description,
          chunkCount: found.chunkCount,
          studentCount: found.studentCount,
        });
      }
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCourse();
    }
  }, [status, fetchCourse]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".srt") && !file.name.endsWith(".vtt")) {
      toast.error("Please upload an SRT or VTT file");
      return;
    }

    setUploading(true);
    setUploadSuccess(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch(`/api/courses/${courseId}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setUploadSuccess(true);
      toast.success("Transcript uploaded! Processing will begin shortly.");

      e.target.value = "";

      setTimeout(() => {
        fetchCourse();
      }, 3000);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to upload transcript"
      );
    } finally {
      setUploading(false);
    }
  }

  if (loading || status === "loading") {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center">
        <h3 className="text-lg font-bold mb-1">Course not found</h3>
        <p className="text-sm text-muted-foreground mb-4">
          This course may have been deleted.
        </p>
        <Link href="/instructor">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto scrollbar-custom">
      <div className="px-6 lg:px-12 py-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/instructor">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-black tracking-tight">{course.name}</h1>
            {course.description && (
              <p className="text-sm text-muted-foreground">{course.description}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-8">
          <Card className="border-border/40">
            <CardContent className="p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black">{course.chunkCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Transcript Chunks
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
                <p className="text-2xl font-black">{course.studentCount}</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Students
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-border/40">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Transcript
            </CardTitle>
            <CardDescription>
              Upload a subtitle file (.srt or .vtt). The system will parse it, create
              logical chunks, generate embeddings, and store them for Q&A.
              {course.chunkCount > 0 && (
                <span className="block mt-1 text-amber-600 font-medium">
                  Note: Uploading a new file will replace existing transcript data.
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center hover:border-primary/40 transition-colors">
              {uploading ? (
                <div className="flex flex-col items-center gap-3">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-medium">Uploading transcript...</p>
                </div>
              ) : uploadSuccess ? (
                <div className="flex flex-col items-center gap-3">
                  <CheckCircle className="h-8 w-8 text-emerald-500" />
                  <p className="text-sm font-medium text-emerald-700">
                    Upload successful! Processing in background...
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Chunks will appear shortly after processing completes.
                  </p>
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                    <FileText className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium mb-1">
                    Drop a subtitle file here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Supports SubRip (.srt) and WebVTT (.vtt) formats
                  </p>
                  <label>
                    <input
                      type="file"
                      accept=".srt,.vtt"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button asChild className="rounded-full px-6 font-bold cursor-pointer">
                      <span>Choose File</span>
                    </Button>
                  </label>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
