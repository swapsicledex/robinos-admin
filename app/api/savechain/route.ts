import { db } from "@/db/drizzle";
import { chains, NewChain } from "@/db/schema";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const chain: NewChain = {
    name: body.name,
    chainId: body.chainId,
    explorerUrl: body.explorerUrl,
    subdomainUrl: body.subdomainUrl,
    isMainnet: body.isMainnet,
    isActive: body.isActive,
    versusAddress: body.versusAddress,
    standardTokenAddress: body.standardTokenAddress,
    image: body.image,
  };
  const newChain = await db.insert(chains).values(chain).returning();
  return Response.json(newChain[0]);
}
