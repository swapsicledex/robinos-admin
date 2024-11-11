import { eq } from "drizzle-orm";
import { db } from "@/db/drizzle";
import { players } from "@/db/schema";

export async function DELETE() {
  try {
    await db.delete(players).where(eq(players.id, id));
    console.log(`Player with id ${id} deleted successfully`);
    return Response.json({ msg: "Deleted successfully" });
  } catch (error) {
    console.error(`Error deleting player with id ${id}:`, error);
    Response.json({ msg: "Failed to delete" });
  }
}
