import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validators/registerSchema";


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.parse(body);

    const existing = await prisma.user.findUnique({ where: { email: parsed.email }});
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(parsed.password, 10);

    const user = await prisma.user.create({
      data: {
        name: parsed.name,
        email: parsed.email,
        password: hashed,
        role: parsed.role ?? "EMPLOYEE",
      },
    });

    return NextResponse.json({ id: user.id, email: user.email }, { status: 201 });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : "An error occurred" }, { status: 400 });
  }
}
