import { db } from "@/db/drizzle";
import { players } from "@/db/schema";

export async function GET() {
  try {
    const userData = await db.select().from(players);
    return Response.json(userData);
  } catch (error) {
    console.error("Error fetching players:", error);
    Response.json({ msg: "Failed to fetch players" });
  }
}
