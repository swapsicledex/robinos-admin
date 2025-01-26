import { db } from "@/db/drizzle";
import { chains } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "querystring";
import { and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    const queryParams = parse(req.url?.split("?")[1] || "");
    const { search, limit = 20, page = 1 } = queryParams;

    const parsedLimit = Math.max(1, parseInt(limit as string, 10)); // Ensure limit is at least 1
    const parsedPage = Math.max(1, parseInt(page as string, 10)); // Ensure page is at least 1
    const offset = (parsedPage - 1) * parsedLimit;

    const conditions = [
      search ? sql`${chains.name} ILIKE ${`%${search}%`}` : undefined,
    ].filter(Boolean); // Filter out undefined conditions

    try {
      // Fetch total count for pagination
      const totalCountResult = await db
        .select({ total: sql<number>`COUNT(*)` })
        .from(chains)
        .where(and(...conditions))
        .execute();

      const totalItems = totalCountResult[0]?.total || 0; // Get the total number of items
      const totalPages = Math.ceil(totalItems / parsedLimit); // Calculate total pages

      // Fetch paginated data
      const data = await db
        .select()
        .from(chains)
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
      console.error("Error fetching chains:", error);
      return NextResponse.json({
        msg: "Failed to fetch chains",
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
