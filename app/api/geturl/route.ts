import { createPresignedUrl } from "../url";

export async function GET() {
    const signedUrl = await createPresignedUrl("my-image")
    return Response.json({url: signedUrl})
}