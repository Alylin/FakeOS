import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

// issues with decendents 
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const requestData = await request.json();
  const id = parseInt((await params).id);
  const prisma = new PrismaClient();


  const currentData = await prisma.folder.findFirst({
    where: {
      id: id
    }
  });

  if (!currentData?.parentId) {
    throw new Error('object of this ID does not exist');
  }

  const parentData = await prisma.folder.findFirst({
    where: {
      id: currentData.parentId
    }
  });

  if (!parentData) {
    throw new Error('cannot rename roots');
  }

  await prisma.folder.update({
    data: {
      displayName: requestData.displayName,
      path: `${parentData.path}${requestData.displayName}/`
    },
    where: {
      id: id
    }
  });
}