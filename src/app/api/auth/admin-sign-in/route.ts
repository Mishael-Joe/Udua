import { connectToDB } from "@/lib/mongoose";
import { type NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import * as jose from "jose";
import { Admin } from "@/lib/models/admin.model";
import type { Role } from "@/lib/rbac/permissions";
import { logAdminAction } from "@/lib/audit/audit-logger";

interface AdminTokenData {
  id: string;
  name: string;
  email: string;
  roles: Role[];
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { email, password } = requestBody;

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Connect to database
    await connectToDB();

    // Find the admin by email
    const admin = await Admin.findOne({ email });
    if (!admin) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if admin is active
    if (!admin.isActive) {
      return NextResponse.json(
        {
          error:
            "Your account has been deactivated. Please contact the system administrator.",
        },
        { status: 403 }
      );
    }

    // Verify the password
    const isPasswordValid = await bcryptjs.compare(password, admin.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create tokenData - ensure it's a plain object with serializable values
    const adminTokenData = {
      id: admin._id.toString(), // Convert ObjectId to string
      name: admin.name,
      email: admin.email,
      roles: admin.roles.map((role: Role) => String(role)), // Ensure roles are strings
    };

    // One Day in seconds
    const oneDayInSeconds = 24 * 60 * 60;

    // Check if JWT_SECRET_KEY exists
    if (!process.env.JWT_SECRET_KEY) {
      console.error("JWT_SECRET_KEY is not defined");
      return NextResponse.json(
        { error: "Internal server error" },
        { status: 500 }
      );
    }

    // Create token
    const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
    const token = await new jose.SignJWT({ ...adminTokenData }) // Spread the data to ensure it's a plain object
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime(`${oneDayInSeconds}s`)
      .sign(secret);

    // Update last login time
    admin.lastLogin = new Date();
    await admin.save();

    // Log this action
    await logAdminAction(
      adminTokenData,
      {
        action: "ADMIN_LOGIN",
        myModule: "AUTHENTICATION",
        details: { email: admin.email },
      },
      request
    );

    const response = NextResponse.json(
      {
        message: "Login successful",
        success: true,
        admin: {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          roles: admin.roles,
        },
      },
      { status: 200 }
    );

    response.cookies.set("adminToken", token, {
      httpOnly: true,
      maxAge: oneDayInSeconds,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    return response;
  } catch (error: any) {
    console.error("Admin sign-in error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Note: Admin Sign In Route. this code is working fine.

// import { connectToDB } from "@/lib/mongoose";
// import { type NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";
// import * as jose from "jose";
// import { Admin } from "@/lib/models/admin.model";
// import type { Role } from "@/lib/rbac/permissions";

// interface AdminTokenData {
//   id: string;
//   roles: Role[];
// }

// export async function POST(request: NextRequest) {
//   try {
//     const requestBody = await request.json();
//     const { email, password } = requestBody;

//     // Validate input
//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // Connect to database
//     await connectToDB();

//     // Find the admin by email
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // Check if admin is active
//     if (!admin.isActive) {
//       return NextResponse.json(
//         {
//           error:
//             "Your account has been deactivated. Please contact the system administrator.",
//         },
//         { status: 403 }
//       );
//     }

//     // Verify the password
//     const isPasswordValid = await bcryptjs.compare(password, admin.password);
//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // Create tokenData - ensure it's a plain object with serializable values
//     const adminTokenData = {
//       id: admin._id.toString(), // Convert ObjectId to string
//       roles: admin.roles.map((role: Role) => String(role)), // Ensure roles are strings
//     };

//     // One Day in seconds
//     const oneDayInSeconds = 24 * 60 * 60;

//     // Check if JWT_SECRET_KEY exists
//     if (!process.env.JWT_SECRET_KEY) {
//       console.error("JWT_SECRET_KEY is not defined");
//       return NextResponse.json(
//         { error: "Internal server error" },
//         { status: 500 }
//       );
//     }

//     // Create token
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
//     const token = await new jose.SignJWT({ ...adminTokenData }) // Spread the data to ensure it's a plain object
//       .setProtectedHeader({ alg: "HS256" })
//       .setIssuedAt()
//       .setExpirationTime(`${oneDayInSeconds}s`)
//       .sign(secret);

//     // Update last login time
//     admin.lastLogin = new Date();
//     await admin.save();

//     const response = NextResponse.json(
//       {
//         message: "Login successful",
//         success: true,
//         admin: {
//           id: admin._id.toString(),
//           name: admin.name,
//           email: admin.email,
//           roles: admin.roles,
//         },
//       },
//       { status: 200 }
//     );

//     response.cookies.set("adminToken", token, {
//       httpOnly: true,
//       maxAge: oneDayInSeconds,
//       path: "/",
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//     });

//     return response;
//   } catch (error: any) {
//     console.error("Admin sign-in error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// this was not working

// import { connectToDB } from "@/lib/mongoose";
// import { type NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";
// import * as jose from "jose";
// import { Admin } from "@/lib/models/admin.model";
// import type { Role } from "@/lib/rbac/permissions";

// interface AdminTokenData extends jose.JWTPayload {
//   id: string;
//   roles: Role[];
// }

// export async function POST(request: NextRequest) {
//   try {
//     const requestBody = await request.json();
//     const { email, password } = requestBody;

//     // Validate input
//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // Connect to database
//     await connectToDB();

//     // Find the admin by email
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // Check if admin is active
//     if (!admin.isActive) {
//       return NextResponse.json(
//         {
//           error:
//             "Your account has been deactivated. Please contact the system administrator.",
//         },
//         { status: 403 }
//       );
//     }

//     // Verify the password
//     const isPasswordValid = await bcryptjs.compare(password, admin.password);
//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // Create tokenData
//     const adminTokenData: AdminTokenData = {
//       id: admin._id.toString(),
//       roles: admin.roles as Role[],
//     };

//     // One Day in seconds
//     const oneDayInSeconds = 24 * 60 * 60;

//     // Check if JWT_SECRET_KEY exists
//     if (!process.env.JWT_SECRET_KEY) {
//       console.error("JWT_SECRET_KEY is not defined");
//       return NextResponse.json(
//         { error: "Internal server error" },
//         { status: 500 }
//       );
//     }

//     // Create token
//     const secret = new TextEncoder().encode(process.env.JWT_SECRET_KEY);
//     const token = await new jose.SignJWT(adminTokenData)
//       .setProtectedHeader({ alg: "HS256" })
//       .setExpirationTime(oneDayInSeconds + "s")
//       .sign(secret);

//     // Update last login time
//     admin.lastLogin = new Date();
//     await admin.save();

//     const response = NextResponse.json(
//       {
//         message: "Login successful",
//         success: true,
//         admin: {
//           id: admin._id,
//           name: admin.name,
//           email: admin.email,
//           roles: admin.roles,
//         },
//       },
//       { status: 200 }
//     );

//     response.cookies.set("adminToken", token, {
//       httpOnly: true,
//       maxAge: oneDayInSeconds,
//       path: "/",
//       // secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//     });

//     return response;
//   } catch (error: any) {
//     console.error("Admin sign-in error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// import { connectToDB } from "@/lib/mongoose";
// import { type NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { Admin } from "@/lib/models/admin.model";
// import type { Role } from "@/lib/rbac/permissions";

// interface AdminTokenData {
//   id: string;
//   roles: Role[];
// }

// export async function POST(request: NextRequest) {
//   try {
//     const requestBody = await request.json();
//     const { email, password } = requestBody;

//     // Validate input
//     if (!email || !password) {
//       return NextResponse.json(
//         { error: "Email and password are required" },
//         { status: 400 }
//       );
//     }

//     // Connect to database
//     await connectToDB();

//     // Find the admin by email
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // Check if admin is active
//     if (!admin.isActive) {
//       return NextResponse.json(
//         {
//           error:
//             "Your account has been deactivated. Please contact the system administrator.",
//         },
//         { status: 403 }
//       );
//     }

//     // Verify the password
//     const isPasswordValid = await bcryptjs.compare(password, admin.password);
//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // Create tokenData
//     const adminTokenData: AdminTokenData = {
//       id: admin._id.toString(),
//       roles: admin.roles as Role[],
//     };

//     // One Day in seconds
//     const oneDayInSeconds = 24 * 60 * 60;

//     // Check if JWT_SECRET_KEY exists
//     if (!process.env.JWT_SECRET_KEY) {
//       console.error("JWT_SECRET_KEY is not defined");
//       return NextResponse.json(
//         { error: "Internal server error" },
//         { status: 500 }
//       );
//     }

//     // Create token
//     const token = jwt.sign(adminTokenData, process.env.JWT_SECRET_KEY, {
//       expiresIn: oneDayInSeconds,
//     });

//     // Update last login time
//     admin.lastLogin = new Date();
//     await admin.save();

//     const response = NextResponse.json(
//       {
//         message: "Login successful",
//         success: true,
//         admin: {
//           id: admin._id,
//           name: admin.name,
//           email: admin.email,
//           roles: admin.roles,
//         },
//       },
//       { status: 200 }
//     );

//     response.cookies.set("adminToken", token, {
//       httpOnly: true,
//       maxAge: oneDayInSeconds,
//       path: "/",
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//     });

//     return response;
//   } catch (error: any) {
//     console.error("Admin sign-in error:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// import { connectToDB } from "@/lib/mongoose";
// import User from "@/lib/models/user.model";
// import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";
// import { Admin } from "@/lib/models/admin.model";

// interface adminData {
//   id: string;
//   roles: string[];
// }

// export async function POST(request: NextRequest) {
//   const requestBody = await request.json();
//   // console.log("requestBody", requestBody);
//   const { email, password } = requestBody;

//   try {
//     connectToDB();

//     // Find the admin by email
//     const admin = await Admin.findOne({ email });
//     if (!admin) {
//       return NextResponse.json({ error: "Admin not found" }, { status: 401 });
//     }

//     // Verify the password
//     const isPasswordValid = await bcryptjs.compare(password, admin.password);
//     if (!isPasswordValid) {
//       return NextResponse.json(
//         { error: "Invalid credentials" },
//         { status: 401 }
//       );
//     }

//     // create tokenData
//     const adminTokenData: adminData = {
//       id: admin._id as string,
//       roles: admin.roles,
//     };

//     // One Day in seconds
//     const oneDayInSeconds = 24 * 60 * 60;

//     // create token
//     const token = await jwt.sign(adminTokenData, process.env.JWT_SECRET_KEY!, {
//       expiresIn: oneDayInSeconds,
//     });

//     const response = NextResponse.json(
//       { message: "Login successful", success: true, adminTokenData },
//       { status: 200 }
//     );

//     response.cookies.set("adminToken", token, {
//       httpOnly: true,
//       maxAge: oneDayInSeconds,
//     });

//     return response;
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }

// import { connectToDB } from "@/lib/mongoose";
// import User from "@/lib/models/user.model";
// import { NextRequest, NextResponse } from "next/server";
// import bcryptjs from "bcryptjs";
// import jwt from "jsonwebtoken";

// interface adminData {
//   id: string;
// }

// export async function POST(request: NextRequest) {
//   const requestBody = await request.json();
//   // console.log("requestBody", requestBody);
//   const { email, password } = requestBody;

//   try {
//     connectToDB();
//     // Check if the user exist
//     const user = await User.findOne({ email });
//     if (!user) {
//       return NextResponse.json(
//         { error: "Make sure you provide the right Email" },
//         { status: 401 }
//       );
//     }

//     if (user.adminPassword !== undefined || user.adminPassword !== false) {
//       // check it password is correct
//       const validatePassword = await bcryptjs.compare(
//         password,
//         user.adminPassword
//       );

//       if (!validatePassword) {
//         return NextResponse.json(
//           { error: "Invalid password" },
//           { status: 401 }
//         );
//       }

//       // create tokenData
//       const adminTokenData: adminData = {
//         id: user._id,
//       };

//       // Three Days in seconds
//       // const threeDaysInSeconds = 3 * 24 * 60 * 60;

//       // One Day in seconds
//       const oneDayInSeconds = 24 * 60 * 60;

//       // create token
//       const token = await jwt.sign(
//         adminTokenData,
//         process.env.JWT_SECRET_KEY!,
//         {
//           expiresIn: oneDayInSeconds,
//         }
//       );

//       const response = NextResponse.json(
//         { message: "Login successful", success: true, adminTokenData },
//         { status: 200 }
//       );

//       response.cookies.set("adminToken", token, {
//         httpOnly: true,
//         maxAge: oneDayInSeconds,
//       });

//       return response;
//     } else {
//       return NextResponse.json({ error: "Access Denied" }, { status: 401 });
//     }
//   } catch (error: any) {
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }
