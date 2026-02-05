import { getAuthenticatedSession } from "@/lib/api/api-helpers";

/**
 * Verifică dacă user-ul e demo și blochează acțiunea
 * @param action - ce acțiune încercăm (ex: "creating tasks")
 * @returns Response JSON dacă e demo sau null dacă nu e demo
 */
export async function requireNotDemo(action: string): Promise<Response | null> {
  const session = await getAuthenticatedSession();

  if (!session) return null;

  if (session.user?.isDemo === true) {
    return Response.json(
      {
        message: `Demo mode: ${action} is disabled`,
        isDemo: true,
      },
      { status: 403 },
    );
  }

  return null;
}
