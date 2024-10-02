"use client";

import { siteConfig } from "@/config/site";
import React, { FormEvent, useState } from "react";

const UduaPricing = () => {
  const [amount, setAmount] = useState(2000);
  const feePercentage = 8.25 / 100;
  const flatFee = 200;
  const feeCap = 2000;

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    if (!isNaN(value)) {
      setAmount(value);
    }
  };

  const calculateFees = () => {
    // If the amount is less than 2500, NGN 100 flat fee is waived
    const transactionFee =
      amount >= 2500 ? amount * feePercentage + flatFee : amount * feePercentage;
    // The maximum transaction fee is capped at NGN 2000
    return Math.min(transactionFee, feeCap);
  };

  const settleAmount = amount - calculateFees();

  return (
    <div className=" max-w-5xl p-5 mx-auto">
      {/* Pricing Section */}
      <section className="bg-accent dark:bg-accent/30 text-[#0b2744] dark:text-slate-200 font-semibold border rounded-lg p-5 text-center">
        <h2 className="sm:text-5xl">Simple, Fair Pricing</h2>
        <p className="pt-3">{siteConfig.name} only makes money when you do.</p>

        <div className="flex items-center justify-center">
          <div className="p-5 rounded-lg sm:w-1/2 text-center">
            <p>8.25% + NGN 200</p>
            <ul>
              <li>₦200 fee waived for transactions under ₦2500</li>
              <li>Transactions fees are capped at ₦2000</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className="bg-[#f1f9ff] dark:bg-accent/30 text-[#0b2744] dark:text-slate-200 font-semibold border rounded-lg p-5 text-center mt-5">
        <h2 className="sm:text-2xl">Do the Math</h2>
        <p className="pt-3">
          See how much it costs to use {siteConfig.name}. Enter an amount into
          the calculator to see our charges.
        </p>

        {/* User input field */}
        <div className="my-5 flex flex-col sm:flex-row sm:items-center sm:justify-center">
          <label htmlFor="amountInput" className="mr-2.5">
            Enter amount:
          </label>
          <div className="relative sm:w-1/2">
            <p className=" absolute top-2.5 left-2 text-xl mt-2 sm:mt-0">NGN</p>
            <input
              id="amountInput"
              type="text"
              value={amount}
              onChange={handleAmountChange}
              className="p-2.5 rounded-lg focus:outline-blue-400 mt-2 pl-14 text-xl sm:mt-0 w-full absolut"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-8 justify-between rounded-lg p-5 bg-[#0b2744] text-slate-100">
          <div>
            <p>If your customer pays</p>
            <h3>NGN {amount}</h3>
          </div>
          <div>
            <p>We'll settle you</p>
            <h3>NGN {settleAmount.toFixed(2)}</h3>
          </div>
          <div>
            <p>
              {siteConfig.name} fees{" "}
              {amount < 2500
                ? `${(feePercentage * 100).toFixed(1)}%`
                : `${(feePercentage * 100).toFixed(1)}% + 200`}
            </p>
            <h3>NGN {calculateFees().toFixed(2)}</h3>
          </div>
        </div>
      </section>
    </div>
  );
};

export default UduaPricing;