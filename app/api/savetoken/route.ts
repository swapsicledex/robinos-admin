import { db } from "@/db/drizzle";
import { NewToken, tokens } from "@/db/schema";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token: NewToken = {
    address: body.address,
    symbol: body.symbol,
    chainId: body.chainId,
    decimal: body.decimal,
    image: body.image,
  };
  const newToken = await db.insert(tokens).values(token).returning();
  return Response.json(newToken[0]);
}
