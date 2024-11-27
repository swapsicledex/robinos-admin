import { db } from "@/db/drizzle";
import { NewTournament, tournaments } from "@/db/schema";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const data: NewTournament = {
    name:body.tournament,
    category: body.category,
  };
  const newData = await db.insert(tournaments).values(data).returning();
  return Response.json(newData[0]);
}
