import { db } from "@/db/drizzle";
import { events, players, tokens, category, tournaments } from "@/db/schema";
import { eq, gte, lte, and, aliasedTable, sql } from "drizzle-orm";
import { NextRequest } from "next/server";
import { parse } from "querystring";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    const queryParams = parse(req.url?.split("?")[1] || "");
    const {
      chainId,
      categoryId,
      tournamentId,
      fromTime,
      toTime,
      featured,
      search,
      limit = 10,
      page = 1,
    } = queryParams;

    if (!chainId) {
      return Response.json({ error: "Missing required parameters" });
    }

    const parsedLimit = Math.max(1, parseInt(limit as string, 10));
    const parsedPage = Math.max(1, parseInt(page as string, 10));
    const offset = (parsedPage - 1) * parsedLimit;

    // Optional parameters with default values
    const currentTimestamp = Math.round(Date.now() / 1000);
    const fromTimeValue = fromTime ?? currentTimestamp - 90 * 24 * 60 * 60; // 90 days back
    const toTimeValue = toTime ?? currentTimestamp + 90 * 24 * 60 * 60; // 90 days ahead
    const featuredValue = featured ?? "false";

    // Building the conditions directly in the query to avoid extra filtering
    const conditions = [
      eq(events.chainId, Number(chainId)),
      categoryId ? eq(events.category, Number(categoryId)) : undefined,
      tournamentId ? eq(events.tournament, Number(tournamentId)) : undefined,
      featuredValue === "true" ? eq(events.isFeatured, true) : undefined,
      gte(events.saleEnd, Number(fromTimeValue)),
      lte(events.saleEnd, Number(toTimeValue)),
      search ? sql`${events.code} ILIKE ${`%${search}%`}` : undefined,
    ].filter(Boolean); // Filter out undefined values directly in the array

    try {
      // Alias tables for team A and team B
      const teamA = aliasedTable(players, "teamA");
      const teamB = aliasedTable(players, "teamB");

      // Fetch the paginated event data directly with count
      const [eventData, totalItems] = await Promise.all([
        db
          .select({
            eventCode: events.code,
            saleEnd: events.saleEnd,
            conditions: events.conditions,
            handicapTeamA: events.handicapTeamA,
            handicapTeamB: events.handicapTeamB,
            category: category.category,
            tournament: tournaments.name,
            teamA: {
              name: sql`CASE 
                      WHEN ${events.handicapTeamA} IS NOT NULL 
                        THEN ${teamA.symbol} || ' ' || ${events.handicapTeamA} 
                      ELSE ${teamA.symbol} 
                    END`,
              symbol: teamA.symbol,
              img: teamA.url,
            },
            teamB: {
              name: sql`CASE 
                WHEN ${events.handicapTeamA} IS NOT NULL 
                  THEN ${teamB.symbol} || ' ' || ${events.handicapTeamB} 
                ELSE ${teamB.symbol} 
              END`,
              symbol: teamB.symbol,
              img: teamB.url,
            },
            standardTokenAddress: tokens.address,
            tokenName: tokens.symbol,
            tokenDecimal: tokens.decimal,
          })
          .from(events)
          .innerJoin(teamA, eq(teamA.id, events.teamA)) // Join team A
          .innerJoin(teamB, eq(teamB.id, events.teamB)) // Join team B
          .innerJoin(tokens, eq(tokens.id, events.tokenAddress)) // Join tokens
          .innerJoin(category, eq(category.id, events.category)) // Join category
          .leftJoin(tournaments, eq(tournaments.id, events.tournament)) // Join tournaments
          .where(and(...conditions)) // Apply all conditions
          .limit(parsedLimit)
          .offset(offset)
          .execute(),

        db
          .select({ count: sql<number>`COUNT(*)` })
          .from(events)
          .innerJoin(teamA, eq(teamA.id, events.teamA))
          .innerJoin(teamB, eq(teamB.id, events.teamB))
          .innerJoin(tokens, eq(tokens.id, events.tokenAddress))
          .innerJoin(category, eq(category.id, events.category))
          .leftJoin(tournaments, eq(tournaments.id, events.tournament))
          .where(and(...conditions)) // Apply all conditions
          .execute()
          .then((result) => result[0]?.count || 0), // Fetch total count
      ]);

      // Return the paginated response
      return Response.json({
        data: eventData,
        meta: {
          totalItems,
          currentPage: parsedPage,
          totalPages: Math.ceil(totalItems / parsedLimit),
        },
      });
    } catch (error) {
      console.error("Error fetching events:", error);
      return Response.json({ msg: "Failed to fetch events" });
    }
  } else {
    return Response.json({ error: "Method not allowed" });
  }
}
