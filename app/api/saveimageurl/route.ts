import { db } from "@/db/drizzle";
import { NewPlayer, players } from "@/db/schema";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const name = body.name;
  const player: NewPlayer = {
    name: name,
    url: `${process.env.NEXT_PUBLIC_CUSTOM_URL}/${body.imageName}`,
  };
  console.log("image url: ", `${process.env.NEXT_PUBLIC_CUSTOM_URL}/${body.imageName}`);
  const newPlayer = await db.insert(players).values(player).returning();
  return Response.json(newPlayer[0]);
}
