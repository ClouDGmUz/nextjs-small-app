import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Agent } from "@/lib/types";

// GET /api/agents - List all agents
export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return NextResponse.json(agents);
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch agents" },
      { status: 500 }
    );
  }
}

// POST /api/agents - Create a new agent
export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json() as Omit<Agent, 'id' | 'createdAt' | 'updatedAt'>;
    const newAgent = await prisma.agent.create({
      data: {
        name: body.name,
        phoneNumber: body.phoneNumber,
        location: body.location,
        status: body.status || "active",
        telegram: body.telegram || null,
      }
    });
    return NextResponse.json(newAgent, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// PUT /api/agents - Update an agent
export async function PUT(
  request: NextRequest
) {
  try {
    const body = await request.json() as Agent;
    
    if (!body.id) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      );
    }

    const updatedAgent = await prisma.agent.update({
      where: { id: body.id },
      data: {
        name: body.name,
        phoneNumber: body.phoneNumber,
        location: body.location,
        status: body.status,
        telegram: body.telegram || null,
      }
    });

    return NextResponse.json(updatedAgent);
  } catch {
    return NextResponse.json(
      { error: "Failed to update agent" },
      { status: 400 }
    );
  }
}

// DELETE /api/agents?id={id} - Delete an agent
export async function DELETE(
  request: NextRequest
) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Agent ID is required" },
      { status: 400 }
    );
  }

  try {
    await prisma.agent.delete({
      where: { id }
    });
    return NextResponse.json({ message: "Agent deleted successfully" });
  } catch {
    return NextResponse.json(
      { error: "Failed to delete agent" },
      { status: 400 }
    );
  }
}
