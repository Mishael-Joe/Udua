// api/s3-bucket/generate-download-url route

import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { NextRequest, NextResponse } from "next/server";

// Initialize S3 client
const s3Client = new S3Client({ region: process.env.AWS_REGION });

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const s3Key = searchParams.get("s3Key"); // The S3 key (file path) for the product

  // Validate that the S3 key is provided
  if (!s3Key) {
    return NextResponse.json({ error: "S3 key is missing." }, { status: 400 });
  }

  try {
    // Create the S3 getObject command
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME, // S3 bucket name
      Key: s3Key,
    });

    // Generate the signed URL for downloading
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    }); // 1-hour expiry

    // Respond with the signed URL
    return NextResponse.json({ downloadUrl: signedUrl }, { status: 200 });
  } catch (error) {
    console.error("Error generating download URL:", error);
    return NextResponse.json(
      { error: "Failed to generate download URL." },
      { status: 500 }
    );
  }
}
