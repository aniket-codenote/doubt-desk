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
  Trash2,
} from "lucide-react";
import Link from "next/link";

interface CourseDetail {
  id: string;
  name: string;
  description: string | null;
  chunkCount: number;
  studentCount: number;
}

interface TranscriptFileInfo {
  id: string;
  fileName: string;
  fileSize: number;
  status: string;
  chunkCount: number;
  createdAt: string;
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
  const [uploadFiles, setUploadFiles] = useState<
    { name: string; status: "pending" | "uploading" | "done" | "error" }[]
  >([]);
  const [transcriptFiles, setTranscriptFiles] = useState<TranscriptFileInfo[]>(
    []
  );

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

  const fetchTranscriptFiles = useCallback(async () => {
    try {
      const res = await fetch(`/api/courses/${courseId}/files`);
      if (!res.ok) throw new Error("Failed to fetch files");
      const data = await res.json();
      setTranscriptFiles(data.files);
    } catch (error) {
      console.error("Error fetching transcript files:", error);
    }
  }, [courseId]);

  useEffect(() => {
    if (status === "authenticated") {
      fetchCourse();
      fetchTranscriptFiles();
    }
  }, [status, fetchCourse, fetchTranscriptFiles]);

  async function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const fileList = e.target.files;
    if (!fileList || fileList.length === 0) return;

    const files = Array.from(fileList);

    const invalidFiles = files.filter(
      (f) => !f.name.endsWith(".srt") && !f.name.endsWith(".vtt")
    );
    if (invalidFiles.length > 0) {
      toast.error(
        `Invalid file(s): ${invalidFiles.map((f) => f.name).join(", ")}. Only .srt and .vtt files are supported.`
      );
      return;
    }

    setUploading(true);
    setUploadFiles(files.map((f) => ({ name: f.name, status: "pending" })));

    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];

      setUploadFiles((prev) =>
        prev.map((f, idx) => (idx === i ? { ...f, status: "uploading" } : f))
      );

      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch(`/api/courses/${courseId}/upload`, {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error);

        setUploadFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: "done" } : f))
        );
        successCount++;
      } catch (error) {
        setUploadFiles((prev) =>
          prev.map((f, idx) => (idx === i ? { ...f, status: "error" } : f))
        );
        errorCount++;
        toast.error(
          `Failed to upload ${file.name}: ${error instanceof Error ? error.message : "Unknown error"}`
        );
      }
    }

    setUploading(false);
    e.target.value = "";

    if (successCount > 0) {
      toast.success(
        `${successCount} transcript${successCount > 1 ? "s" : ""} uploaded! Processing will begin shortly.`
      );
      setTimeout(() => {
        fetchCourse();
        fetchTranscriptFiles();
      }, 3000);
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  }

  const allDone =
    uploadFiles.length > 0 &&
    uploadFiles.every((f) => f.status === "done" || f.status === "error");
  const isIdle = !uploading && uploadFiles.length === 0;

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
            <h1 className="text-2xl font-black tracking-tight">
              {course.name}
            </h1>
            {course.description && (
              <p className="text-sm text-muted-foreground">
                {course.description}
              </p>
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

        <Card className="border-border/40 mb-8">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="h-5 w-5 text-primary" />
              Upload Transcripts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="border-2 border-dashed border-border/60 rounded-xl p-8 text-center hover:border-primary/40 transition-colors">
              {uploading || (allDone && !isIdle) ? (
                <div className="flex flex-col items-center gap-4 w-full">
                  {uploading && (
                    <div className="flex items-center gap-2 mb-1">
                      <Loader2 className="h-5 w-5 animate-spin text-primary" />
                      <p className="text-sm font-medium">
                        Uploading{" "}
                        {uploadFiles.filter((f) => f.status === "done").length +
                          1}{" "}
                        of {uploadFiles.length}...
                      </p>
                    </div>
                  )}
                  {allDone && (
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <p className="text-sm font-medium text-emerald-700">
                        {uploadFiles.filter((f) => f.status === "done").length}{" "}
                        of {uploadFiles.length} uploaded successfully!
                      </p>
                    </div>
                  )}
                  <div className="w-full max-w-sm space-y-2 text-left">
                    {uploadFiles.map((f, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-muted/50"
                      >
                        {f.status === "uploading" && (
                          <Loader2 className="h-3 w-3 animate-spin text-primary shrink-0" />
                        )}
                        {f.status === "done" && (
                          <CheckCircle className="h-3 w-3 text-emerald-500 shrink-0" />
                        )}
                        {f.status === "error" && (
                          <span className="h-3 w-3 rounded-full bg-red-500 shrink-0 inline-block" />
                        )}
                        {f.status === "pending" && (
                          <span className="h-3 w-3 rounded-full bg-border shrink-0 inline-block" />
                        )}
                        <span className="truncate">{f.name}</span>
                      </div>
                    ))}
                  </div>
                  {allDone && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => setUploadFiles([])}
                    >
                      Upload more
                    </Button>
                  )}
                </div>
              ) : (
                <>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mx-auto mb-4">
                    <FileText className="h-6 w-6" />
                  </div>
                  <p className="text-sm font-medium mb-1">
                    Drop or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    Supports .srt and .vtt formats
                  </p>
                  <label>
                    <input
                      type="file"
                      accept=".srt,.vtt"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                    <Button
                      asChild
                      className="rounded-full px-6 font-bold cursor-pointer"
                    >
                      <span>Choose Files</span>
                    </Button>
                  </label>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {transcriptFiles.length > 0 && (
          <Card className="border-border/40">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-primary" />
                Uploaded Transcripts
              </CardTitle>
              <CardDescription>
                {transcriptFiles.length} file
                {transcriptFiles.length !== 1 ? "s" : ""} uploaded
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="divide-y divide-border/40">
                {transcriptFiles.map((file) => (
                  <div
                    key={file.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                        <FileText className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(file.fileSize)} · {file.chunkCount}{" "}
                          chunks
                        </p>
                      </div>
                    </div>
                    <Badge
                      variant={
                        file.status === "processed"
                          ? "default"
                          : file.status === "error"
                            ? "destructive"
                            : "secondary"
                      }
                      className="shrink-0 text-[10px]"
                    >
                      {file.status === "processed"
                        ? "Processed"
                        : file.status === "error"
                          ? "Error"
                          : "Processing"}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
