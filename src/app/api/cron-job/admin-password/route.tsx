import { connectToDB } from "@/lib/mongoose";
import User from "@/lib/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import mongoose from "mongoose";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
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

    const adminEmails: string[] = [];
    const session = await mongoose.startSession();
    session.startTransaction();

    // Generate a password
    const password = Math.floor(100000 + Math.random() * 900000).toString();
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    // Find all admins and update their passwords
    const allAdmins = await User.find({ isAdmin: true });
    if (!allAdmins || allAdmins.length === 0) {
      throw new Error("No admin users found");
    }

    for (let admin of allAdmins) {
      admin.password = hashedPassword;
      adminEmails.push(admin.email);
      await admin.save({ session });
    }

    // Send email to all admins
    const mailOptions = {
      from: "mishaeljoe55@zohomail.com", // sender address
      to: adminEmails, // list of receivers
      subject: `ADMIN PASSWORD UPDATE`, // Subject line
      html: `
        <h1>ADMIN PASSWORD UPDATE FOR UDUA ADMINS</h1></br>
        <h2>Here is the new password for udua admins:</h2></br>
        <b>${password}</b></br>
        <p>This password expires in 3 days.</p>
      `, // HTML body
    };

    let mailResponse;
    try {
      mailResponse = await transporter.sendMail(mailOptions);
    } catch (mailError: any) {
      throw new Error("Failed to send email: " + mailError.message);
    }

    // Commit transaction
    await session.commitTransaction();
    session.endSession();

    return NextResponse.json(
      { message: "Admin passwords updated and emails sent", mailResponse },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
