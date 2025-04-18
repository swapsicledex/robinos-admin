import { db } from "@/db/drizzle";
import { events, NewEvent } from "@/db/schema";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
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
    network:
      body.chainId == 40
        ? "telos"
        : body.chainId == 167000
          ? "taiko"
          : body.chainId == 5000
            ? "mantle"
            : "abstractTestnet",
  };
  const newEvent = await db.insert(events).values(event).returning();
  return Response.json(newEvent[0]);
}
