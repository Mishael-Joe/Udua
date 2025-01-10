import { connectToDB } from "@/lib/mongoose";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/models/user.model";
import nodemailer from "nodemailer";

const generateResetToken = () => {
  return Math.random().toString(36).substr(2); // Simplified for demonstration
};

export async function POST(request: NextRequest) {
  const requestBody = await request.json();
  const { email } = requestBody;
  // console.log("email", email);
  const transporter = nodemailer.createTransport({
    host: "smtp.zoho.com",
    port: 465,
    secure: true,
    auth: {
      user: "mishaeljoe55@zohomail.com",
      pass: process.env.NEXT_SECRET_APP_SPECIFIED_KEY,
    },
  });

  try {
    await connectToDB();

    const user = await User.findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: "Make sure you provide the right Email" },
        { status: 500 }
      );
    }

    const resetToken = generateResetToken();
    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${resetToken}`;

    user.forgotpasswordToken = resetToken,
    user.forgotpasswordTokenExpiry = Date.now() + 1000 * 60 * 15, // 15 minutes expiry: resetToken,

    await user.save();

    const mailOptions = {
      from: "mishaeljoe55@zohomail.com", // sender address
      to: email, // list of receivers
      subject: "Password Reset",
      html: `
          <h1>UDUA</h1> </br>
          <h2>Password Reset.</h2> </br>
          
          <b>Click <a href="${resetUrl}">here</a> to reset your password</b> </br>
          <p>Expires in 15 minutes.</p>
          
          <p>Or copy this link and paste it on your browse </p>
          <p>${resetUrl}</p>
    `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ error: "Reset email sent" }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error: ${error.message}` },
      { status: 500 }
    );
  }
}
