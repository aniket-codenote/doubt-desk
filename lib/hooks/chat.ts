"use client";

import { useState, useCallback } from "react";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  references?: Array<{
    startTime: number;
    endTime: number;
    content: string;
  }>;
}

export function useChat(courseId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(
    async (question: string) => {
      const userMessage: ChatMessage = {
        id: Date.now().toString(),
        role: "user",
        content: question,
      };
      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      try {
        const res = await fetch(`/api/courses/${courseId}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to get answer");
        }

        const assistantMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.answer,
          references: data.references,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        const errorMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Something went wrong. Please try again.",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setLoading(false);
      }
    },
    [courseId]
  );

  return { messages, loading, sendMessage };
}

export type { ChatMessage };
