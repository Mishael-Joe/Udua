import dotenv from "dotenv";
dotenv.config();

import nodemailer from "nodemailer";

// Create a reusable transporter
const transporter = nodemailer.createTransport({
  host: "smtp.zoho.com",
  port: 465,
  secure: true,
  auth: {
    user: "mishaeljoe55@zohomail.com",
    pass: process.env.NEXT_SECRET_APP_SPECIFIED_KEY,
  },
});

type EmailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

/**
 * Sends an email using the configured transporter
 * @param options Email options including recipient, subject, and content
 * @returns Promise that resolves when email is sent
 */
export async function sendEmail(options: EmailOptions): Promise<void> {
  const mailOptions = {
    from: '"Your E-commerce Site" <mishaeljoe55@zohomail.com>',
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}
