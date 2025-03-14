import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
import Settlement from "@/lib/models/settlement.model";
import Store from "@/lib/models/store.model";
import { sendEmail } from "@/lib/services/email.service";
import { BankDetails } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { orderID, settlementAmount, selectedPayoutAccount } =
      requestBody as {
        orderID: string;
        settlementAmount: number;
        selectedPayoutAccount: BankDetails;
      };

    await connectToDB();
    const storeID = await getStoreIDFromToken(request);

    if (!storeID) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    const store = await Store.findById(storeID).select("name storeEmail");

    const checkSettlement = await Settlement.findOne({
      storeID: storeID,
      orderID: orderID,
    });

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const text = `
    Dear ${store.name},

    We hope this message finds you well. We are writing to confirm that you have successfully requested a settlement for the following order on our platform:

    Order ID: ${orderID}
    Settlement Amount: ${settlementAmount}

    Payout Account:
    Bank Name: ${selectedPayoutAccount.bankName}
    Account Number: ${selectedPayoutAccount.accountNumber}
    Account Name: ${selectedPayoutAccount.accountHolderName}
    Your settlement request is currently being processed, and we will notify you once the payout has been completed.

    If you have any questions or need further assistance, please don't hesitate to reach out to our support team.

    Thank you for choosing to partner with us.

    Best regards,
    Udua Support Team
    Your E-commerce Site
    `;

    const html = `
    <!DOCTYPE html>
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6;">
        <p>Dear <strong>${store.name}</strong>,</p>

        <p>We hope this message finds you well. We are writing to confirm that you have successfully requested a settlement for the following order on our platform:</p>

        <ul>
          <li><strong>Order ID:</strong> ${orderID}</li>
          <li><strong>Settlement Amount:</strong> ${settlementAmount}</li>
        </ul>

        <strong>Payout Account:</strong>
        <ul>
          <li><strong>Bank Name:</strong> ${selectedPayoutAccount.bankName}</li>
          <li><strong>Account Number:</strong> ${selectedPayoutAccount.accountNumber}</li>
          <li><strong>Account Name:</strong> ${selectedPayoutAccount.accountHolderName}</li>
        </ul>

        <p>Your settlement request is currently being processed, and we will notify you once the payout has been completed.</p>

        <p>If you have any questions or need further assistance, please don't hesitate to reach out to our support team.</p>

        <p>Thank you for choosing to partner with us.</p>

        <p>Best regards,<br>
        <strong>Udua Support Team</strong><br>
        Your E-commerce Site</p>
      </body>
    </html>

    `;

    if (checkSettlement) {
      return NextResponse.json(
        {
          message: `Settlement has already been requested for orderID ${orderID}`,
        },
        { status: 409 }
      );
    }

    await sendEmail({
      to: store.storeEmail,
      subject: `Settlement Request Confirmation for Order ID: ${orderID}`,
      text,
      html,
    });

    // Create a new settlement request
    const settlement = new Settlement({
      storeID,
      orderID,
      settlementAmount,
      payoutAccount: selectedPayoutAccount,
      payoutStatus: "Requested",
    });

    await settlement.save();

    return NextResponse.json(
      { message: "Settlement requested successfully", settlement },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Error processing settlement request: ${error.message}` },
      { status: 500 }
    );
  }
}
