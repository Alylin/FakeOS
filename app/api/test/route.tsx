import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

export async function GET() {
  const prisma = new PrismaClient();
  const data = await prisma.testTableOne.findMany({});
  return NextResponse.json({ data });
}
