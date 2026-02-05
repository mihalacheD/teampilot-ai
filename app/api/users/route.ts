import { prisma } from "@/lib/prisma";
import {
  getAuthenticatedSession,
  forbiddenResponse,
  successResponse,
  serverErrorResponse,
} from "@/lib/api/api-helpers";

export async function GET() {
  const session = await getAuthenticatedSession();

  if (!session || session.user.role !== "MANAGER") {
    return forbiddenResponse("Only managers can view users", { isDemo: false });
  }

  try {
    const users = await prisma.user.findMany({
      where: { role: "EMPLOYEE" },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return successResponse(users);
  } catch (error) {
    console.error("[USERS_GET_ERROR]:", error);
    return serverErrorResponse();
  }
}