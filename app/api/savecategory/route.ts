import { db } from "@/db/drizzle";
import { NewCategory, category } from "@/db/schema";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const data: NewCategory = {
    name: body.category,
    imageUrl: body.image,
  };
  const newData = await db.insert(category).values(data).returning();
  return Response.json(newData[0]);
}
