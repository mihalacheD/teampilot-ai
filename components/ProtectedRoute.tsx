"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

type Props = {
  children: React.ReactNode;
  requiredRole?: "MANAGER" | "EMPLOYEE";
};

export default function ProtectedRoute({ children, requiredRole }: Props) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    // nu e logat
    if (!session) {
      router.replace("/auth/signin");
      return;
    }

    // are rol greșit
    if (requiredRole && session.user.role !== requiredRole) {
      router.replace("/");
    }
  }, [session, status, requiredRole, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) return null;

  if (requiredRole && session.user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
