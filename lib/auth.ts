import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getDemoRole, isDemoUser } from "./demo/demo-user";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.email) return null;

        /**
         * 🟢 DEMO USERS (fără DB, fără parolă)
         */
        if (isDemoUser(credentials.email)) {
          const role = getDemoRole(credentials.email);
          if (!role) return null;

          const dbUser = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          return {
            id: dbUser?.id || `demo-${role.toLowerCase()}`,
            email: credentials.email,
            name: dbUser?.name || "Demo User",
            role,
            isDemo: true,
          };
        }

        /**
         * 🔵 REAL USERS (din DB)
         */
        if (!credentials.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          select: {
            id: true,
            email: true,
            password: true,
            name: true,
            role: true,
          },
        });

        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password,
        );

        if (!isValid) return null;

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          isDemo: false,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isDemo = user.isDemo;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "MANAGER" | "EMPLOYEE";
        session.user.isDemo = token.isDemo as boolean;
      }
      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
