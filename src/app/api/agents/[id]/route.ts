import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Props = {
  params: { id: string }
}

// GET /api/agents/{id} - Get a single agent
export async function GET(
  request: NextRequest,
  { params }: Props
) {
  try {
    const agent = await prisma.agent.findUnique({
      where: { id: params.id }
    });

    if (!agent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(agent);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch agent" },
      { status: 500 }
    );
  }
}
