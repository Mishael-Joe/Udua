"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BankDetails, PayoutAccount } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { calculateCommission } from "@/constant/constant";
import { addCommasToNumber } from "@/lib/utils";

interface PayableAmount {
  payableAmount: number;
  orderID: string;
}

function PayoutDialog({ payableAmount, orderID }: PayableAmount) {
  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayoutAccount, setselectedPayoutAccount] =
    useState<BankDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchPayoutAccounts() {
      try {
        const response = await axios.post("/api/store/fetch-payout-accounts");

        if (response.status === 200) {
          setPayoutAccounts(response.data.payoutAccounts);
        } else {
          throw new Error(
            response.data.error || "Failed to fetch payout accounts"
          );
        }
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPayoutAccounts();
  }, []);

  const handleClick = (index: number) => {
    setselectedPayoutAccount(payoutAccounts[index].bankDetails);

    // console.log('selectedPayoutAccount', selectedPayoutAccount)
  };

  const handleSubmit = async () => {
    const body = {
      orderID: orderID,
      settlementAmount: payableAmount,
      selectedPayoutAccount: selectedPayoutAccount
    };

    try {
      const response = await axios.post("/api/store/settlement", body);

      if (response.status === 200) {
      } else {
      }
    } catch (error: any) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            className="bg-udua-orange-primary/85 text-slate-100 hover:bg-udua-orange-primary hover:text-slate-100"
            variant={"ghost"}
          >
            <span>Request Payout</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Select Account</DialogTitle>
            <DialogDescription>
              Please select an account you want your money transferred to.
            </DialogDescription>

            <p>
              Note: Your total payable Amount is &#8358;{" "}
              {addCommasToNumber(payableAmount)}
            </p>

            {loading ? (
              <p>Loading payout accounts...</p>
            ) : error ? (
              <p className="text-red-500">{error}</p>
            ) : (
              <div className="py-4">
                <h2 className="pb-2">
                  Payout Account{payoutAccounts.length > 1 && "s"}
                </h2>
                {payoutAccounts.length > 0 ? (
                  <div className=" h-52 overflow-auto">
                    {payoutAccounts.map((account, index) => (
                      <Card
                        key={index}
                        className={`cursor-pointer my-3 ${
                          selectedPayoutAccount?.bankName ===
                          account.bankDetails.bankName
                            ? "!border-udua-blue-primary !border"
                            : ""
                        }`}
                        onClick={() => handleClick(index)}
                      >
                        <CardHeader>
                          <CardTitle>
                            {account.bankDetails.accountHolderName}
                          </CardTitle>
                          <CardDescription>
                            {account.bankDetails.bankName}
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          {account.bankDetails.accountNumber}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <p>No payout accounts found.</p>
                )}
              </div>
            )}

            <Button disabled={selectedPayoutAccount === null ? true : false} onClick={() => handleSubmit()}>
              Submit
            </Button>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default PayoutDialog;
