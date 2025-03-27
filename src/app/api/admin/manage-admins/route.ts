import { connectToDB } from "@/lib/mongoose";
import { Admin } from "@/lib/models/admin.model"; // Import your admin model
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { name, email, roles, password } = requestBody; // Assuming `roles` is an array of roles

  try {
    await connectToDB(); // Ensure the DB connection is established

    // Check if the admin already exists by email
    const adminAlreadyExists = await Admin.findOne({ email });
    if (adminAlreadyExists) {
      return NextResponse.json(
        { error: "Admin with this email already exists" },
        { status: 401 }
      );
    }

    // Hash the password
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Create a new admin document
    const newAdmin = new Admin({
      name,
      email,
      roles, // Array of roles selected
      password: hashedPassword, // Save the hashed password
    });

    const savedAdmin = await newAdmin.save(); // Save the admin to the database

    // Respond with success message
    return NextResponse.json(
      { message: `Admin created successfully`, success: true, savedAdmin },
      { status: 201 }
    );
  } catch (error: any) {
    // Handle any errors
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// import { connectToDB } from "@/lib/mongoose";
// import { NextRequest, NextResponse } from "next/server";
// import User from "@/lib/models/user.model";
// import bcryptjs from "bcryptjs";

// export async function GET(request: NextRequest) {
//   const { searchParams } = new URL(request.url);
//   const adminID = searchParams.get("adminID");

//   if (!adminID) {
//     return NextResponse.json({ error: "Admin ID is required" }, { status: 400 });
//   }

//   try {
//     await connectToDB();

//     const user = await User.findById(adminID).select(
//       "_id firstName lastName otherNames email phoneNumber address cityOfResidence stateOfResidence postalCode isVerified"
//     );

//     if (!user) {
//       return NextResponse.json({ error: "User not found" }, { status: 404 });
//     }

//     return NextResponse.json(
//       { message: "User found", data: user },
//       { status: 200 }
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { error: `Error: ${error.message}` },
//       { status: 500 }
//     );
//   }
// }

// export async function POST(request: NextRequest) {
//   const requestBody = await request.json();
//   const { confirmAdminID, password, type } = requestBody;

//   if (type === "makeUserAdmin") {
//     try {
//       await connectToDB();

//       const user = await User.findById(confirmAdminID);

//       if (!user) {
//         return NextResponse.json({ error: "User not found" }, { status: 404 });
//       }

//       // hash the password
//       const salt = await bcryptjs.genSalt(10);
//       const hashedPassword = await bcryptjs.hash(password, salt);

//       user.isAdmin = true;
//       user.adminPassword = hashedPassword;
//       await user.save();

//       return NextResponse.json(
//         { message: "Admin privileges granted successfully", data: user },
//         { status: 200 }
//       );
//     } catch (error: any) {
//       return NextResponse.json(
//         { error: `Error: ${error.message}` },
//         { status: 500 }
//       );
//     }
//   }

//   if (type === "suspendAdmin") {
//     try {
//       await connectToDB();

//       const user = await User.findById(confirmAdminID);

//       if (!user) {
//         return NextResponse.json({ error: "User not found" }, { status: 404 });
//       }

//       user.isAdmin = false;
//       user.adminPassword = null; // or a predefined value indicating suspension
//       await user.save();

//       return NextResponse.json(
//         { message: "Admin privileges suspended successfully", data: user },
//         { status: 200 }
//       );
//     } catch (error: any) {
//       return NextResponse.json(
//         { error: `Error: ${error.message}` },
//         { status: 500 }
//       );
//     }
//   }
// }
