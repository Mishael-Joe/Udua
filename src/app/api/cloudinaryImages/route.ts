import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

interface Image {
  type: "image/jpeg" | "image/png";
  webkitRelativePath: string;
  name: string;
  lastModified: number;
  lastModifiedDate: Date;
  size: number;
}

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  // console.log("requestBody", requestBody);
  // const {} = requestBody;

  try {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const files = requestBody.files; // This assumes you send an array of file paths
    const uploadPromises = files.map((file: any) =>
      cloudinary.uploader.upload(file, { resource_type: "image" })
    );

    const results = await Promise.all(uploadPromises);
    return NextResponse.json(
      { message: `successfull`, results },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
