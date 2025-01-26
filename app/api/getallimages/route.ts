import { db } from "@/db/drizzle";
import { category, players, tournaments } from "@/db/schema";
import { NextRequest, NextResponse } from "next/server";
import { parse } from "querystring";
import { eq, and, sql, or } from "drizzle-orm";

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
      categoryId
        ? or(eq(players.category, Number(categoryId)), eq(players.category, 6))
        : undefined,
      tournamentId ? eq(players.tournament, Number(tournamentId)) : undefined,
      search ? sql`${players.name} ILIKE ${`%${search}%`}` : undefined,
    ].filter(Boolean); // Filter out undefined values directly in the array

    try {
      const [totalCountResult, userData] = await Promise.all([
        db
          .select({ count: sql`COUNT(*)` })
          .from(players)
          .innerJoin(category, eq(category.id, players.category))
          .leftJoin(tournaments, eq(tournaments.id, players.tournament))
          .where(and(...conditions))
          .execute(),
        db
          .select({
            id: players.id,
            name: players.name,
            symbol: players.symbol,
            url: players.url,
            category: category.name,
            categoryId: category.id,
            tournament: tournaments.name,
            tournamentId: tournaments.id,
          })
          .from(players)
          .innerJoin(category, eq(category.id, players.category))
          .leftJoin(tournaments, eq(tournaments.id, players.tournament))
          .where(and(...conditions))
          .limit(parsedLimit)
          .offset(offset)
          .execute(),
      ]);

      const totalItems = (totalCountResult[0]?.count as number) || 0;
      const totalPages = Math.ceil(totalItems / parsedLimit);

      return NextResponse.json({
        data: userData,
        metadata: {
          totalItems,
          totalPages,
          currentPage: parsedPage,
          itemsPerPage: parsedLimit,
        },
      });
    } catch (error) {
      console.error("Error fetching players:", error);
      return NextResponse.json({
        msg: "Failed to fetch players",
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
}
