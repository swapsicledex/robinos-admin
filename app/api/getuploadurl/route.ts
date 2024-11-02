import { NextRequest } from "next/server";
import { createPresignedUrl } from "../../../utils/generateSignedUrl";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const name = searchParams.get('name')
    if(!name) return Response.json({msg: "Please Provide Name in query"})
    const signedUrl = await createPresignedUrl(name)
    return Response.json({url: signedUrl})
}