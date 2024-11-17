import { db } from "@/db/drizzle";
import { events, NewEvent } from "@/db/schema";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const event: NewEvent = {
    code: body.code as string,
    saleEnd: body.saleEnd,
    isDeployed: false,
    teamA: body.teamAId,
    teamB: body.teamBId,
    tokenAddress: body.tokenAddressId,
    category: body.categoryId,
  };
  const newEvent = await db.insert(events).values(event).returning();
  return Response.json(newEvent[0]);
}
