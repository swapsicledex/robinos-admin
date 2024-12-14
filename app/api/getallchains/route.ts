import { db } from "@/db/drizzle";
import { chains } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "querystring";
import { and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    const queryParams = parse(req.url?.split("?")[1] || "");
    const { search, limit = 20, page = 1 } = queryParams;

    const parsedLimit = Math.max(1, parseInt(limit as string, 10));
    const parsedPage = Math.max(1, parseInt(page as string, 10));
    const offset = (parsedPage - 1) * parsedLimit;

    const conditions = [
      search ? sql`${chains.name} ILIKE ${`%${search}%`}` : undefined,
    ].filter(Boolean); // Filter out undefined values directly in the array

    try {
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
            totalItems: 0,
            totalPages: 0,
            currentPage: parsedPage,
            itemsPerPage: parsedLimit,
          },
        });
    } catch (error) {
      console.error("Error fetching tokens:", error);
      Response.json({ msg: "Failed to fetch tokens" });
    }
  }
}
