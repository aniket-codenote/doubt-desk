"use client";

import { useState, useEffect, useCallback } from "react";

interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
  };
  course: {
    id: string;
    name: string;
  };
}

export function useEnrollments() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEnrollments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/enrollments");
      if (!res.ok) throw new Error("Failed to fetch enrollments");
      const data = await res.json();
      setEnrollments(data.enrollments);
    } catch (error) {
      console.error("Error fetching enrollments:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEnrollments();
  }, [fetchEnrollments]);

  return { enrollments, loading, refetch: fetchEnrollments };
}

export type { Enrollment };
