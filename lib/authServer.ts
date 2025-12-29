import { getServerSession } from "next-auth";
import { authOptions } from "./auth";


export async function requireManagerSession() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response("Unauthorized", { status: 401 });
  }

  if (session.user.role !== "MANAGER") {
    return new Response("Forbidden", { status: 403 });
  }

  return session;
}
