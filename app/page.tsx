import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { BookOpen, MessageSquare, Shield, Clock } from "lucide-react";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/courses");
  }

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero */}
      <section className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold mb-8">
            <BookOpen className="h-4 w-4" />
            Transcript-Grounded Q&A
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6 bg-gradient-to-br from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
            Ask Doubts.
            <br />
            Get Grounded Answers.
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-10 leading-relaxed">
            Upload course transcripts. Students ask questions. Get answers strictly
            from the transcript — with exact timestamp references. No hallucination.
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href="/api/auth/signin"
              className="inline-flex items-center justify-center rounded-full h-12 px-8 bg-primary text-primary-foreground font-bold shadow-xl shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105 active:scale-95"
            >
              Get Started
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="pb-20 px-6">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          {[
            {
              icon: Shield,
              title: "Strict Grounding",
              desc: "Every answer comes from transcript content only. No external knowledge, no hallucination.",
            },
            {
              icon: Clock,
              title: "Timestamp References",
              desc: "Every answer includes exact timestamps so students can jump to the relevant part of the lecture.",
            },
            {
              icon: MessageSquare,
              title: "Access Control",
              desc: "Instructors approve student access. Only enrolled students can ask questions.",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/40 bg-card p-8 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 text-primary mb-5">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
