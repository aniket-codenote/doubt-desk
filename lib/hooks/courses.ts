"use client";

import { useState, useEffect, useCallback } from "react";

interface Course {
  id: string;
  name: string;
  description: string | null;
  instructor: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  enrollmentStatus: string | null;
  enrollmentId: string | null;
  studentCount: number;
  chunkCount: number;
  createdAt: string;
}

export function useCourses() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/courses");
      if (res.status === 401) {
        setCourses([]);
        return;
      }
      if (!res.ok) throw new Error("Failed to fetch courses");
      const data = await res.json();
      setCourses(data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, refetch: fetchCourses };
}

export type { Course };
