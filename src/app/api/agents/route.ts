import { NextRequest, NextResponse } from "next/server";
import { syncAgents } from "./[id]/route";

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: "active" | "inactive";
  createdAt: string;
}

// In-memory storage
let agents: Agent[] = [
  {
    id: "1",
    name: "John Doe",
    role: "Sales Agent",
    status: "active",
    createdAt: new Date().toISOString(),
  },
];

// Sync agents with [id] route handler
const updateAgents = (newAgents: Agent[]) => {
  agents = newAgents;
  syncAgents(agents);
};

// Initialize sync
updateAgents(agents);

// GET /api/agents - List all agents
export async function GET() {
  return NextResponse.json(agents);
}

// POST /api/agents - Create a new agent
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newAgent: Agent = {
      id: Math.random().toString(36).substring(7),
      name: body.name,
      role: body.role,
      status: body.status || "active",
      createdAt: new Date().toISOString(),
    };

    updateAgents([...agents, newAgent]);
    return NextResponse.json(newAgent, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// PUT /api/agents - Update an agent
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const agentIndex = agents.findIndex((a) => a.id === body.id);
    
    if (agentIndex === -1) {
      return NextResponse.json(
        { error: "Agent not found" },
        { status: 404 }
      );
    }

    const updatedAgent = {
      ...agents[agentIndex],
      ...body,
      id: agents[agentIndex].id, // Prevent ID change
      createdAt: agents[agentIndex].createdAt, // Prevent createdAt change
    };

    updateAgents([
      ...agents.slice(0, agentIndex),
      updatedAgent,
      ...agents.slice(agentIndex + 1)
    ]);
    return NextResponse.json(updatedAgent);
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 }
    );
  }
}

// DELETE /api/agents?id={id} - Delete an agent
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Agent ID is required" },
      { status: 400 }
    );
  }

  const initialLength = agents.length;
  updateAgents(agents.filter((agent) => agent.id !== id));

  if (agents.length === initialLength) {
    return NextResponse.json(
      { error: "Agent not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({ message: "Agent deleted successfully" });
}
