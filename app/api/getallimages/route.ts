import { db } from "@/db/drizzle";
import { category, players, tournaments } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "querystring";
import { eq, and, sql } from "drizzle-orm";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    const queryParams = parse(req.url?.split("?")[1] || "");
    const {
      tournamentId,
      categoryId,
      search,
      limit = 20,
      page = 1,
    } = queryParams;

    const parsedLimit = Math.max(1, parseInt(limit as string, 10));
    const parsedPage = Math.max(1, parseInt(page as string, 10));
    const offset = (parsedPage - 1) * parsedLimit;

    const conditions = [
      categoryId ? eq(players.category, Number(categoryId)) : undefined,
      tournamentId ? eq(players.tournament, Number(tournamentId)) : undefined,
      search ? sql`${players.name} ILIKE ${`%${search}%`}` : undefined,
    ].filter(Boolean); // Filter out undefined values directly in the array

    try {
      const [totalCountResult, userData, alwaysInclude] = await Promise.all([
        // Fetch the total count of items
        db
          .select({ count: sql`COUNT(*)` })
          .from(players)
          .innerJoin(category, eq(category.id, players.category))
          .leftJoin(tournaments, eq(tournaments.id, players.tournament))
          .where(and(...conditions))
          .execute(),
        // Fetch the paginated items
        db
          .select({
            id: players.id,
            name: players.name,
            symbol: players.symbol,
            url: players.url,
            category: category.name,
            tournament: tournaments.name,
          })
          .from(players)
          .innerJoin(category, eq(category.id, players.category))
          .leftJoin(tournaments, eq(tournaments.id, players.tournament))
          .where(and(...conditions))
          .limit(parsedLimit)
          .offset(offset)
          .execute(),
        // Fetch the items to always include
        db
          .select({
            id: players.id,
            name: players.name,
            symbol: players.symbol,
            url: players.url,
            category: category.name,
            tournament: tournaments.name,
          })
          .from(players)
          .innerJoin(category, eq(category.id, players.category))
          .leftJoin(tournaments, eq(tournaments.id, players.tournament))
          .where(eq(players.isPrediction, true)) // Always include items with is_prediction = true
          .execute(),
      ]);

      const totalItems = (totalCountResult[0]?.count as number) || 0;
      const totalPages = Math.ceil(totalItems / parsedLimit);

      // Combine alwaysInclude and paginated data, ensuring no duplicates
      const combinedData = [
        ...userData,
        ...alwaysInclude.filter(
          (item) => !userData.some((userItem) => userItem.id === item.id)
        ),
      ];

      return NextResponse.json({
        data: combinedData,
        metadata: {
          totalItems,
          totalPages,
          currentPage: parsedPage,
          itemsPerPage: parsedLimit,
        },
      });
    } catch (error) {
      console.error("Error fetching players:", error);
      return NextResponse.json(
        { msg: "Failed to fetch players" },
        { status: 500 }
      );
    }
  }
}
