import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest } from 'next';

export async function POST(request: Request) {
  const prisma = new PrismaClient();
  const requestData = await request.json();

  const data1 = await prisma.folder.findFirst({
    where: {
      id: requestData.parentId
    }
  });


  if (!data1) {
    return; 
  }

  const data = await prisma.folder.create({
    data: {
      displayName: requestData.folderName,
      // path: `${data1.path}${requestData.folderName}/`,
      parentId: requestData.parentId
    }
  });
  return NextResponse.json({ data });
}