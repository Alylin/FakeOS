import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id);
  const prisma = new PrismaClient();
  const data = await prisma.folder.findFirst({
    include: {
      children: true
    },
    where: {
      id: id
    }
  });
  return NextResponse.json({ data });
}