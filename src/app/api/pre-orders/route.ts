import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/pre-orders - Create a new pre-order
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, phoneNumber } = body;

    if (!name || !phoneNumber) {
      return NextResponse.json(
        { error: "Name and phone number are required" },
        { status: 400 }
      );
    }

    const preOrder = await prisma.preOrder.create({
      data: {
        name,
        phoneNumber,
      },
    });

    return NextResponse.json(preOrder);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create pre-order" },
      { status: 500 }
    );
  }
}

// GET /api/pre-orders - Get all pre-orders
export async function GET() {
  try {
    const preOrders = await prisma.preOrder.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(preOrders);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch pre-orders" },
      { status: 500 }
    );
  }
}