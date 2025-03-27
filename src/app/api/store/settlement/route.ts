import { NextRequest, NextResponse } from "next/server";
import { connectToDB } from "@/lib/mongoose";
import { getStoreIDFromToken } from "@/lib/helpers/getStoreIDFromToken";
import Settlement from "@/lib/models/settlement.model";
import Store from "@/lib/models/store.model";
import { sendEmail } from "@/lib/services/email.service";
import { BankDetails } from "@/types";
import Order from "@/lib/models/order.model";

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { mainOrderID, subOrderID, settlementAmount, selectedPayoutAccount } =
      requestBody as {
        mainOrderID: string;
        subOrderID: string;
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

    if (!store) {
      return NextResponse.json({ error: "Store not found" }, { status: 404 });
    }

    const checkSettlement = await Settlement.findOne({
      storeID: storeID,
      mainOrderID: mainOrderID,
      subOrderID: subOrderID,
    });

    if (checkSettlement) {
      return NextResponse.json(
        {
          message: `Settlement has already been requested for orderID ${mainOrderID}`,
        },
        { status: 409 }
      );
    }

    const text = `
    Dear ${store.name},

    We hope this message finds you well. We are writing to confirm that you have successfully requested a settlement for the following order on our platform:

    Order ID: ${mainOrderID}
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
          <li><strong>Order ID:</strong> ${mainOrderID}</li>
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

    const result = await Order.updateOne(
      {
        _id: mainOrderID,
        "subOrders._id": subOrderID,
      },
      {
        $set: {
          "subOrders.$.payoutStatus": "Requested",
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Order or SubOrder not found" },
        { status: 404 }
      );
    }

    if (result.modifiedCount === 0) {
      return NextResponse.json(
        { error: "No changes made to the order" },
        { status: 400 }
      );
    }

    // Create a new settlement request
    const settlement = new Settlement({
      storeID,
      mainOrderID,
      subOrderID,
      settlementAmount,
      payoutAccount: selectedPayoutAccount,
      payoutStatus: "Requested",
    });

    await settlement.save();

    await sendEmail({
      to: store.storeEmail,
      subject: `Settlement Request Confirmation for Order ID: ${mainOrderID}`,
      text,
      html,
    });

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
