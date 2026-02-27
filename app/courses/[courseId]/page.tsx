"use client";

import { useState, useRef, useEffect, use } from "react";
import { useChat, ChatMessage } from "@/lib/hooks/chat";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { formatTimestamp } from "@/lib/utils";
import {
  Send,
  Loader2,
  MessageSquare,
  Clock,
  BookOpen,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

export default function CourseDoubtsPage({
  params,
}: {
  params: Promise<{ courseId: string }>;
}) {
  const { courseId } = use(params);
  const { messages, loading, sendMessage } = useChat(courseId);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    sendMessage(input.trim());
    setInput("");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)]">
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-xl px-6 py-3 flex items-center gap-4">
        <Link href="/courses">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary">
            <BookOpen className="h-4 w-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold">Ask Doubts</h2>
            <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
              Transcript-grounded answers
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-custom px-6 py-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mb-4">
              <MessageSquare className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-bold mb-2">Ask your first doubt</h3>
            <p className="text-sm text-muted-foreground max-w-md">
              Type a question below. Answers will be grounded strictly in the
              course transcript with timestamp references.
            </p>
          </div>
        )}

        <div className="max-w-3xl mx-auto space-y-6">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] ${
                  msg.role === "user"
                    ? "bg-primary text-primary-foreground rounded-2xl rounded-br-md px-5 py-3"
                    : "space-y-3"
                }`}
              >
                {msg.role === "user" ? (
                  <p className="text-sm font-medium">{msg.content}</p>
                ) : (
                  <>
                    <Card className="border-border/40 p-5">
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {msg.content}
                      </p>
                    </Card>

                    {msg.references && msg.references.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground pl-1">
                          Transcript References
                        </p>
                        {msg.references.map((ref, i) => (
                          <div
                            key={i}
                            className="rounded-xl border border-border/30 bg-muted/30 px-4 py-3"
                          >
                            <div className="flex items-center gap-1.5 text-xs text-primary font-semibold mb-1.5">
                              <Clock className="h-3 w-3" />
                              {formatTimestamp(ref.startTime)} -{" "}
                              {formatTimestamp(ref.endTime)}
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-3">
                              {ref.content}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="flex items-center gap-2 bg-muted/50 rounded-2xl px-5 py-3">
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
                <span className="text-sm text-muted-foreground">
                  Searching transcript...
                </span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border/40 bg-background/80 backdrop-blur-xl px-6 py-4">
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto flex items-center gap-3"
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a doubt about this course..."
            className="flex-1 h-12 rounded-full px-5 border-border/40 bg-muted/20 focus-visible:ring-primary/20 font-medium"
            disabled={loading}
          />
          <Button
            type="submit"
            size="icon"
            className="h-12 w-12 rounded-full shadow-lg shadow-primary/20 shrink-0"
            disabled={loading || !input.trim()}
          >
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
}
