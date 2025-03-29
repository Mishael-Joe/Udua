import { NextRequest } from "next/server";
import jwt, { JwtPayload } from "jsonwebtoken";

// Define the userID interface to describe the expected token payload
interface UserID {
  id: string;
}

// Create a type guard to check if the payload is of type UserID
function isUserID(payload: any): payload is UserID {
  return (payload as UserID).id !== undefined;
}

export const getUserDataFromToken = (request: NextRequest): string | null => {
  try {
    const encodedToken = request.cookies.get("token")?.value || ``;

    // console.log(`encodedToken`, encodedToken);

    const decodedToken = jwt.verify(
      encodedToken,
      process.env.JWT_SECRET_KEY!
    ) as JwtPayload | string;

    // console.log(`decodedToken`, decodedToken);

    if (typeof decodedToken === "string") {
      throw new Error("Unexpected string token");
    }

    if (isUserID(decodedToken)) {
      return decodedToken.id;
    } else {
      throw new Error("Invalid token payload");
    }
  } catch (error: any) {
    console.error(error);
    return null;
    // throw new Error(`Error getting user data from token: ${error.message}`);
  }
};
