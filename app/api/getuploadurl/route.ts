import { createPresignedUrl } from "../../../utils/generateSignedUrl";

export async function GET() {
    const signedUrl = await createPresignedUrl("my-image")
    return Response.json({url: signedUrl})
}