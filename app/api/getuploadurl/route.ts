import { createPresignedUrl } from "../../../utils/generateSignedUrl";

export async function GET() {
    const signedUrl = await createPresignedUrl("panda.jpg")
    return Response.json({url: signedUrl})
}