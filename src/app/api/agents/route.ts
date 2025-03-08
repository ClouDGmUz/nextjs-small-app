import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Agent } from "@/lib/types";

// GET /api/agents - List all agents
export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: { order: 'asc' }
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
        order: body.order,
        category: body.category || "General"
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

    // Validate required fields
    if (!body.name || !body.phoneNumber || !body.location || !body.status) {
      return NextResponse.json(
        { error: "Name, phone number, location, and status are required" },
        { status: 400 }
      );
    }

    // Check if agent exists
    const existingAgent = await prisma.agent.findUnique({
      where: { id: body.id }
    });

    if (!existingAgent) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    // Validate status
    if (!['active', 'inactive'].includes(body.status)) {
      return NextResponse.json(
        { error: "Status must be either 'active' or 'inactive'" },
        { status: 400 }
      );
    }

    // Validate order is a number
    if (typeof body.order !== 'number') {
      return NextResponse.json(
        { error: "Order must be a number" },
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
        order: body.order,
        category: body.category || "Fergana"
      }
    });

    return NextResponse.json(updatedAgent);
  } catch (error) {
    console.error('Error updating agent:', error);
    return NextResponse.json(
      { error: "Failed to update agent" },
      { status: 500 }
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
