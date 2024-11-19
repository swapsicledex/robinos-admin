import { db } from "@/db/drizzle";
import { chains } from "@/db/schema";

export async function GET() {
  try {
    const data = await db.select().from(chains);
    return Response.json(data);
  } catch (error) {
    console.error("Error fetching tokens:", error);
    Response.json({ msg: "Failed to fetch tokens" });
  }
}
