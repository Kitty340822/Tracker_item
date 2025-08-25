// import NextAuth from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import { db } from "@/lib/db";
// import { users } from "@/lib/db/schema";
// import { eq } from "drizzle-orm";
// import bcrypt from "bcryptjs";

// export const authOptions = {
//   providers: [
//     CredentialsProvider({
//       name: "credentials",
//       credentials: {
//         email: { label: "Email", type: "email" },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials) {
//         if (!credentials?.email || !credentials?.password) return null;

//         // ตรวจสอบผู้ใช้ในฐานข้อมูล
//         const userResults = await db
//           .select()
//           .from(users)
//           .where(eq(users.email, credentials.email))
//           .limit(1);

//         const Iuser = userResults[0];
//         if (!Iuser) return null;

//         // ตรวจสอบรหัสผ่าน
//         const isValid = await bcrypt.compare(
//           credentials.password,
//           Iuser.password
//         );

//         if (!isValid) return null;

//         // return user object ที่ NextAuth ต้องการ
//         return {
//           id: Iuser.user_id.toString(),
//           email: Iuser.email,
//           name: Iuser.name,
//           role: Iuser.role_permission,
//         };
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) token.role = user.role;
//       return token;
//     },
//     async session({ session, token }) {
//       if (session.user) session.user.role = token.role as string;
//       return session;
//     },
//   },
//   pages: {
//     signIn: "/login",
//   },
// };

// export const GET = NextAuth(authOptions);
// export const POST = GET;

// auth.ts (ใน root folder)
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { db } from '@/lib/db';
import { users } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import bcrypt from 'bcryptjs';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // ค้นหาผู้ใช้โดยอีเมล
          const userResults = await db
            .select()
            .from(users)
            .where(eq(users.email, credentials.email as string))
            .limit(1);

          if (userResults.length === 0) {
            return null;
          }

          const Iuser = userResults[0];

          // ตรวจสอบรหัสผ่าน
          const isPasswordValid = await bcrypt.compare(
            credentials.password as string,
            Iuser.password
          );

          if (!isPasswordValid) {
            return null;
          }

          // Return user object ที่ NextAuth ต้องการ
          return {
            id: Iuser.user_id.toString(),
            email: Iuser.email,
            name: Iuser.name,
            role: Iuser.role_permission,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session?.user) {
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});