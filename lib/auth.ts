import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getDemoRole, isDemoUser } from "@/lib/demo/demo-user";


export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as unknown as any),
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
         * 🟢 DEMO USERS - Check DB first, fall back to hardcoded
         */
        if (isDemoUser(credentials.email)) {
          const role = getDemoRole(credentials.email);
          if (!role) return null;

          try {
            // Try to find demo user in DB
            const dbUser = await prisma.user.findUnique({
              where: { email: credentials.email },
              select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isDemo: true,
              },
            });

            // If found in DB, use DB data
            if (dbUser) {
              return {
                id: dbUser.id,
                email: dbUser.email,
                name: dbUser.name || `Demo ${role}`,
                role: dbUser.role,
                isDemo: dbUser.isDemo,
              };
            }

            // If not in DB, use hardcoded demo user
            console.log(`⚠️ Demo user ${credentials.email} not found in DB, using hardcoded`);
            return {
              id: `demo-${role.toLowerCase()}`,
              email: credentials.email,
              name: `Demo ${role}`,
              role,
              isDemo: true,
            };
          } catch (error) {
            console.error("❌ Error fetching demo user:", error);
            // Fallback to hardcoded on DB error
            return {
              id: `demo-${role.toLowerCase()}`,
              email: credentials.email,
              name: `Demo ${role}`,
              role,
              isDemo: true,
            };
          }
        }

        /**
         * 🔵 REAL USERS - Require password
         */
        if (!credentials.password) return null;

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
              role: true,
              isDemo: true,
            },
          });

          if (!user) return null;

          const isValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isValid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            isDemo: user.isDemo ?? false,
          };
        } catch (error) {
          console.error("❌ Error authenticating user:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.isDemo = user.isDemo ?? false;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as "MANAGER" | "EMPLOYEE";
        session.user.isDemo = (token.isDemo as boolean) ?? false;
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