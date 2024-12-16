import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function POST(
  request: Request
) {
  const requestData = await request.json();
  const prisma = new PrismaClient();
  const data = await prisma.folder.findFirst({
    include: {
      children: true
    },
    where: {
      // path: requestData.path
    }
  });
  return NextResponse.json({ data });
}