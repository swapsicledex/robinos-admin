import { S3Client, DeleteObjectCommand } from "@aws-sdk/client-s3";

export const deleteobject = async (key: string) => {
  const BUCKET_NAME = process.env.NEXT_PUBLIC_CLOUDFLARE_R2_BUCKET_NAME;

  const client = new S3Client({
    region: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_REGION!,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_KEY!,
      secretAccessKey: process.env.NEXT_PUBLIC_CLOUDFLARE_R2_SECRET!,
    },
    endpoint: process.env.NEXT_PUBLIC_CUSTOM_URL!,
    forcePathStyle: true,
  });

  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await client.send(command);
    console.log(`Successfully deleted ${key}`, response);
    return true;
  } catch (error) {
    console.error(`Error deleting ${key}:`, error);
    return false;
  }
};
