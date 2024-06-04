import nodemailer from "nodemailer";
import User from "../models/user.model";

type SendMail = {
  email: string;
  emailType: "emailVerification" | "passwordReset";
  userId: string;
};

export const sendMail = async ({ email, emailType, userId }: SendMail) => {
  try {
    // create a hased token
    const token = Math.floor(100000 + Math.random() * 900000);

    if (emailType === "emailVerification") {
      await User.findByIdAndUpdate(userId, {
        verifyToken: token,
        verifyTokenExpiry: Date.now() + 1000 * 60 * 15, // 15 minutes expiry
      });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.zoho.com",
      port: 465,
      secure: true,
      auth: {
        user: "mishaeljoe55@zohomail.com",
        pass: process.env.NEXT_SECRET_APP_SPECIFIED_KEY,
      },
    });

    const mailOptions = {
      from: "mishaeljoe55@zohomail.com", // sender address
      to: email, // list of receivers
      subject: `ACCOUNT VERIFICATION`, // Subject line
      text: "", // plain text body
      html: `
          <h1>WELCOME TO UDUA</h1> </br>
          <h2>Someone has created an account on Udua using this Email address.</h2> </br>
          
          <p>If it was you, please enter this OTP:</p> </br>
          <b>${token}</b> </br>
          <p>OTP expires in 15 minutes.</p>
          
          <p>If you did not create this account, just ignore this message.</p>
        `, // html body
    };

    const mailResponse = await transporter.sendMail(mailOptions);

    return mailResponse;
  } catch (error: any) {
    console.error(error);
    throw new Error(`Error sending email`, error.message);
  }
};
