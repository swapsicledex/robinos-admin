import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const BUCKET_NAME = process.env.MINIO_BUCKET_NAME;

const client = new S3Client({   
  credentials: {
    accessKeyId: process.env.MINIO_KEY!,
    secretAccessKey: process.env.MINIO_SECRET!,
  },
  region: "tgbot",
  endpoint: process.env.MINIO_ENDPOINT!
});

export const createPresignedUrl = async (key: string) => {
  const command = new PutObjectCommand({ Bucket: BUCKET_NAME, Key: key});
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
  return signedUrl
};