import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { status, notes } = body;

    if (!status && !notes) {
      return NextResponse.json(
        { error: "Status or notes are required" },
        { status: 400 }
      );
    }

    const preOrder = await prisma.preOrder.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(notes && { notes })
      },
    });

    return NextResponse.json(preOrder);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update pre-order" },
      { status: 500 }
    );
  }
}