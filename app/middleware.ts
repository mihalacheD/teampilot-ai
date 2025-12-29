import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

// definește căi care trebuie protejate și roluri
const protectedRoutes: { path: string; role: "MANAGER" | "EMPLOYEE" }[] = [
  { path: "/dashboard", role: "MANAGER" },
  { path: "/api/tasks", role: "MANAGER" },
];

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();

  // verifică dacă ruta curentă e protejată
  const route = protectedRoutes.find((r) => req.nextUrl.pathname.startsWith(r.path));
  if (!route) {
    return NextResponse.next(); // nu e protejată, trece mai departe
  }

  // obține sesiunea server-side
  const session = await getServerSession(authOptions);

  if (!session) {
    // nu e logat → redirect la login
    url.pathname = "/auth/signin";
    return NextResponse.redirect(url);
  }

  if (session.user.role !== route.role) {
    // logat, dar fără rol → 403
    return new Response("Forbidden", { status: 403 });
  }

  // totul ok → trece mai departe
  return NextResponse.next();
}

// ce foldere/rute rulează middleware
export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"], // poți adăuga rute noi aici
};
