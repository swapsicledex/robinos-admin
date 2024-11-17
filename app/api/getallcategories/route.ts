import { db } from "@/db/drizzle";
import { category } from "@/db/schema";

export async function GET() {
  try {
    const categories = await db.select().from(category);
    return Response.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    Response.json({ msg: "Failed to fetch categories" });
  }
}
