import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { Providers } from "./providers"
import { cn } from "@/lib/utils"
import Header from "@/components/header"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Doubt Desk",
  description: "Transcript-grounded Q&A platform for courses",
}

export default function RootLayout({ children }: React.PropsWithChildren) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={cn(
        inter.variable,
        "font-sans font-medium min-h-screen bg-background text-foreground antialiased"
      )}>
        <Providers>
          <div className="relative flex h-screen flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  )
}
