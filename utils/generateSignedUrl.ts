import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

export const createPresignedUrl = async (key: string) => {
  const BUCKET_NAME = process.env.MINIO_BUCKET_NAME;
  
  const client = new S3Client({   
    region: process.env.MINIO_REGION!,
    credentials: {
      accessKeyId: process.env.MINIO_KEY!,
      secretAccessKey: process.env.MINIO_SECRET!,
    },
    endpoint: process.env.MINIO_ENDPOINT!,
    forcePathStyle: true,
  });

  const command = new PutObjectCommand({ Bucket: BUCKET_NAME, Key: key});
  const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
  return signedUrl
};