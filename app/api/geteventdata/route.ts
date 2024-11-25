import { db } from "@/db/drizzle";
import { events, players, tokens, category } from "@/db/schema";
import { eq, gte, lte, and, aliasedTable } from "drizzle-orm";
import { NextApiRequest } from "next";
import { parse } from "querystring";

export async function GET(req: NextApiRequest) {
  if (req.method === "GET") {
    const queryParams = parse(req.url?.split("?")[1] || "");

    const { chainId, categoryId, fromTime, toTime, featured } =
      queryParams || {};

    if (!chainId) {
      return Response.json({ error: "Missing required parameters" });
    }

    // Optional parameters with a default values
    const currentTimestamp = Math.round(Date.now() / 1000);
    const fromTimeValue = fromTime ?? currentTimestamp - 90 * 24 * 60 * 60; //90 days back
    const toTimeValue = toTime ?? currentTimestamp;
    const featuredValue = featured ?? "false";
    const conditions = [
      eq(events.chainId, Number(chainId)),
      categoryId ? eq(events.category, Number(categoryId)) : undefined,
      featuredValue === "true" ? eq(events.isFeatured, true) : undefined,
      gte(events.saleEnd, Number(fromTimeValue)),
      lte(events.saleEnd, Number(toTimeValue)),
    ].filter((condition) => condition !== undefined);
    // Perform your logic using the parameters
    try {
      const teamA = aliasedTable(players, "teamA");
      const teamB = aliasedTable(players, "teamB");
      const eventData = await db
        .select({
          eventCode: events.code,
          saleEnd: events.saleEnd,
          conditions: events.conditions,
          handicapTeamA: events.handicapTeamA,
          handicapTeamB: events.handicapTeamB,
          category: category.category,
          teamA: {
            name: teamA.name,
            symbol: teamA.symbol,
            img: teamA.url,
          },
          teamB: {
            name: teamB.name,
            symbol: teamB.symbol,
            img: teamB.url,
          },
          standardTokenAddress: tokens.address,
          tokenName: tokens.symbol,
        })
        .from(events)
        .innerJoin(teamA, eq(teamA.id, events.teamA))
        .innerJoin(teamB, eq(teamB.id, events.teamB))
        .innerJoin(tokens, eq(tokens.id, events.tokenAddress))
        .innerJoin(category, eq(category.id, events.category))
        .where(and(...conditions))
        .execute();
      return Response.json(eventData);
    } catch (error) {
      console.error("Error fetching events:", error);
      Response.json({ msg: "Failed to fetch events" });
    }
  } else {
    return Response.json({ error: "Method not allowed" });
  }
}
