import { db } from "@/db/drizzle";
import { events, NewEvent } from "@/db/schema";
import { NextRequest } from "next/server";

const chainIdToNetwork = {
  40: "telos",
  167000: "taiko",
  5000: "mantle",
  167012: "kaspaTestnet",
  11124:"abstractTestnet"
} as const;

export async function POST(request: NextRequest) {
  const body = await request.json();

  const network = chainIdToNetwork[body.chainId as keyof typeof chainIdToNetwork];

  if (!network) {
    return new Response(
      JSON.stringify({ error: `Unsupported chainId: ${body.chainId}` }),
      { status: 400 }
    );
  }

  const event: NewEvent = {
    code: body.code,
    saleEnd: body.saleEnd,
    saleStart: body.saleStart,
    isFeatured: body.isFeatured,
    category: body.category,
    teamA: body.teamA,
    teamB: body.teamB,
    tokenAddress: body.tokenAddress,
    chainId: body.chainId,
    isDeployed: false,
    conditions: body.conditions,
    handicapTeamA: body.handicapA,
    handicapTeamB: body.handicapB,
    tournament: body.tournament,
    network: network
  };
  const newEvent = await db.insert(events).values(event).returning();
  return Response.json(newEvent[0]);
}
