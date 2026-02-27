"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { BookOpen, GraduationCap, LogOut, LayoutDashboard } from "lucide-react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20 group-hover:shadow-primary/40 transition-shadow">
            <BookOpen className="h-5 w-5" />
          </div>
          <span className="text-lg font-bold tracking-tight">Doubt Desk</span>
        </Link>

        <nav className="flex items-center gap-2">
          {session?.user ? (
            <>
              <Link href="/courses">
                <Button variant="ghost" size="sm" className="gap-2 font-semibold">
                  <GraduationCap className="h-4 w-4" />
                  Courses
                </Button>
              </Link>
              {session.user.role === "INSTRUCTOR" && (
                <Link href="/instructor">
                  <Button variant="ghost" size="sm" className="gap-2 font-semibold">
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Button>
                </Link>
              )}
              <div className="flex items-center gap-3 ml-2 pl-3 border-l border-border/40">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={session.user.image || ""} />
                  <AvatarFallback className="text-xs font-bold bg-primary/10 text-primary">
                    {getInitials(session.user.name, session.user.email)}
                  </AvatarFallback>
                </Avatar>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => signOut()}
                  className="h-8 w-8 text-muted-foreground hover:text-foreground"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <Button
              onClick={() => signIn("google")}
              className="rounded-full px-6 font-bold shadow-lg shadow-primary/20"
            >
              Sign In
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
