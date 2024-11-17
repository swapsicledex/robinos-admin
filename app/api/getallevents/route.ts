import { db } from "@/db/drizzle";
import { events } from "@/db/schema";

export async function GET() {
  try {
    const eventData = await db.select().from(events);
    return Response.json(eventData);
  } catch (error) {
    console.error("Error fetching events:", error);
    Response.json({ msg: "Failed to fetch events" });
  }
}
