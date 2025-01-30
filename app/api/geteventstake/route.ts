import { db } from "@/db/drizzle";
import {
  players,
  tokens,
  category,
  tournaments,
  robinosEvents,
  stakedEvents,
} from "@/db/schema";
import {
  eq,
  gte,
  lte,
  and,
  aliasedTable,
  sql,
  desc,
  asc,
  or,
} from "drizzle-orm";
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
      user,
      search,
      limit = 10,
      page = 1,
      sortBy = "saleEnd",
      sortDir = "desc",
    } = queryParams;

    // if (!chainId) {
    //   return Response.json({ error: "Missing required parameters" });
    // }

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
      user
        ? eq(sql`LOWER(${stakedEvents.user})`, user.toString().toLowerCase())
        : undefined,,
      chainId ? eq(robinosEvents.chainId, Number(chainId)) : undefined,
      categoryId ? eq(robinosEvents.category, Number(categoryId)) : undefined,
      tournamentId
        ? eq(robinosEvents.tournament, Number(tournamentId))
        : undefined,
      featuredValue === "true" ? eq(robinosEvents.isFeatured, true) : undefined,
      or(gte(stakedEvents.userDepositA, 0), gte(stakedEvents.userDepositB, 0)),
      gte(robinosEvents.saleEnd, Number(fromTimeValue)),
      lte(robinosEvents.saleEnd, Number(toTimeValue)),
      search ? sql`${robinosEvents.code} ILIKE ${`%${search}%`}` : undefined,
    ].filter(Boolean); // Filter out undefined values directly in the array

    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    const sortColumn: any =
      robinosEvents[sortBy as keyof typeof robinosEvents] ??
      robinosEvents.saleEnd; // Fallback to saleEnd
    const sortOrder = sortDir === "asc" ? asc(sortColumn) : desc(sortColumn);

    try {
      // Alias tables for team A and team B
      const teamA = aliasedTable(players, "teamA");
      const teamB = aliasedTable(players, "teamB");

      // Fetch the paginated event data directly with count
      const [eventData, totalItems] = await Promise.all([
        db
          .select({
            id: robinosEvents.id,
            eventCode: robinosEvents.code,
            saleEnd: robinosEvents.saleEnd,
            conditions: robinosEvents.conditions,
            handicapTeamA: robinosEvents.handicapTeamA,
            handicapTeamB: robinosEvents.handicapTeamB,
            category: category.name,
            tournament: tournaments.name,
            teamA: {
              name: sql`CASE 
                      WHEN ${robinosEvents.handicapTeamA} IS NOT NULL 
                        THEN ${teamA.symbol} || ' ' || ${robinosEvents.handicapTeamA} 
                      ELSE ${teamA.symbol} 
                    END`,
              symbol: teamA.symbol,
              img: teamA.url,
            },
            teamB: {
              name: sql`CASE 
                      WHEN ${robinosEvents.handicapTeamB} IS NOT NULL 
                        THEN ${teamB.symbol} || ' ' || ${robinosEvents.handicapTeamB} 
                      ELSE ${teamB.symbol} 
                    END`,
              symbol: teamB.symbol,
              img: teamB.url,
            },
            standardTokenAddress: tokens.address,
            tokenName: tokens.symbol,
            tokenDecimal: tokens.decimal,
            chainId: robinosEvents.chainId,
            isFeatured: robinosEvents.isFeatured,
            categoryId: robinosEvents.category,
            tournamentId: robinosEvents.tournament,
            totalDepositA: robinosEvents.totalDepositA,
            totalDepositB: robinosEvents.totalDepositB,
            isRefund: robinosEvents.isRefund,
            isCancelled: robinosEvents.isCancelled,
            isReward: robinosEvents.isReward,
            hasWinner: robinosEvents.hasWinner,
            winnerIndex: robinosEvents.winnerIndex,
            userDepositA: stakedEvents.userDepositA,
            userDepositB: stakedEvents.userDepositB,
          })
          .from(robinosEvents)
          .innerJoin(teamA, eq(teamA.id, robinosEvents.teamA)) // Join team A
          .innerJoin(teamB, eq(teamB.id, robinosEvents.teamB)) // Join team B
          .innerJoin(tokens, eq(tokens.id, robinosEvents.tokenAddress)) // Join tokens
          .innerJoin(category, eq(category.id, robinosEvents.category)) // Join category
          .leftJoin(tournaments, eq(tournaments.id, robinosEvents.tournament)) // Join tournaments
          .leftJoin(
            stakedEvents,
            and(
              eq(robinosEvents.code, stakedEvents.predictionCode),
              eq(robinosEvents.predictionNetwork, stakedEvents.network)
            )
          )
          .where(and(...conditions)) // Apply all conditions
          .orderBy(sortOrder)
          .limit(parsedLimit)
          .offset(offset)
          .execute(),

        db
          .select({ count: sql<number>`COUNT(*)` })
          .from(robinosEvents)
          .innerJoin(teamA, eq(teamA.id, robinosEvents.teamA))
          .innerJoin(teamB, eq(teamB.id, robinosEvents.teamB))
          .innerJoin(tokens, eq(tokens.id, robinosEvents.tokenAddress))
          .innerJoin(category, eq(category.id, robinosEvents.category))
          .leftJoin(tournaments, eq(tournaments.id, robinosEvents.tournament))
          .leftJoin(
            stakedEvents,
            and(
              eq(robinosEvents.code, stakedEvents.predictionCode),
              eq(robinosEvents.predictionNetwork, stakedEvents.network)
            )
          )
          .where(and(...conditions)) // Apply all conditions
          .execute()
          .then((result) => result[0]?.count || 0), // Fetch total count
      ]);

      const newData = {
        data: eventData,
        metadata: {
          totalItems,
          currentPage: parsedPage,
          totalPages: Math.ceil(totalItems / parsedLimit),
          itemsPerPage: parsedLimit,
        },
      };

      // Save data to cache with a TTL (e.g., 60 seconds)
      // await redisClient.set(cacheKey, JSON.stringify(newData), { EX: 60 });

      // Return the paginated response
      return Response.json(newData);
    } catch (error) {
      console.error("Error fetching events:", error);
      return Response.json({
        msg: "Failed to fetch events",
        data: [],
        metadata: {
          totalItems: 0,
          totalPages: 0,
          currentPage: parsedPage,
          itemsPerPage: parsedLimit,
        },
      });
    }
  } else {
    return Response.json({ error: "Method not allowed" });
  }
}
