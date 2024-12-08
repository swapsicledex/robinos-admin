import { db } from "@/db/drizzle";
import { tournaments } from "@/db/schema";
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
      categoryId ? eq(tournaments.category, Number(categoryId)) : undefined,
      search ? sql`${tournaments.name} ILIKE ${`%${search}%`}` : undefined,
    ].filter(Boolean); // Filter out undefined values directly in the array

    try {
      const categories = await db
        .select()
        .from(tournaments)
        .where(and(...conditions))
        .limit(parsedLimit)
        .offset(offset)
        .execute();
      return Response.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      Response.json({ msg: "Failed to fetch categories" });
    }
  }
}
