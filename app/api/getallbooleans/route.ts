import { NextRequest, NextResponse } from "next/server";
import { parse } from "querystring";

export async function GET(req: NextRequest) {
  if (req.method === "GET") {
    const queryParams = parse(req.url?.split("?")[1] || "");
    const { limit = 20, page = 1 } = queryParams;

    const parsedLimit = Math.max(1, parseInt(limit as string, 10)); // Ensure limit is at least 1
    const parsedPage = Math.max(1, parseInt(page as string, 10)); // Ensure page is at least 1

    return NextResponse.json({
      data: [
        {
          id: 1,
          name: "Yes",
        },
        {
          id: 2,
          name: "No",
        },
        {
          id: 3,
          name: "Over",
        },
        {
          id: 4,
          name: "Under",
        },
      ],
      metadata: {
        totalItems: 2,
        totalPages: 1,
        currentPage: parsedPage,
        itemsPerPage: parsedLimit,
      },
    });
  }

  return NextResponse.json({ msg: "Method not allowed" }, { status: 405 });
}
