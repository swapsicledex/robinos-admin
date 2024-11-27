import { db } from "@/db/drizzle";
import { tournaments } from "@/db/schema";

export async function GET() {
  try {
    const categories = await db.select().from(tournaments);
    return Response.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    Response.json({ msg: "Failed to fetch categories" });
  }
}
