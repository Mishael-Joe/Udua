import { S3 } from "@aws-sdk/client-s3";
import { NextRequest, NextResponse } from "next/server";

const s3 = new S3({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },

  region: process.env.AWS_REGION!,
});

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keys = searchParams.getAll("keys[]");

  if (keys.length === 0) {
    return NextResponse.json(
      { error: "No file keys provided." },
      { status: 400 }
    );
  }

  const bucketName = process.env.BUCKET_NAME;

  // Ensure the bucket name is not undefined
  if (!bucketName) {
    return NextResponse.json(
      { error: "Bucket name is not defined." },
      { status: 500 }
    );
  }

  const deleteParams = {
    Bucket: bucketName, // Ensured that it's a string
    Delete: {
      Objects: keys.map((key) => ({ Key: key })),
    },
  };

  try {
    // Delete the objects from S3
    await s3.deleteObjects(deleteParams);
    return NextResponse.json(
      { message: "Files deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting objects:", error);
    return NextResponse.json(
      { error: "Error deleting files from S3." },
      { status: 500 }
    );
  }
}

// import S3 from "aws-sdk/clients/s3";
// import { NextRequest, NextResponse } from "next/server";

// const s3 = new S3({
//   apiVersion: "2006-03-01",
//   accessKeyId: process.env.ACCESS_KEY!,
//   secretAccessKey: process.env.SECRET_KEY!,
//   region: process.env.REGION!,
// });

// export async function DELETE(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const keys = searchParams.getAll("keys[]");

//   if (keys.length === 0) {
//     return NextResponse.json(
//       { error: "No file keys provided." },
//       { status: 400 }
//     );
//   }

//   const bucketName = process.env.BUCKET_NAME;

//   // Ensure the bucket name is not undefined
//   if (!bucketName) {
//     return NextResponse.json(
//       { error: "Bucket name is not defined." },
//       { status: 500 }
//     );
//   }

//   const deleteParams = {
//     Bucket: bucketName, // Ensured that it's a string
//     Delete: {
//       Objects: keys.map((key) => ({ Key: key })),
//     },
//   };

//   try {
//     // Delete the objects from S3
//     await s3.deleteObjects(deleteParams).promise();
//     return NextResponse.json(
//       { message: "Files deleted successfully" },
//       { status: 200 }
//     );
//   } catch (error) {
//     console.error("Error deleting objects:", error);
//     return NextResponse.json(
//       { error: "Error deleting files from S3." },
//       { status: 500 }
//     );
//   }
// }
