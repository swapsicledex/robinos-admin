import { db } from "@/db/drizzle";
import { players } from "@/db/schema";
import { NextRequest } from "next/server";
import { parse } from "querystring";
import { eq, and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    const queryParams = parse(req.url?.split("?")[1] || "");
    const { categoryId, search, limit = 20, page = 1 } = queryParams;

    const parsedLimit = Math.max(1, parseInt(limit as string, 10));
    const parsedPage = Math.max(1, parseInt(page as string, 10));
    const offset = (parsedPage - 1) * parsedLimit;

    const conditions = [
      categoryId ? eq(players.category, Number(categoryId)) : undefined,
      search ? sql`${players.name} ILIKE ${`%${search}%`}` : undefined,
    ].filter(Boolean); // Filter out undefined values directly in the array

    try {
      const userData = await db
        .select()
        .from(players)
        .where(and(...conditions))
        .limit(parsedLimit)
        .offset(offset)
        .execute();
      return Response.json(userData);
    } catch (error) {
      console.error("Error fetching players:", error);
      Response.json({ msg: "Failed to fetch players" });
    }
  }
}
