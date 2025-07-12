// 📁 File: pages/api/complete-upload.ts
import { S3Client, CompleteMultipartUploadCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export async function POST(req: NextRequest) {
  const { uploadId, key, parts } = await req.json();

  try {
    const command = new CompleteMultipartUploadCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: key,
      UploadId: uploadId,
      MultipartUpload: { Parts: parts },
    });

    await s3.send(command);
    return NextResponse.json(
      { message: "Upload completed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error completing upload:", error);
    return NextResponse.json(
      { error: "Failed to complete upload" },
      { status: 500 }
    );
  }
}
