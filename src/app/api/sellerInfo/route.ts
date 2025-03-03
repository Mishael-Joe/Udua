"use strict";

import nodemailer from "nodemailer";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const requestBody = await request.json();
  const { seller, email, businessName, storeSlug, userID } = requestBody;
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
    const mailOptions = {
      from: "mishaeljoe55@zohomail.com", // sender address
      to: "mishaeljoe55@gmail.com", // list of receivers
      subject: `New Partnership Inquiry Form Submission - Action Required`, // Subject line
      text: "", // plain text body
      html: `
        <h3>Dear Team Udua,</h3> </br>

        <p>I hope this message finds you well. I wanted to bring to your attention that we have received a new partnership inquiry from a potential collaborator. Please review the details below at your earliest convenience:</p> </br>
        
        <p>Seller Information:</p> </br>
        <ul>
          <li> Seller Name:<b> ${seller}. <b><li>
          <li> Seller Email:<b> ${email}. <b><li>
          <li> Seller Business/Store Name:<b> ${businessName}. <b><li>
          <li> Store Slug:<b> ${storeSlug}. <b><li>
          <li> MongoDB user ID:<b> ${userID}. <b><li>
        </ul>        
        
        <p>This information was submitted through our partnership inquiry form. It is crucial to promptly review the details and assess the potential partnership. Your quick attention to this matter is greatly appreciated.</p> </br>
        <p>If you have any questions or require additional information, please do not hesitate to reach out. Thank you for your dedication and swift action in handling partnership inquiries.</p> </br>
        
        <b>Best regards</b> </br>
        <b>Udua Automated Notification</b>
      `, // html body
    };

    const furtherInfo = {
      from: "mishaeljoe55@zohomail.com", // sender address
      to: `${email}`, // list of receivers
      subject: `Acknowledgment of Your Partnership Inquiry`, // Subject line
      text: "", // plain text body
      html: `
        <h4>Dear ${seller},</h4>
    
        <p>I hope this message finds you well. Thank you for expressing your interest in partnering with Udua. We have received your partnership inquiry form. To proceed with the creation of your store, we kindly ask that you provide a detailed description of your store's offerings or the specific products/services you specialize in.</p> </br>
    
        <p>NOTE: This information is crucial as it will enable us to assist you in setting up your store on our platform. Please provide these details by replying to this email.</p> </br>
    
        <p>We appreciate your cooperation and look forward to the opportunity to work together in building a successful partnership.</p> </br>
    
        <p>Thank you for choosing Udua as your platform of choice.</p> </br>
    
        <b>Best regards,</b></br>
        <b>The Udua Team</b>
      `, // html body
    };

    await transporter.sendMail(mailOptions);
    await transporter.sendMail(furtherInfo);

    return NextResponse.json({ message: "Sucessfully sent" }, { status: 200 });
  } catch (error: any) {
    throw new Error("Error while sending Partnership Inquiry mail", error);
  }
}
