import { db } from "@/db/drizzle";
import { players } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const id = body.id;
  // eslint-disable-next-line  @typescript-eslint/no-explicit-any
  const temp: any = {
    name: body.name,
    symbol: body.symbol,
    category: body.category,
    tournament: body.tournament,
  };
  if (body?.imageName) {
    temp["url"] = `${process.env.NEXT_PUBLIC_CUSTOM_URL}/${body.imageName}`;
  }
  const updatedPlayer = await db
    .update(players)
    .set(temp)
    .where(eq(players.id, id));
  return Response.json(updatedPlayer);
}
