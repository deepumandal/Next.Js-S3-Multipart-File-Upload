import { UploadPartCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";
import { s3 } from "@Utils/s3";

interface GetPresignUrlRequest {
  uploadId: string;
  key: string;
  parts: number[];
}

interface PresignedUrlResponse {
  partNumber: number;
  signedUrl: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as GetPresignUrlRequest;
    const { uploadId, key, parts } = body;

    // Validate required fields
    if (!uploadId || !key || !Array.isArray(parts)) {
      return NextResponse.json(
        { error: "Missing required fields: uploadId, key, and parts array" },
        { status: 400 }
      );
    }

    // Validate environment variables
    const bucketName = process.env.AWS_BUCKET_NAME;
    if (!bucketName) {
      return NextResponse.json(
        { error: "AWS_BUCKET_NAME environment variable is not configured" },
        { status: 500 }
      );
    }

    console.log("Received data:", { uploadId, key, parts });

    const signedUrls: PresignedUrlResponse[] = await Promise.all(
      parts.map(async (partNumber: number) => {
        const command = new UploadPartCommand({
          Bucket: bucketName,
          Key: key,
          UploadId: uploadId,
          PartNumber: partNumber,
        });

        const signedUrl = await getSignedUrl(s3, command, { expiresIn: 3600 });
        return { partNumber, signedUrl };
      })
    );

    return NextResponse.json({ urls: signedUrls }, { status: 200 });
  } catch (error) {
    console.error("Error generating presigned URLs:", error);
    return NextResponse.json(
      { error: "Failed to generate presigned URLs" },
      { status: 500 }
    );
  }
}
