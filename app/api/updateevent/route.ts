import { db } from "@/db/drizzle";
import { events } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

export async function PUT(request: NextRequest) {
  const body = await request.json();

  const updatedEvent = await db
    .update(events)
    .set({
      code: body.code,
      saleEnd: body.saleEnd,
      saleStart: body.saleStart,
      isFeatured: body.isFeatured,
      category: body.category,
      conditions: body.conditions,
      tournament: body.tournament,
    })
    .where(eq(events.id, body.id));
  return Response.json(updatedEvent);
}
