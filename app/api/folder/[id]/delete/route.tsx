import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

async function killOrphans() {
  const prisma = new PrismaClient();
  let response;
  do {
    response = await prisma.folder.deleteMany({
      where: {
        parentId: null,
        id: {
          not: 1
        }
      }
    });
  } while (response.count > 0)
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = parseInt((await params).id);
  const prisma = new PrismaClient();
  const data = await prisma.folder.delete({
    where: {
      id: id
    }
  });
  killOrphans();
  return NextResponse.json({ data });
}