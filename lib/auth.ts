import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { DefaultSession, Session, User } from "next-auth";
import { JWT } from "next-auth/jwt";
import GithubProvider from "next-auth/providers/github";
import { prisma } from "./prisma";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user?: {
      id: string;
      role?: "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    role?: "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "ADMIN";
  }
}

export const authOptions = {
  debug: true,
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: {
    strategy: "jwt" as const,
  },
  callbacks: {
    async signIn({ user }: { user: User & { email?: string | null } }) {
      if (user.email === process.env.ADMIN_EMAIL) {
        user.role = "ADMIN";
      }
      return true;
    },
    async jwt({ token, user }: { token: JWT; user: User | undefined }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        session.user.id = token.id!;
        session.user.role = token.role;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export const auth = NextAuth(authOptions);
