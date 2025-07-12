import { AbortMultipartUploadCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { s3 } from "@Utils/s3";

export async function POST(req: NextRequest) {
  try {
    const { uploadId, key } = await req.json();

    // Validate required fields
    if (!uploadId || !key) {
      return NextResponse.json(
        { error: "Missing required fields: uploadId and key" },
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

    const command = new AbortMultipartUploadCommand({
      Bucket: bucketName,
      Key: key,
      UploadId: uploadId,
    });

    await s3.send(command);

    return NextResponse.json(
      { message: "Upload aborted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error aborting upload:", error);
    return NextResponse.json(
      { error: "Failed to abort upload" },
      { status: 500 }
    );
  }
}
