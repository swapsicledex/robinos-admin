import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams
    const name = searchParams.get('name')
    return Response.json({url: `${process.env.MINIO_ENDPOINT}/${process.env.MINIO_BUCKET_NAME}/${name}`})
}