"use client";

import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { ArrowRight } from "lucide-react";

type HomeSigninButtonProps = {
  label?: string;
};

export default function HomeSigninButton({ label = "Get Started Free" }: HomeSigninButtonProps) {
  return (
    <Button
      onClick={() => signIn("google")}
      className="rounded-full px-6 font-bold shadow-lg shadow-primary/20 inline-flex items-center gap-2"
    >
      {label} <ArrowRight size={15} />
    </Button>
  );
}
