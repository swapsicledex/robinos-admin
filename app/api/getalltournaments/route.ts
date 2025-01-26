import { db } from "@/db/drizzle";
import { category, tournaments } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "querystring";
import { eq, and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    const queryParams = parse(req.url?.split("?")[1] || "");
    const { categoryId, search, limit = 20, page = 1 } = queryParams;

    const parsedLimit = Math.max(1, parseInt(limit as string, 10)); // Minimum limit of 1
    const parsedPage = Math.max(1, parseInt(page as string, 10)); // Minimum page number of 1
    const offset = (parsedPage - 1) * parsedLimit;

    const conditions = [
      categoryId ? eq(tournaments.category, Number(categoryId)) : undefined,
      search ? sql`${tournaments.name} ILIKE ${`%${search}%`}` : undefined,
    ].filter(Boolean); // Remove undefined conditions

    try {
      // Fetch total count for pagination
      const totalCountResult = await db
        .select({
          total: sql<number>`COUNT(*)`,
        })
        .from(tournaments)
        .innerJoin(category, eq(category.id, tournaments.category))
        .where(and(...conditions))
        .execute();

      const totalItems = totalCountResult[0]?.total || 0;
      const totalPages = Math.ceil(totalItems / parsedLimit);

      // Fetch paginated data
      const data = await db
        .select({
          id: tournaments.id,
          category: category.name,
          name: tournaments.name,
          imageUrl: tournaments.imageUrl,
        })
        .from(tournaments)
        .innerJoin(category, eq(category.id, tournaments.category))
        .where(and(...conditions))
        .limit(parsedLimit)
        .offset(offset)
        .execute();

      return NextResponse.json({
        data,
        metadata: {
          totalItems,
          totalPages,
          currentPage: parsedPage,
          itemsPerPage: parsedLimit,
        },
      });
    } catch (error) {
      console.error("Error fetching tournaments:", error);
      return NextResponse.json({
        msg: "Failed to fetch tournaments",
        status: 500,
        data: [],
        metadata: {
          totalItems: 0,
          totalPages: 0,
          currentPage: parsedPage,
          itemsPerPage: parsedLimit,
        },
      });
    }
  }

  return NextResponse.json({ msg: "Method not allowed" }, { status: 405 });
}
