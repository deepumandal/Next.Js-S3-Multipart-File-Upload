import { S3Client, UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import type { NextApiRequest, NextApiResponse } from "next";

const s3 = new S3Client();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { uploadId, key, parts } = req.body; // parts = [1, 2, 3, ...]

  const signedUrls = await Promise.all(
    parts.map(async (partNumber: number) => {
      const command = new UploadPartCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        UploadId: uploadId,
        PartNumber: partNumber,
      });

      const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
      return { partNumber, signedUrl };
    })
  );

  res.status(200).json({ urls: signedUrls });
}
