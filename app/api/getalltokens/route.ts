import { db } from "@/db/drizzle";
import { chains, tokens } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "querystring";
import { eq, and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    const queryParams = parse(req.url?.split("?")[1] || "");
    const { chainId, search, limit = 20, page = 1 } = queryParams;

    const parsedLimit = Math.max(1, parseInt(limit as string, 10));
    const parsedPage = Math.max(1, parseInt(page as string, 10));
    const offset = (parsedPage - 1) * parsedLimit;

    const conditions = [
      chainId ? eq(tokens.chainId, Number(chainId)) : undefined,
      search ? sql`${tokens.symbol} ILIKE ${`%${search}%`}` : undefined,
    ].filter(Boolean);

    try {
      // Fetch the total number of items
      const totalItemsResult = await db
        .select({
          total: sql<number>`COUNT(*)`,
        })
        .from(tokens)
        .innerJoin(chains, eq(chains.chainId, tokens.chainId))
        .where(and(...conditions))
        .execute();

      const totalItems = totalItemsResult[0]?.total || 0;
      const totalPages = Math.ceil(totalItems / parsedLimit);

      // Fetch the paginated data
      const data = await db
        .select({
          id: tokens.id,
          name: tokens.name,
          symbol: tokens.symbol,
          address: tokens.address,
          chainId: tokens.chainId,
          chainName:chains.name,
          imageUrl: tokens.imageUrl,
          decimal: tokens.decimal,
        })
        .from(tokens)
        .innerJoin(chains, eq(chains.chainId, tokens.chainId))
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
      console.error("Error fetching tokens:", error);
      return NextResponse.json({
        msg: "Failed to fetch tokens",
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
