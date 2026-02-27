import NextAuth from "next-auth"
import "next-auth/jwt"
import Google from "next-auth/providers/google"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  debug: !!process.env.AUTH_DEBUG,
  adapter: PrismaAdapter(prisma),
  pages: {
    signIn: "/",
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  basePath: "/api/auth",
  trustHost: true,
  session: { strategy: "jwt" },
  callbacks: {
    authorized({ request, auth }) {
      return true
    },
    async jwt({ token, trigger, session, account }) {
      if (trigger === "update") {
        if (session?.name) token.name = session.name
        if (session?.image) token.picture = session.image
      }

      if (token.sub) {
        const user = await prisma.user.findUnique({
          where: { id: token.sub },
          select: { role: true },
        })
        if (user) {
          token.role = user.role
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      if (token.name) session.user.name = token.name
      if (token.picture) session.user.image = token.picture
      if (token.role) session.user.role = token.role as string

      return session
    },
  },
})

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string
  }
}
