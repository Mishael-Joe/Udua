import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(request: NextRequest) {
  try {
    // Validate request body
    const requestBody = await request.json();
    const requiredFields = [
      "firstName",
      "lastName",
      "phoneNumber",
      "email",
      "address",
      "cityOfResidence",
      "stateOfResidence",
      "postalCode",
    ];

    // console.log("requestBody", requestBody);
    // Check for missing required fields
    const missingFields = requiredFields.filter((field) => !requestBody[field]);
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(", ")}` },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(requestBody.email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Get user ID from token
    const accountId = await getUserDataFromToken(request);
    if (!accountId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to database
    await connectToDB();

    // Update user document
    const updatedUser = await User.findByIdAndUpdate(
      accountId,
      {
        $set: {
          firstName: requestBody.firstName,
          lastName: requestBody.lastName,
          // otherNames: requestBody.otherNames || "",
          phoneNumber: requestBody.phoneNumber,
          email: requestBody.email.toLowerCase(),
          address: requestBody.address,
          cityOfResidence: requestBody.cityOfResidence,
          stateOfResidence: requestBody.stateOfResidence,
          postalCode: requestBody.postalCode,
        },
      },
      { new: true, runValidators: true } // Return updated doc and run schema validators
    );

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}

// import { connectToDB } from "@/lib/mongoose";
// import User from "@/lib/models/user.model";
// import { getUserDataFromToken } from "@/lib/helpers/getUserDataFromToken";
// import { NextRequest, NextResponse } from "next/server";

// export async function POST(request: NextRequest) {
//   const requestBody = await request.json();
//   const {
//     firstName,
//     lastName,
//     otherNames,
//     phoneNumber,
//     email,
//     address,
//     cityOfResidence,
//     stateOfResidence,
//     postalCode,
//   } = requestBody;
//   console.log("requestBody", requestBody);

//   try {
//     connectToDB();
//     const accountId = await getUserDataFromToken(request);

//     // Update User model
//     const response = await User.findByIdAndUpdate(accountId, {
//       firstName: firstName,
//       lastName: lastName,
//       otherNames: otherNames,
//       phoneNumber: phoneNumber,
//       email: email,
//       address: address,
//       cityOfResidence: cityOfResidence,
//       stateOfResidence: stateOfResidence,
//       postalCode: postalCode,
//       isVerified: false,
//     });

//     return NextResponse.json(
//       { message: `User created successfully`, response },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     console.log(error);
//     throw new Error(`Error updating user data: ${error}`);
//   }
// }
