import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { PutObjectCommand, S3 } from "@aws-sdk/client-s3";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

// Initialize S3 client
const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },

  region: process.env.AWS_REGION!,
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const fileType = searchParams.get("fileType");

  // Validate fileType before proceeding
  if (!fileType) {
    return NextResponse.json(
      { error: "File type is missing." },
      { status: 400 }
    );
  }

  try {
    const decodedFileType = decodeURIComponent(fileType);
    const fileExtension = decodedFileType.split("/")[1];
    const Key = `${randomUUID()}.${fileExtension}`;

    // S3 Params for the signed URL (without Expires)
    const s3Params = {
      Bucket: process.env.S3_BUCKET_NAME,
      Key,
      ContentType: decodedFileType, // Use the actual file type from the request
    };

    // Generate presigned URL with the expiration time set in the options
    const uploadUrl = await getSignedUrl(s3, new PutObjectCommand(s3Params), {
      expiresIn: 3600, // URL expires in 1 hour
    });

    const data = {
      uploadUrl,
      key: Key,
    };

    return NextResponse.json(
      { message: "Signed URL generated", data },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "An error occurred during the request." },
      { status: 500 }
    );
  }
}

// import S3 from "aws-sdk/clients/s3";
// import { randomUUID } from "crypto";
// import { NextRequest, NextResponse } from "next/server";

// // Initialize S3 client
// const s3 = new S3({
//   apiVersion: "2006-03-01",
//   accessKeyId: process.env.ACCESS_KEY,
//   secretAccessKey: process.env.SECRET_KEY,
//   region: process.env.REGION,
//   signatureVersion: "v4",
// });

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const fileType = searchParams.get("fileType");

//   // Validate fileType before proceeding
//   if (!fileType) {
//     return NextResponse.json(
//       { error: "File type is missing." },
//       { status: 400 }
//     );
//   }

//   try {
//     const decodedFileType = decodeURIComponent(fileType);
//     const fileExtension = decodedFileType.split("/")[1];
//     const Key = `${randomUUID()}.${fileExtension}`;

//     // S3 Params for the signed URL
//     const s3Params = {
//       Bucket: process.env.BUCKET_NAME,
//       Key,
//       Expires: 60 * 60, // URL expires in 1 hour
//       ContentType: decodedFileType, // Use the actual file type from the request
//     };

//     // Generate presigned URL
//     const uploadUrl = await s3.getSignedUrlPromise("putObject", s3Params);
//     // console.log("bakend Generated upload URL: ", uploadUrl);
//     // console.log("fileExtension: ", fileExtension);
//     // console.log("decodedFileType: ", decodedFileType);
//     // console.log("Key: ", Key);

//     const data = {
//       uploadUrl,
//       key: Key,
//     };

//     return NextResponse.json(
//       { message: "Signed URL generated", data },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error:", error);
//     return NextResponse.json(
//       { error: "An error occurred during the request." },
//       { status: 500 }
//     );
//   }
// }
