import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
})

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  const body = await req.json();
  const result = updateStatusSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const task = await prisma.task.update({
    where: { id: id },
    data: { status: result.data.status },
  });

  return NextResponse.json(task);
}