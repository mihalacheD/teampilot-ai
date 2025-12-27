import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateStatusSchema = z.object({
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']).optional(),
  title: z.string().min(1).optional(),
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
    data: result.data,
  });

  return NextResponse.json(task);
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {

  const { id } = await params;

  await prisma.task.delete({
    where: { id: id },
  });
  return NextResponse.json({ success: true });
}