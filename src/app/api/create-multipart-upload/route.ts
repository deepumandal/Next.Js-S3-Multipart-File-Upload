import { S3Client, CreateMultipartUploadCommand } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";
import { AnyType } from "@AppTypes/AnyType";

const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_KEY_ID!,
  },
});

export async function POST(req: NextRequest) {
  try {
    const { fileName, fileType }: AnyType = await req.json();

    const command = new CreateMultipartUploadCommand({
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileName,
      ContentType: fileType,
    });

    const result = await s3.send(command);
    return NextResponse.json({ uploadId: result.UploadId, key: fileName });
  } catch (error) {
    console.error("Error creating multipart upload:", error);
    return NextResponse.json(
      { error: "Failed to create multipart upload" },
      { status: 500 }
    );
  }
}
