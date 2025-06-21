import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { prisma } from "./prisma";

export const auth = betterAuth({
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL,
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    },
  },
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
  },
  plugins: [nextCookies()],
  // On-app-event logging
  events: {
    onError(error: any) {
      console.error("🔴 BETTER_AUTH_ERROR", error);
    },
    onSignIn(user: any) {
      console.log("🟢 BETTER_AUTH_SIGN_IN", user);
    },
    onSignUp(user: any) {
      console.log("🔵 BETTER_AUTH_SIGN_UP", user);
    },
  },
});

export type Auth = typeof auth;
