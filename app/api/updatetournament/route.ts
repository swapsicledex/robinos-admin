import { db } from "@/db/drizzle";
import { tournaments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const updatedTournament = await db
    .update(tournaments)
    .set({
      name: body.name,
      imageUrl: body.imageUrl,
      category: body.categoryId,
    })
    .where(eq(tournaments.id, body.id));
  return Response.json(updatedTournament);
}
