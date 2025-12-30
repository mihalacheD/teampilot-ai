import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "MANAGER" | "EMPLOYEE";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "MANAGER" | "EMPLOYEE";
    name: string;
    email: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "MANAGER" | "EMPLOYEE";
  }
}
