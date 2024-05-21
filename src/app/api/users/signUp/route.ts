import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  console.log("requestBody", requestBody);
  const {
    firstName,
    lastName,
    otherNames,
    email,
    password,
    address,
    phoneNumber,
  } = requestBody;

  try {
    connectToDB();
    // Check if the user already exist
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return NextResponse.json(
        { error: "user already exist" },
        { status: 500 }
      );
    }

    // hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // create a new user in the database
    const newUser = new User({
      firstName,
      lastName,
      otherNames,
      email,
      password: hashedPassword,
      address,
      phoneNumber,
    });

    const savedUser = await newUser.save();

    return NextResponse.json(
      { message: `User created successfully`, success: true, savedUser },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
