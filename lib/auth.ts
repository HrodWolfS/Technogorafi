import { Role } from "@/lib/generated/prisma";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { DefaultSession, NextAuthOptions } from "next-auth";
import GithubProvider from "next-auth/providers/github";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: Role;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: Role;
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  useSecureCookies: process.env.NODE_ENV === "production",
  cookies: {
    sessionToken: {
      name: `__Secure-next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        secure: true,
      },
    },
  },
  callbacks: {
    async jwt({ token, user }) {
      console.log("🔑 JWT Callback:", { tokenBefore: token, user });

      if (user && "role" in user) {
        token.role = user.role as Role;
      }

      console.log("🔑 JWT Callback résultat:", { tokenAfter: token });
      return token;
    },
    async session({ session, token }) {
      console.log("👤 Session Callback:", { sessionBefore: session, token });

      if (session.user && token?.sub) {
        session.user.id = token.sub;
        if (token?.role) {
          session.user.role = token.role as Role;
        }
      }

      console.log("👤 Session Callback résultat:", { sessionAfter: session });
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  debug: true,
};
