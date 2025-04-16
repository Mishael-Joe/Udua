import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import { sendEmail } from "@/lib/services/email.service";
import Store from "@/lib/models/store.model";
import { v4 as uuidv4 } from "uuid";
import { randomBytes } from "crypto";

const generateResetToken = () => {
  return uuidv4({
    random: randomBytes(16),
  });
};

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { email, ref } = requestBody as {
    email: string;
    ref: "user" | "store";
  };

  try {
    // Establish database connection
    await connectToDB();

    // Validate email existence in appropriate collection
    if (ref === "user") {
      const user = await User.findOne({ email });
      if (!user) {
        return NextResponse.json(
          { error: "Make sure you provide the right Email" },
          { status: 500 }
        );
      }

      // Generate reset token and URL
      const resetToken = generateResetToken();
      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}&ref=${ref}`; // Fixed parameter separator

      // Update user document with token and expiry
      user.forgotpasswordToken = resetToken;
      user.forgotpasswordTokenExpiry = Date.now() + 1000 * 60 * 15; // 15 minutes expiry
      await user.save();

      // Send password reset email
      await sendEmail({
        to: email,
        subject: "UDUA Password Reset Request",
        text: `UDUA Password Reset\n--------------------------\n
You're receiving this because you requested a password reset for your User account.\n
Please click the following link to reset your password:\n
${resetUrl}\n
This link will expire in 15 minutes.\n
If you didn't request this, please ignore this email.`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
    .header { color: #2c3e50; font-size: 24px; margin-bottom: 20px; }
    .content { margin: 15px 0; }
    .button { 
      display: inline-block; padding: 10px 20px; 
      background-color: #2476cf; color: #fff; 
      text-decoration: none; border-radius: 3px; 
    }
    .footer { margin-top: 20px; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">UDUA Password Reset</div>
    <div class="content">
      <p>You're receiving this because you requested a password reset for your <strong>User Account</strong>.</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUrl}" class="button">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
      <p>Can't click the button? Copy this URL to your browser:<br>
      <code>${resetUrl}</code></p>
    </div>
    <div class="footer">
      If you didn't request this password reset, please ignore this email.
    </div>
  </div>
</body>
</html>`,
      });
    }

    if (ref === "store") {
      const store = await Store.findOne({ email });
      if (!store) {
        return NextResponse.json(
          { error: "Make sure you provide the right Email" },
          { status: 500 }
        );
      }

      const resetToken = generateResetToken();
      const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}&ref=${ref}`; // Fixed parameter separator

      store.forgotpasswordToken = resetToken;
      store.forgotpasswordTokenExpiry = Date.now() + 1000 * 60 * 15;
      await store.save();

      await sendEmail({
        to: email,
        subject: "UDUA Store Account Password Reset",
        text: `UDUA Store Password Reset\n--------------------------\n
You're receiving this because you requested a password reset for your Store account.\n
Please click the following link to reset your password:\n
${resetUrl}\n
This link will expire in 15 minutes.\n
If you didn't request this, please ignore this email.`,
        html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 20px auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; }
    .header { color: #2c3e50; font-size: 24px; margin-bottom: 20px; }
    .content { margin: 15px 0; }
    .button { 
      display: inline-block; padding: 10px 20px; 
      background-color: #2476cf; color: #fff;  
      text-decoration: none; border-radius: 3px; 
    }
    .footer { margin-top: 20px; font-size: 12px; color: #777; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">UDUA Store Account Password Reset</div>
    <div class="content">
      <p>You're receiving this because you requested a password reset for your <strong>Store Account</strong>.</p>
      <p>Click the button below to reset your password:</p>
      <a href="${resetUrl}" class="button">Reset Password</a>
      <p>This link will expire in 15 minutes.</p>
      <p>Can't click the button? Copy this URL to your browser:<br>
      <code>${resetUrl}</code></p>
    </div>
    <div class="footer">
      If you didn't request this password reset, please ignore this email.
    </div>
  </div>
</body>
</html>`,
      });
    }

    return NextResponse.json({ message: "Reset email sent" }, { status: 200 });
  } catch (error: any) {
    console.error(`Password reset error: ${error.message}`);
    return NextResponse.json(
      { error: "Internal server error" }, // Generic message for production
      { status: 500 }
    );
  }
}
