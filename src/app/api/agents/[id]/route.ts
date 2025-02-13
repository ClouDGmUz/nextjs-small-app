import { NextRequest, NextResponse } from "next/server";
import { Agent } from "../route";

// In-memory storage reference
let agents: Agent[] = [];

// Function to sync with main route's agents array
const syncAgents = (mainAgents: Agent[]) => {
  agents = mainAgents;
};

// GET /api/agents/{id} - Get a single agent
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const agent = agents.find((a) => a.id === params.id);

  if (!agent) {
    return NextResponse.json(
      { error: "Agent not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(agent);
}

// Export for use in main route
export { syncAgents };
