import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  BookOpen,
  MessageSquare,
  Shield,
  Clock,
  Upload,
  Search,
  ArrowRight,
  Play,
  Zap,
  CheckCircle2,
  FileText,
  Users,
} from "lucide-react";
import HomeSigninButton from "@/components/home-signin-button";

export default async function HomePage() {
  const session = await auth();

  if (session?.user) {
    redirect("/courses");
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@300;400;500&display=swap');

        :root {
          --purple: #6366f1;
          --purple-dark: #4f46e5;
          --purple-light: #818cf8;
          --purple-bg: #eef2ff;
          --purple-bg-2: #e0e7ff;
          --purple-border: #c7d2fe;
          --surface: #ffffff;
          --surface-2: #f8f9fc;
          --border: #e5e7eb;
          --border-2: #d1d5db;
          --text: #0f1117;
          --text-2: #374151;
          --text-muted: #6b7280;
          --text-faint: #9ca3af;
          --green: #10b981;
          --green-bg: #d1fae5;
          --red-bg: #fee2e2;
        }

        .dd-page {
          font-family: 'Geist', system-ui, sans-serif;
          background: var(--surface);
          color: var(--text);
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
        }

        .dd-hero {
          padding: 80px 24px 64px;
          text-align: center;
          max-width: 900px;
          margin: 0 auto;
        }

        .dd-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border-radius: 999px;
          background: var(--purple-bg);
          border: 1px solid var(--purple-border);
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--purple);
          letter-spacing: 0.01em;
          margin-bottom: 28px;
        }

        .dd-hero h1 {
          font-size: clamp(2.25rem, 5vw, 3.5rem);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: var(--text);
          margin-bottom: 20px;
        }

        .dd-hero h1 .accent { color: var(--purple); }

        .dd-hero p {
          font-size: 1.0625rem;
          line-height: 1.7;
          color: var(--text-muted);
          max-width: 540px;
          margin: 0 auto 36px;
        }

        .dd-cta-group {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          flex-wrap: wrap;
          margin-bottom: 56px;
        }

        .dd-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 24px;
          border-radius: 8px;
          background: var(--purple);
          color: #fff;
          font-weight: 600;
          font-size: 0.9375rem;
          text-decoration: none;
          transition: background 0.15s, box-shadow 0.15s, transform 0.1s;
          box-shadow: 0 1px 3px rgba(99,102,241,0.3), 0 4px 16px rgba(99,102,241,0.2);
        }
        .dd-btn-primary:hover {
          background: var(--purple-dark);
          box-shadow: 0 4px 20px rgba(99,102,241,0.4);
          transform: translateY(-1px);
        }

        .dd-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 8px;
          border: 1.5px solid var(--border-2);
          color: var(--text-2);
          font-weight: 500;
          font-size: 0.9375rem;
          text-decoration: none;
          background: var(--surface);
          transition: border-color 0.15s, color 0.15s;
        }
        .dd-btn-ghost:hover { border-color: var(--purple); color: var(--purple); }

        .dd-demo-wrapper { max-width: 680px; margin: 0 auto; }

        .dd-demo {
          border-radius: 12px;
          border: 1.5px solid var(--border);
          background: var(--surface);
          box-shadow: 0 4px 6px -1px rgba(0,0,0,0.04), 0 16px 48px -8px rgba(0,0,0,0.1);
          overflow: hidden;
        }

        .dd-demo-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          border-bottom: 1px solid var(--border);
          background: var(--surface-2);
        }

        .dd-demo-dots { display: flex; gap: 5px; }
        .dd-demo-dot { width: 10px; height: 10px; border-radius: 50%; }

        .dd-demo-course {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          color: var(--text-muted);
        }

        .dd-demo-body { padding: 16px; display: flex; flex-direction: column; gap: 12px; }

        .dd-msg { display: flex; gap: 8px; align-items: flex-start; }
        .dd-msg.student { justify-content: flex-end; }
        .dd-msg.student .dd-bubble {
          background: var(--purple);
          color: #fff;
          border-color: var(--purple);
          border-radius: 16px 4px 16px 16px;
        }

        .dd-avatar {
          width: 28px; height: 28px;
          border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-size: 0.625rem; font-weight: 700;
          flex-shrink: 0; margin-top: 2px;
          background: var(--purple-bg);
          color: var(--purple);
          border: 1.5px solid var(--purple-border);
        }

        .dd-bubble {
          max-width: 440px;
          background: var(--surface-2);
          border: 1px solid var(--border);
          border-radius: 4px 16px 16px 16px;
          padding: 10px 14px;
          font-size: 0.8125rem;
          line-height: 1.6;
          color: var(--text-2);
        }
        .dd-bubble strong { color: var(--text); }

        .dd-ts-row {
          display: flex; flex-wrap: wrap;
          align-items: center; gap: 6px;
          margin-top: 8px;
        }

        .dd-ts-chip {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 10px;
          border-radius: 5px;
          background: var(--purple-bg);
          border: 1px solid var(--purple-border);
          font-family: 'Geist Mono', monospace;
          font-size: 0.6875rem;
          color: var(--purple);
          cursor: pointer;
          transition: background 0.15s;
          white-space: nowrap;
        }
        .dd-ts-chip:hover { background: var(--purple-bg-2); }

        .dd-grounded {
          display: inline-flex; align-items: center; gap: 4px;
          padding: 3px 8px; border-radius: 5px;
          background: var(--green-bg); border: 1px solid #6ee7b7;
          font-size: 0.6875rem; font-weight: 500; color: #065f46;
        }

        .dd-demo-input-bar {
          display: flex; align-items: center; gap: 8px;
          margin: 0 16px 16px;
          padding: 9px 14px;
          border-radius: 8px; border: 1.5px solid var(--border);
          background: var(--surface);
        }
        .dd-demo-input-bar span { flex: 1; font-size: 0.8rem; color: var(--text-faint); }
        .dd-demo-send {
          width: 30px; height: 30px; border-radius: 7px;
          background: var(--purple);
          display: flex; align-items: center; justify-content: center;
          color: #fff; flex-shrink: 0;
        }

        .dd-divider { height: 1px; background: var(--border); }

        .dd-stats-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          max-width: 720px;
          margin: 0 auto;
          padding: 48px 24px;
        }

        .dd-stat {
          text-align: center; padding: 0 24px;
          border-right: 1px solid var(--border);
        }
        .dd-stat:last-child { border-right: none; }

        .dd-stat-num {
          font-size: 2rem; font-weight: 800;
          color: var(--purple);
          letter-spacing: -0.03em; line-height: 1; margin-bottom: 6px;
        }
        .dd-stat-label { font-size: 0.8125rem; color: var(--text-muted); line-height: 1.45; }

        .dd-section { padding: 64px 24px; max-width: 1080px; margin: 0 auto; }

        .dd-section-tag {
          display: inline-flex; align-items: center; gap: 6px;
          font-size: 0.75rem; font-weight: 600; color: var(--purple);
          letter-spacing: 0.04em; text-transform: uppercase; margin-bottom: 10px;
        }

        .dd-section-title {
          font-size: clamp(1.625rem, 3vw, 2.25rem); font-weight: 800;
          letter-spacing: -0.025em; color: var(--text);
          margin-bottom: 12px; line-height: 1.2;
        }

        .dd-section-sub {
          font-size: 0.9375rem; color: var(--text-muted);
          line-height: 1.7; max-width: 500px; margin-bottom: 48px;
        }

        .dd-steps { display: flex; flex-direction: column; gap: 32px; }

        .dd-step {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          align-items: center;
          padding: 32px;
          border-radius: 14px;
          border: 1.5px solid var(--border);
          background: var(--surface);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .dd-step:hover { border-color: var(--purple-border); box-shadow: 0 4px 24px rgba(99,102,241,0.08); }
        .dd-step.reverse { direction: rtl; }
        .dd-step.reverse > * { direction: ltr; }

        .dd-step-text { display: flex; flex-direction: column; }

        .dd-step-num {
          font-family: 'Geist Mono', monospace; font-size: 0.6875rem;
          font-weight: 500; color: var(--text-faint); margin-bottom: 10px; letter-spacing: 0.06em;
        }

        .dd-step-icon {
          width: 40px; height: 40px; border-radius: 9px;
          background: var(--purple-bg); border: 1px solid var(--purple-border);
          display: flex; align-items: center; justify-content: center;
          color: var(--purple); margin-bottom: 12px;
        }

        .dd-step h3 { font-size: 1.125rem; font-weight: 700; color: var(--text); margin-bottom: 8px; }
        .dd-step p { font-size: 0.875rem; line-height: 1.7; color: var(--text-muted); }

        .dd-mockup {
          border-radius: 10px;
          border: 1.5px solid var(--border);
          background: var(--surface-2);
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.05);
        }

        .dd-mockup-bar {
          display: flex; align-items: center; gap: 6px;
          padding: 8px 12px;
          border-bottom: 1px solid var(--border);
          background: var(--surface);
        }

        .dd-mockup-dot { width: 8px; height: 8px; border-radius: 50%; }
        .dd-mockup-title {
          flex: 1; text-align: center;
          font-size: 0.6875rem; color: var(--text-faint);
          font-family: 'Geist Mono', monospace;
        }

        .dd-mockup-body { padding: 14px; }

        .dd-upload-zone {
          border: 1.5px dashed var(--purple-border);
          border-radius: 8px;
          background: var(--purple-bg);
          padding: 20px;
          text-align: center;
          margin-bottom: 10px;
        }
        .dd-upload-zone-icon {
          width: 36px; height: 36px; border-radius: 8px;
          background: var(--purple-bg-2);
          border: 1px solid var(--purple-border);
          display: flex; align-items: center; justify-content: center;
          color: var(--purple); margin: 0 auto 8px;
        }
        .dd-upload-zone p { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px; }
        .dd-upload-zone span { font-size: 0.6875rem; color: var(--text-faint); }
        .dd-upload-btn {
          display: inline-flex; padding: 6px 16px; border-radius: 6px;
          background: var(--purple); color: #fff;
          font-size: 0.75rem; font-weight: 600; margin-top: 8px;
        }

        .dd-file-list { display: flex; flex-direction: column; gap: 6px; margin-top: 8px; }
        .dd-file-row {
          display: flex; align-items: center; gap: 8px;
          padding: 7px 10px; border-radius: 7px;
          background: var(--surface); border: 1px solid var(--border);
        }
        .dd-file-icon {
          width: 26px; height: 26px; border-radius: 5px;
          background: var(--purple-bg); border: 1px solid var(--purple-border);
          display: flex; align-items: center; justify-content: center;
          color: var(--purple); flex-shrink: 0;
        }
        .dd-file-info { flex: 1; min-width: 0; }
        .dd-file-name { font-size: 0.75rem; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .dd-file-meta { font-size: 0.6875rem; color: var(--text-faint); }
        .dd-file-badge { font-size: 0.65rem; font-weight: 600; padding: 2px 7px; border-radius: 4px; white-space: nowrap; }
        .dd-file-badge.processed { background: var(--green-bg); color: #065f46; }
        .dd-file-badge.processing { background: #fef3c7; color: #92400e; }
        .dd-file-badge.failed { background: var(--red-bg); color: #991b1b; }

        .dd-chat-mockup-msgs { display: flex; flex-direction: column; gap: 8px; }
        .dd-chat-q {
          align-self: flex-end;
          background: var(--purple); color: #fff;
          border-radius: 12px 3px 12px 12px;
          padding: 8px 12px; font-size: 0.75rem; max-width: 85%;
        }
        .dd-chat-a {
          align-self: flex-start;
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 3px 12px 12px 12px;
          padding: 8px 12px; font-size: 0.75rem; color: var(--text-2); max-width: 92%;
          line-height: 1.55;
        }
        .dd-chat-ts-row { display: flex; gap: 5px; margin-top: 6px; flex-wrap: wrap; }
        .dd-chat-ts {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 2px 7px; border-radius: 4px;
          background: var(--purple-bg); border: 1px solid var(--purple-border);
          font-size: 0.6375rem; color: var(--purple); font-family: 'Geist Mono', monospace;
        }
        .dd-chat-verified {
          display: inline-flex; align-items: center; gap: 3px;
          padding: 2px 7px; border-radius: 4px;
          background: var(--green-bg); border: 1px solid #6ee7b7;
          font-size: 0.6375rem; color: #065f46;
        }
        .dd-chat-input-row {
          display: flex; align-items: center; gap: 6px;
          margin-top: 10px; padding: 7px 10px;
          border-radius: 7px; border: 1.5px solid var(--border);
          background: var(--surface);
        }
        .dd-chat-input-row span { flex: 1; font-size: 0.7rem; color: var(--text-faint); }
        .dd-chat-send {
          width: 24px; height: 24px; border-radius: 5px;
          background: var(--purple);
          display: flex; align-items: center; justify-content: center; color: #fff;
        }

        @media (max-width: 768px) {
          .dd-step { grid-template-columns: 1fr; gap: 20px; }
          .dd-step.reverse { direction: ltr; }
        }

        .dd-features-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .dd-feature-wide { grid-column: span 2; }

        .dd-feature {
          padding: 20px; border-radius: 10px;
          border: 1.5px solid var(--border); background: var(--surface);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .dd-feature:hover { border-color: var(--purple-border); box-shadow: 0 4px 16px rgba(99,102,241,0.06); }

        .dd-feature-icon {
          width: 36px; height: 36px; border-radius: 8px;
          background: var(--purple-bg); border: 1px solid var(--purple-border);
          display: flex; align-items: center; justify-content: center;
          color: var(--purple); margin-bottom: 10px;
        }

        .dd-feature h3 { font-size: 0.9rem; font-weight: 700; color: var(--text); margin-bottom: 4px; }
        .dd-feature p { font-size: 0.8375rem; color: var(--text-muted); line-height: 1.65; }

        .dd-check-list { margin-top: 12px; display: flex; flex-direction: column; gap: 7px; }
        .dd-check-item {
          display: flex; align-items: center; gap: 8px;
          font-size: 0.8125rem; color: var(--text-muted);
        }
        .dd-check-item svg { color: var(--green); flex-shrink: 0; }

        .dd-course-preview {
          background: var(--surface-2);
          border-top: 1px solid var(--border);
          border-bottom: 1px solid var(--border);
          padding: 56px 24px;
        }

        .dd-course-preview-inner { max-width: 1080px; margin: 0 auto; }

        .dd-course-cards {
          display: grid; grid-template-columns: repeat(3, 1fr);
          gap: 14px; margin-top: 32px;
        }

        .dd-course-card {
          background: var(--surface); border: 1.5px solid var(--border);
          border-radius: 10px; padding: 16px;
          display: flex; flex-direction: column; gap: 8px;
        }

        .dd-course-card-top {
          display: flex; align-items: flex-start;
          justify-content: space-between; gap: 8px;
        }

        .dd-course-icon {
          width: 32px; height: 32px; border-radius: 7px;
          background: var(--purple-bg); border: 1px solid var(--purple-border);
          display: flex; align-items: center; justify-content: center;
          color: var(--purple); flex-shrink: 0;
        }

        .dd-badge {
          font-size: 0.6875rem; font-weight: 600;
          padding: 3px 9px; border-radius: 5px;
        }
        .dd-badge.enrolled { background: var(--green-bg); color: #065f46; }
        .dd-badge.rejected { background: var(--red-bg); color: #991b1b; }

        .dd-course-card h4 { font-size: 0.875rem; font-weight: 600; color: var(--text); line-height: 1.4; }
        .dd-course-card .author { font-size: 0.75rem; color: var(--text-muted); }
        .dd-course-card .desc { font-size: 0.775rem; color: var(--text-muted); line-height: 1.5; }

        .dd-course-card-meta {
          display: flex; align-items: center; gap: 12px;
          font-size: 0.75rem; color: var(--text-faint);
        }
        .dd-course-card-meta span { display: flex; align-items: center; gap: 4px; }

        .dd-ask-btn {
          margin-top: 4px; width: 100%;
          padding: 8px; border-radius: 7px;
          border: 1.5px solid var(--border); background: var(--surface);
          font-size: 0.8125rem; font-weight: 500; color: var(--text-2);
          cursor: pointer; text-align: center; text-decoration: none;
          transition: border-color 0.15s, color 0.15s, background 0.15s;
          display: block;
        }
        .dd-ask-btn:hover { border-color: var(--purple); color: var(--purple); background: var(--purple-bg); }

        .dd-final-cta {
          padding: 80px 24px; text-align: center;
          max-width: 640px; margin: 0 auto;
        }
        .dd-final-cta h2 {
          font-size: clamp(1.75rem, 3.5vw, 2.75rem); font-weight: 800;
          letter-spacing: -0.03em; color: var(--text);
          margin-bottom: 14px; line-height: 1.15;
        }
        .dd-final-cta p { font-size: 1rem; color: var(--text-muted); line-height: 1.7; margin-bottom: 32px; }

        .dd-footer {
          border-top: 1px solid var(--border);
          padding: 20px 24px;
          display: flex; align-items: center;
          justify-content: space-between; flex-wrap: wrap; gap: 8px;
          background: var(--surface-2);
        }
        .dd-footer-logo {
          display: flex; align-items: center; gap: 6px;
          font-size: 0.875rem; font-weight: 600; color: var(--text-2); text-decoration: none;
        }
        .dd-footer-copy { font-size: 0.8rem; color: var(--text-faint); }
        .dd-footer-tag { font-family: 'Geist Mono', monospace; font-size: 0.7rem; color: var(--text-faint); }

        @media (max-width: 768px) {
          .dd-steps { grid-template-columns: 1fr; }
          .dd-features-grid { grid-template-columns: 1fr; }
          .dd-feature-wide { grid-column: 1; }
          .dd-stats-bar { grid-template-columns: 1fr; gap: 24px; }
          .dd-stat { border-right: none; border-bottom: 1px solid var(--border); padding-bottom: 24px; }
          .dd-stat:last-child { border-bottom: none; }
          .dd-course-cards { grid-template-columns: 1fr; }
          .dd-hero h1 { font-size: 2rem; }
        }
      `}</style>

      <div className="dd-page">

        <section className="dd-hero">
          <div className="dd-eyebrow">
            <Zap size={11} />
            Chat Assistant for Course Doubts
          </div>

          <h1>
            Every answer, traced to the<br />
            <span className="accent">exact reference.</span>
          </h1>

          <p>
            Upload SRT files or transcripts from any course platform. Students ask doubts in natural language — Doubt Desk retrieves and answers using only the transcript, with precise timestamps for every claim.
          </p>

          <div className="dd-cta-group">
            <HomeSigninButton />
            <a href="#how-it-works" className="dd-btn-ghost">
              See how it works
            </a>
          </div>

          <div className="dd-demo-wrapper">
            <div className="dd-demo">
              <div className="dd-demo-header">
                <div className="dd-demo-dots">
                  <div className="dd-demo-dot" style={{ background: "#ff5f57" }} />
                  <div className="dd-demo-dot" style={{ background: "#febc2e" }} />
                  <div className="dd-demo-dot" style={{ background: "#28c840" }} />
                </div>
                <div className="dd-demo-course">
                  <BookOpen size={12} />
                  Node.js – Beginner to Advance · 465 chunks indexed
                </div>
              </div>

              <div className="dd-demo-body">
                <div className="dd-msg student">
                  <div className="dd-bubble">What is Node.js and why is it not a programming language?</div>
                </div>

                <div className="dd-msg">
                  <div className="dd-avatar">DD</div>
                  <div className="dd-bubble">
                    According to the transcript, <strong>Node.js is a JavaScript runtime environment</strong> built on Chrome's V8 engine — it lets you run JavaScript outside the browser. The instructor emphasises it is not a language itself but a runtime that executes JS on the server side.
                    <div className="dd-ts-row">
                      <span className="dd-ts-chip"><Play size={8} /> 2:14 – 3:40</span>
                      <span className="dd-ts-chip"><Play size={8} /> 7:55 – 9:10</span>
                      <span className="dd-grounded"><CheckCircle2 size={9} /> Transcript-grounded</span>
                    </div>
                  </div>
                </div>

                <div className="dd-msg student">
                  <div className="dd-bubble">How does the event loop work?</div>
                </div>

                <div className="dd-msg">
                  <div className="dd-avatar">DD</div>
                  <div className="dd-bubble">
                    The instructor explains that the <strong>event loop continuously checks the call stack</strong> and the callback queue. When the stack is empty, it picks up tasks from the queue — enabling non-blocking I/O.
                    <div className="dd-ts-row">
                      <span className="dd-ts-chip"><Play size={8} /> 34:22 – 36:08</span>
                      <span className="dd-grounded"><CheckCircle2 size={9} /> Transcript-grounded</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="dd-demo-input-bar">
                <span>Ask a doubt about this lecture…</span>
                <div className="dd-demo-send"><ArrowRight size={13} /></div>
              </div>
            </div>
          </div>
        </section>

        <div className="dd-divider" />

        <div className="dd-stats-bar">
          <div className="dd-stat">
            <div className="dd-stat-num">50hr+</div>
            <div className="dd-stat-label">Handles full-length courses with hundreds of SRT chunks</div>
          </div>
          <div className="dd-stat">
            <div className="dd-stat-num">0%</div>
            <div className="dd-stat-label">Hallucination — every answer is strictly transcript-bound</div>
          </div>
          <div className="dd-stat">
            <div className="dd-stat-num">∞</div>
            <div className="dd-stat-label">Timestamp references — students always know the exact source</div>
          </div>
        </div>

        <div className="dd-divider" />

          <div className="dd-course-preview">
          <div className="dd-course-preview-inner">
            <div className="dd-section-tag"><BookOpen size={12} /> Course Management</div>
            <h2 className="dd-section-title" style={{ marginBottom: 4 }}>Enroll students. Control access.<br />Keep Q&A trusted.</h2>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 480 }}>
              Instructors approve enrollments per course. Students only see courses they're enrolled in — rejected requests keep Q&A private.
            </p>
            <div className="dd-course-cards">
              <div className="dd-course-card">
                <div className="dd-course-card-top">
                  <div className="dd-course-icon"><BookOpen size={15} /></div>
                  <span className="dd-badge rejected">Rejected</span>
                </div>
                <h4>Complete Web Development Course</h4>
                <div className="author">By Hitesh Choudhary</div>
                <div className="desc">HTML, CSS, Tailwind, Node, React, MongoDB, Prisma, Deployment</div>
                <div className="dd-course-card-meta">
                  <span><Users size={11} /> 1 student</span>
                  <span><FileText size={11} /> 0 chunks</span>
                </div>
              </div>

              <div className="dd-course-card">
                <div className="dd-course-card-top">
                  <div className="dd-course-icon"><BookOpen size={15} /></div>
                  <span className="dd-badge enrolled">Enrolled</span>
                </div>
                <h4>The Ultimate Python Bootcamp: Learn by Building 50 Projects</h4>
                <div className="author">By Hitesh Choudhary</div>
                <div className="desc">Only Python course that you need</div>
                <div className="dd-course-card-meta">
                  <span><Users size={11} /> 1 student</span>
                  <span><FileText size={11} /> 10 chunks</span>
                </div>
                <a href="#" className="dd-ask-btn">Ask Doubts</a>
              </div>

              <div className="dd-course-card">
                <div className="dd-course-card-top">
                  <div className="dd-course-icon"><BookOpen size={15} /></div>
                  <span className="dd-badge enrolled">Enrolled</span>
                </div>
                <h4>Node.js – Beginner to Advance course with projects</h4>
                <div className="author">By Hitesh Choudhary</div>
                <div className="desc">ORM, SQL, NoSQL, Postman, Express, MongoDB Aggregation, Deployment</div>
                <div className="dd-course-card-meta">
                  <span><Users size={11} /> 1 student</span>
                  <span><FileText size={11} /> 465 chunks</span>
                </div>
                <a href="#" className="dd-ask-btn">Ask Doubts</a>
              </div>
            </div>
          </div>
        </div>

        <section className="dd-section" id="how-it-works">
          <div className="dd-section-tag"><Zap size={11} /> How it works</div>
          <h2 className="dd-section-title">From transcript to verified answer<br />in three steps.</h2>
          <p className="dd-section-sub">
            No hallucination. No paraphrasing from memory. Every response is retrieved directly from your indexed transcript, with exact timestamp references.
          </p>

          <div className="dd-steps">
            <div className="dd-step">
              <div className="dd-step-text">
                <div className="dd-step-num">STEP 01</div>
                <div className="dd-step-icon"><Upload size={18} /></div>
                <h3>Upload SRT or VTT Transcripts</h3>
                <p>
                  Instructors drop in subtitle files directly from Udemy exports, YouTube auto-captions, or any recording platform. Timestamps are preserved exactly as they appear in the file — no manual entry required.
                </p>
                <p style={{ marginTop: "8px" }}>
                  Doubt Desk chunks the transcript semantically and builds a vector index that enables sub-second retrieval across 50+ hour courses.
                </p>
              </div>
              <div className="dd-mockup">
                <div className="dd-mockup-bar">
                  <div className="dd-mockup-dot" style={{ background: "#ff5f57" }} />
                  <div className="dd-mockup-dot" style={{ background: "#febc2e" }} />
                  <div className="dd-mockup-dot" style={{ background: "#28c840" }} />
                  <div className="dd-mockup-title">instructor / upload transcripts</div>
                </div>
                <div className="dd-mockup-body">
                  <div className="dd-upload-zone">
                    <div className="dd-upload-zone-icon"><Upload size={16} /></div>
                    <p>Drop or click to browse</p>
                    <span>Supports .srt and .vtt formats</span>
                    <br />
                    <div className="dd-upload-btn">Choose Files</div>
                  </div>
                  <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: "6px" }}>
                    Uploaded Transcripts · 26 files
                  </div>
                  <div className="dd-file-list">
                    {[
                      { name: "01-node-introduction.vtt", meta: "23.4 KB · 42 chunks", status: "processed" },
                      { name: "02-nodejs-install.vtt", meta: "9.9 KB · 5 chunks", status: "processing" },
                      { name: "03-hello-world.vtt", meta: "16.1 KB · 16 chunks", status: "failed" },
                    ].map((f) => (
                      <div className="dd-file-row" key={f.name}>
                        <div className="dd-file-icon"><FileText size={12} /></div>
                        <div className="dd-file-info">
                          <div className="dd-file-name">{f.name}</div>
                          <div className="dd-file-meta">{f.meta}</div>
                        </div>
                        <span className={`dd-file-badge ${f.status}`}>
                          {f.status.charAt(0).toUpperCase() + f.status.slice(1)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="dd-step reverse">
              <div className="dd-step-text">
                <div className="dd-step-num">STEP 02</div>
                <div className="dd-step-icon"><Search size={18} /></div>
                <h3>Students Ask Doubts Naturally</h3>
                <p>
                  Students type questions in plain language — no special syntax, no tags. The query is embedded and matched against the vector-indexed transcript chunks using semantic similarity.
                </p>
                <p style={{ marginTop: "8px" }}>
                  Only the most relevant transcript segments are retrieved and passed to the model, keeping answers accurate and on-topic.
                </p>
              </div>
              <div className="dd-mockup">
                <div className="dd-mockup-bar">
                  <div className="dd-mockup-dot" style={{ background: "#ff5f57" }} />
                  <div className="dd-mockup-dot" style={{ background: "#febc2e" }} />
                  <div className="dd-mockup-dot" style={{ background: "#28c840" }} />
                  <div className="dd-mockup-title">student / ask doubts</div>
                </div>
                <div className="dd-mockup-body">
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}>
                    <BookOpen size={12} style={{ color: "var(--purple)" }} />
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--text-2)" }}>Node.js – Beginner to Advance course</span>
                  </div>
                  <div className="dd-chat-mockup-msgs">
                    <div className="dd-chat-q">What is the event loop in Node.js?</div>
                    <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--purple-bg)", border: "1px solid var(--purple-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "var(--purple)" }}>DD</span>
                      </div>
                      <div className="dd-chat-a" style={{ background: "var(--surface-2)", fontSize: "0.7rem" }}>
                        Searching transcript chunks for <strong style={{ color: "var(--text)" }}>"event loop Node.js"</strong>…
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                          <div style={{ width: 40, height: 4, borderRadius: 2, background: "var(--purple-bg-2)", overflow: "hidden" }}>
                            <div style={{ width: "60%", height: "100%", background: "var(--purple)", borderRadius: 2, animation: "none" }} />
                          </div>
                          <span style={{ fontSize: "0.6rem", color: "var(--text-faint)" }}>Retrieving 3 relevant chunks…</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dd-chat-input-row" style={{ marginTop: "12px" }}>
                    <span>Ask a doubt about this lecture…</span>
                    <div className="dd-chat-send"><ArrowRight size={11} /></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="dd-step">
              <div className="dd-step-text">
                <div className="dd-step-num">STEP 03</div>
                <div className="dd-step-icon"><Clock size={18} /></div>
                <h3>Timestamped, Verified Answers</h3>
                <p>
                  The model synthesises an answer <strong style={{ color: "var(--text)" }}>exclusively from retrieved transcript passages</strong>. Every claim is tied to a precise time range from the original SRT.
                </p>
                <p style={{ marginTop: "8px" }}>
                  Students see clickable timestamp chips — tap one to jump directly to that moment in the video. No scrubbing, no guessing.
                </p>
              </div>
              <div className="dd-mockup">
                <div className="dd-mockup-bar">
                  <div className="dd-mockup-dot" style={{ background: "#ff5f57" }} />
                  <div className="dd-mockup-dot" style={{ background: "#febc2e" }} />
                  <div className="dd-mockup-dot" style={{ background: "#28c840" }} />
                  <div className="dd-mockup-title">student / answer with timestamps</div>
                </div>
                <div className="dd-mockup-body">
                  <div className="dd-chat-mockup-msgs">
                    <div className="dd-chat-q">What is the event loop in Node.js?</div>
                    <div style={{ display: "flex", gap: "6px", alignItems: "flex-start" }}>
                      <div style={{ width: 22, height: 22, borderRadius: "50%", background: "var(--purple-bg)", border: "1px solid var(--purple-border)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2 }}>
                        <span style={{ fontSize: "0.55rem", fontWeight: 700, color: "var(--purple)" }}>DD</span>
                      </div>
                      <div className="dd-chat-a">
                        The instructor describes the event loop as a mechanism that <strong style={{ color: "var(--text)" }}>continuously monitors the call stack and callback queue</strong>. When the stack is empty, queued callbacks are executed — enabling non-blocking I/O.
                        <div className="dd-chat-ts-row">
                          <span className="dd-chat-ts"><Play size={7} /> 34:22 – 36:08</span>
                          <span className="dd-chat-ts"><Play size={7} /> 41:05 – 42:30</span>
                          <span className="dd-chat-verified"><CheckCircle2 size={8} /> Transcript-grounded</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dd-chat-input-row">
                    <span>Ask a follow-up…</span>
                    <div className="dd-chat-send"><ArrowRight size={11} /></div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </section>

        <div className="dd-divider" />

        <section className="dd-section">
          <div className="dd-section-tag"><Shield size={11} /> Why Doubt Desk</div>
          <h2 className="dd-section-title">Built for accuracy,<br />not just convenience.</h2>
          <p className="dd-section-sub">
            Generic AI assistants make things up. Doubt Desk is designed from the ground up to be honest about what the transcript actually says.
          </p>

          <div className="dd-features-grid">
            <div className="dd-feature dd-feature-wide">
              <div className="dd-feature-icon"><Shield size={16} /></div>
              <h3>Zero-Hallucination Guarantee</h3>
              <p>The model is constrained to only use retrieved transcript segments. If the answer isn't in the course, Doubt Desk says so — it won't guess.</p>
              <div className="dd-check-list">
                {[
                  "Retrieval-augmented generation over your transcript only",
                  "System prompt enforces strict grounding — no external knowledge injected",
                  "Answers cite chunk references, not memory reconstruction",
                ].map((item, i) => (
                  <div key={i} className="dd-check-item">
                    <CheckCircle2 size={13} />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="dd-feature">
              <div className="dd-feature-icon"><Clock size={16} /></div>
              <h3>Precise Timestamps</h3>
              <p>Every claim links to an exact time range from the SRT. Students jump directly to the relevant moment — no scrubbing needed.</p>
            </div>

            <div className="dd-feature">
              <div className="dd-feature-icon"><BookOpen size={16} /></div>
              <h3>Long-Course Ready</h3>
              <p>Built for 40–50 hour courses. Transcripts are chunked and vector-indexed — retrieval stays fast and accurate at any scale.</p>
            </div>

            <div className="dd-feature">
              <div className="dd-feature-icon"><Users size={16} /></div>
              <h3>Instructor Controls</h3>
              <p>Approve enrollments, disable Q&A per module, or restrict access entirely. Full control stays with the instructor at all times.</p>
            </div>

            <div className="dd-feature">
              <div className="dd-feature-icon"><MessageSquare size={16} /></div>
              <h3>Conversational Follow-ups</h3>
              <p>Students can ask follow-up questions and request clarifications — context is retained while retrieval stays grounded in the transcript.</p>
            </div>
          </div>
        </section>

        <div style={{ background: "var(--purple-bg)", borderTop: "1px solid var(--purple-border)", borderBottom: "1px solid var(--purple-border)" }}>
          <div className="dd-final-cta">
            <h2>Your course. Every answer<br />verified from the transcript.</h2>
            <p>
              Stop worrying about what AI might invent. Doubt Desk answers only from what your instructor actually said — with the timestamp to prove it.
            </p>
            <HomeSigninButton />
          </div>
        </div>

        <footer className="dd-footer">
          <a href="/" className="dd-footer-logo">
            <BookOpen size={15} style={{ color: "var(--purple)" }} />
            Doubt Desk
          </a>
          <span className="dd-footer-copy">© 2025 Doubt Desk</span>
          <span className="dd-footer-tag">transcript-first · timestamp-native · zero-hallucination</span>
        </footer>

      </div>
    </>
  );
}
