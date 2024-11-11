import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const createPresignedUrl = async (key: string) => {
  const BUCKET_NAME = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME;
  
  const client = new S3Client({
    region: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_REGION!,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_KEY!,
      secretAccessKey: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_SECRET!,
    },
    endpoint: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_ENDPOINT!,
    forcePathStyle: true,
  });

  const command = new PutObjectCommand({ Bucket: BUCKET_NAME, Key: key});
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
  return signedUrl
};