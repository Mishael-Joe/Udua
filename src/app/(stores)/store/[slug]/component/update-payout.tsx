"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Loader2Icon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Bank, PayoutAccount } from "@/types";

const UpdatePayoutForm = () => {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  // Fetch payout accounts on component mount
  useEffect(() => {
    const fetchPayoutAccounts = async () => {
      try {
        const { data } = await axios.post("/api/store/fetch-payout-accounts");
        setPayoutAccounts(data.payoutAccounts);
      } catch (error: any) {
        setError(error.message || "Failed to fetch payout accounts");
      } finally {
        setLoading(false);
      }
    };

    fetchPayoutAccounts();
  }, []);

  // Fetch banks on component mount
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const { data } = await axios.post("/api/store/fetch-banks");
        setBanks(data.data);
      } catch (error: any) {
        console.error("Failed to fetch banks:", error.message);
      }
    };

    fetchBanks();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!selectedBank || !accountNumber || !accountHolderName) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill out all fields",
      });
      setIsLoading(false);
      return;
    }

    const payoutData = {
      payoutMethod: "Bank Transfer",
      bankDetails: {
        bankName: selectedBank.name,
        accountNumber,
        accountHolderName,
      },
    };

    try {
      const res = await axios.post("/api/store/add-payout-account", payoutData);

      if (res.status === 200) {
        toast({
          title: "Success",
          description: "Payout account added successfully",
        });
        router.back();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add payout account. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2Icon className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Payout Accounts Section */}
      <section>
        <h1 className="text-2xl font-bold mb-4">My Payout Accounts</h1>
        {payoutAccounts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {payoutAccounts.map((account, index) => (
              <div
                key={index}
                className="p-4 border rounded-lg hover:shadow-md transition-shadow"
              >
                <h3 className="font-semibold mb-2">
                  {account.bankDetails.bankName}
                </h3>
                <p className="text-sm text-gray-600">
                  {account.bankDetails.accountNumber}
                </p>
                <p className="text-sm text-gray-600">
                  {account.bankDetails.accountHolderName}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No payout accounts found.</p>
        )}
      </section>

      {/* Add Payout Account Form */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Add Payout Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Bank Selection */}
          <div>
            <label className="block text-sm font-medium mb-2">Bank Name</label>
            <select
              value={selectedBank?.name || ""}
              onChange={(e) => {
                const bank = banks.find((b) => b.name === e.target.value);
                setSelectedBank(bank || null);
              }}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              required
            >
              <option value="" disabled>
                Select a bank
              </option>
              {banks.map((bank) => (
                <option key={bank.id} value={bank.name}>
                  {bank.name}
                </option>
              ))}
            </select>
          </div>

          {/* Account Details */}
          {selectedBank && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  value={accountHolderName}
                  onChange={(e) =>
                    setAccountHolderName(e.target.value.toUpperCase())
                  }
                  className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  required
                />
              </div>
            </>
          )}

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full md:w-auto float-right mt-6"
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Loader2Icon className="animate-spin w-4 h-4" />
                <span>Processing...</span>
              </div>
            ) : (
              "Add Account"
            )}
          </Button>
        </form>
      </section>
    </main>
  );
};

export default UpdatePayoutForm;
