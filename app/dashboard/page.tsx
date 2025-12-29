import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  // 1. Nu e logat → redirect la login
  if (!session) {
    redirect("/auth/signin");
  }

  // 2. E logat, dar nu are rolul potrivit
  if (session.user.role !== "MANAGER") {
    return <div>Access denied</div>;
  }

  // 3. E MANAGER → continui
  return <div>Manager dashboard</div>;
}
