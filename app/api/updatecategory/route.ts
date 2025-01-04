import { db } from "@/db/drizzle";
import { category } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  const body = await request.json();
  const updatedCategory = await db
    .update(category)
    .set({
      name: body.name,
      imageUrl: body.imageUrl,
    })
    .where(eq(category.id, body.id));
  return Response.json(updatedCategory);
}
