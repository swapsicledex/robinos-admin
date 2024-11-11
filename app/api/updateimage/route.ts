import { db } from "@/db/drizzle";
import { players } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const name = body.name;
  const id = body.id;
  const updatedPlayer = await db
    .update(players)
    .set({
      name: name,
      url: `${process.env.NEXT_PUBLIC_CUSTOM_URL}/${body.imageName}`,
    })
    .where(eq(players.id, id));
  return Response.json(updatedPlayer);
}
