import { db } from "@/db/drizzle";
import { tournaments } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "querystring";
import { eq, and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    const queryParams = parse(req.url?.split("?")[1] || "");
    const { categoryId, search, limit = 20, page = 1 } = queryParams;

    const parsedLimit = Math.max(1, parseInt(limit as string, 10)); // Ensure a minimum limit of 1
    const parsedPage = Math.max(1, parseInt(page as string, 10)); // Ensure a minimum page number of 1
    const offset = (parsedPage - 1) * parsedLimit;

    const conditions = [
      categoryId ? eq(tournaments.category, Number(categoryId)) : undefined,
      search ? sql`${tournaments.name} ILIKE ${`%${search}%`}` : undefined,
    ].filter(Boolean); // Remove undefined values

    try {
      // Fetch total count for pagination
      const totalCountQuery = db
        .select({ count: sql<number>`count(*)` })
        .from(tournaments)
        .where(and(...conditions));

      const [{ count: totalItems }] = await totalCountQuery.execute();
      const totalPages = Math.ceil(totalItems / parsedLimit);

      // Fetch paginated data
      const data = await db
        .select()
        .from(tournaments)
        .where(and(...conditions))
        .limit(parsedLimit)
        .offset(offset)
        .execute();

      return NextResponse.json({
        data: data,
        metadata: {
          totalItems,
          totalPages,
          currentPage: parsedPage,
          itemsPerPage: parsedLimit,
        },
      });
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      return NextResponse.json(
        { msg: "Failed to fetch tournaments" },
        { status: 500 }
      );
    }
  }
}
