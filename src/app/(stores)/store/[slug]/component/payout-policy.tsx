import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Payout Policy component that outlines payout details for Udua platform sellers
const PayoutPolicy = () => {
  return (
    <>
      {/* Page Title */}
      <title>Udua Payout Policy</title>

      {/* Main Container */}
      <div className="container mx-auto py-8 max-w-3xl">
        {/* Card for structured content display */}
        <Card>
          <CardHeader>
            <CardTitle>Payout Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              At Udua, we are committed to ensuring that our sellers are paid
              accurately and on time for the sales they make on our platform.
              This payout policy outlines how payouts work, the available
              methods, and important considerations for managing your earnings.
            </p>

            {/* Payout Schedule Section */}
            <h2 className="text-xl font-semibold mb-2">1. Payout Schedule</h2>
            <ul className="list-disc pl-6 mb-4">
              {/* <li>
                <strong>Automatic Payouts:</strong> Udua processes payouts
                automatically on a [daily, weekly, or monthly] basis based on
                the schedule you select. Payouts are typically initiated within
                24 hours after your chosen period ends.
              </li> */}
              <li>
                <strong>Payouts:</strong> Once an order is marked as delivered
                and recieved by your client, you can request a payout for that
                order at any time, provided that your account balance meets the
                minimum threshold of [₦X or equivalent in your currency].
              </li>
              <li>
                <strong>Processing Time:</strong> Once a payout is initiated,
                funds will typically appear in your bank account within 1-3
                business days, depending on your payout method.
              </li>
            </ul>

            {/* Payout Methods Section */}
            <Separator />
            <h2 className="text-xl font-semibold mb-2">2. Payout Methods</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>Sellers can receive payouts via:</li>
              <ul className="list-disc pl-8">
                <li>Bank transfers</li>
                <li>Mobile wallets (e.g., Paga, OPay)</li>
              </ul>
              <li>
                You must verify your payout method before withdrawals can be
                processed. Udua may take up to 48 hours to verify new accounts
                to ensure security.
              </li>
            </ul>

            {/* Fees Section */}
            {/* <Separator />
            <h2 className="text-xl font-semibold mb-2">3. Fees</h2>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Udua does not charge fees for payouts via bank transfer or
                mobile wallets. However, if you choose other methods like
                international payments, additional fees may apply as per the
                service provider's policy.
              </li>
              <li>
                All fees are clearly outlined at the time of selecting your
                payout method.
              </li>
            </ul> */}

            {/* Payout Hold and Disputes Section */}
            <Separator />
            <h2 className="text-xl font-semibold mb-2">
              3. Payout Hold and Disputes
            </h2>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Payouts may be temporarily held if there is a dispute related to
                an order, chargeback, or if we suspect fraudulent activity.
              </li>
              <li>
                If your payout is on hold, you will be notified and provided
                with the necessary steps to resolve the issue.
              </li>
            </ul>

            {/* Returns, Refunds, and Chargebacks Section */}
            <Separator />
            <h2 className="text-xl font-semibold mb-2">
              4. Returns, Refunds, and Chargebacks
            </h2>
            <ul className="list-disc pl-6 mb-4">
              <li>
                If a buyer initiates a refund or chargeback after a payout has
                been made, the amount will be deducted from your next available
                payout. If no future payouts are pending, Udua will contact you
                for reimbursement or may adjust your account balance.
              </li>
            </ul>

            {/* Tax and Compliance Section */}
            {/* <Separator />
            <h2 className="text-xl font-semibold mb-2">
              7. Tax and Compliance
            </h2>
            <ul className="list-disc pl-6 mb-4">
              <li>
                Depending on your region, Udua may be required to withhold
                certain taxes on your earnings. You are responsible for ensuring
                that your tax documentation is up to date and complies with
                local tax laws.
              </li>
              <li>
                Udua will provide you with tax forms and annual statements as
                required for tax reporting purposes.
              </li>
            </ul> */}

            {/* Security and Fraud Prevention Section */}
            <Separator />
            <h2 className="text-xl font-semibold mb-2">
              5. Security and Fraud Prevention
            </h2>
            <ul className="list-disc pl-6 mb-4">
              <li>
                For your security, changes to your payout method will require
                additional verification, such as two-factor authentication
                (2FA). This helps prevent unauthorized changes to your account.
              </li>
            </ul>

            {/* Contact and Support Section */}
            <Separator />
            <h2 className="text-xl font-semibold mb-2">
              6. Contact and Support
            </h2>
            <ul className="list-disc pl-6 mb-4">
              <li>
                If you encounter any issues with your payout, our support team
                is available to help. You can reach us via
                <strong> support@udua.com </strong> or use the help center
                available in your seller dashboard.
              </li>
              <li>
                Please allow 1-3 business days for our team to resolve any
                payout issues.
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default PayoutPolicy;

// import React from "react";

// const PayoutPolicy = () => {
//   return (
//     <>
//       <title>Udua Payout Policy</title>

//       <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
//         <h1>Udua Payout Policy</h1>
//         <p>
//           At Udua, we are committed to ensuring that our sellers are paid
//           accurately and on time for the sales they make on our platform. This
//           payout policy outlines how payouts work, the available methods, and
//           important considerations for managing your earnings.
//         </p>

//         <h2>1. Payout Schedule</h2>
//         <ul>
//           <li>
//             <strong>Automatic Payouts:</strong> Udua processes payouts
//             automatically on a [daily, weekly, or monthly] basis based on the
//             schedule you select. Payouts are typically initiated within 24 hours
//             after your chosen period ends.
//           </li>
//           <li>
//             <strong>Manual Payouts:</strong> You can also request a manual
//             payout at any time, provided that your account balance meets the
//             minimum threshold of [₦X or equivalent in your currency].
//           </li>
//           <li>
//             <strong>Processing Time:</strong> Once a payout is initiated, funds
//             will typically appear in your bank account within 1-3 business days,
//             depending on your payout method.
//           </li>
//         </ul>

//         <h2>2. Payout Methods</h2>
//         <ul>
//           <li>Sellers can receive payouts via:</li>
//           <ul>
//             <li>Bank transfers</li>
//             <li>Mobile wallets (e.g., Paga, OPay)</li>
//             <li>Other available methods (e.g., PayPal)</li>
//           </ul>
//           <li>
//             You must verify your payout method before withdrawals can be
//             processed. Udua may take up to 48 hours to verify new accounts to
//             ensure security.
//           </li>
//         </ul>

//         <h2>3. Minimum Payout Threshold</h2>
//         <ul>
//           <li>
//             The minimum payout amount is [₦X]. If your balance is below this
//             threshold, it will roll over to the next payout cycle.
//           </li>
//           <li>
//             <strong>Currency Conversion:</strong> If your sales are made in a
//             different currency, conversion will be done at the current exchange
//             rate, and Udua will provide transparency on any fees that apply.
//           </li>
//         </ul>

//         <h2>4. Fees</h2>
//         <ul>
//           <li>
//             Udua does not charge fees for payouts via bank transfer or mobile
//             wallets. However, if you choose other methods like international
//             payments, additional fees may apply as per the service provider's
//             policy.
//           </li>
//           <li>
//             All fees are clearly outlined at the time of selecting your payout
//             method.
//           </li>
//         </ul>

//         <h2>5. Payout Hold and Disputes</h2>
//         <ul>
//           <li>
//             Payouts may be temporarily held if there is a dispute related to an
//             order, chargeback, or if we suspect fraudulent activity.
//           </li>
//           <li>
//             If your payout is on hold, you will be notified and provided with
//             the necessary steps to resolve the issue.
//           </li>
//         </ul>

//         <h2>6. Returns, Refunds, and Chargebacks</h2>
//         <ul>
//           <li>
//             If a buyer initiates a refund or chargeback after a payout has been
//             made, the amount will be deducted from your next available payout.
//             If no future payouts are pending, Udua will contact you for
//             reimbursement or may adjust your account balance.
//           </li>
//         </ul>

//         <h2>7. Tax and Compliance</h2>
//         <ul>
//           <li>
//             Depending on your region, Udua may be required to withhold certain
//             taxes on your earnings. You are responsible for ensuring that your
//             tax documentation is up to date and complies with local tax laws.
//           </li>
//           <li>
//             Udua will provide you with tax forms and annual statements as
//             required for tax reporting purposes.
//           </li>
//         </ul>

//         <h2>8. Security and Fraud Prevention</h2>
//         <ul>
//           <li>
//             For your security, changes to your payout method will require
//             additional verification, such as two-factor authentication (2FA).
//             This helps prevent unauthorized changes to your account.
//           </li>
//         </ul>

//         <h2>9. Contact and Support</h2>
//         <ul>
//           <li>
//             If you encounter any issues with your payout, our support team is
//             available to help. You can reach us via [support@udua.com] or use
//             the help center available in your seller dashboard.
//           </li>
//           <li>
//             Please allow 1-3 business days for our team to resolve any payout
//             issues.
//           </li>
//         </ul>
//       </div>
//     </>
//   );
// };

// export default PayoutPolicy;
