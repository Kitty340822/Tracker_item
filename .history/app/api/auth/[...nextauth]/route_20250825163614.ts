import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const GET = NextAuth({
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const userResults = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email))
          .limit(1);

        const Iuser = userResults[0];
        if (!Iuser) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          Iuser.password
        );

        if (!isPasswordValid) return null;

        return {
          id: Iuser.user_id.toString(),
          email: Iuser.email,
          name: Iuser.name,
          role: Iuser.role_permission,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = user.role;
      return token;
    },
    async session({ session, token }) {
      if (session?.user) session.user.role = token.role as string;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const POST = GET;
