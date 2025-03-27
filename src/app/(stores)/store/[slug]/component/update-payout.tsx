"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Bank, PayoutAccount } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Banknote, AlertCircle } from "lucide-react";

/**
 * Component for managing and updating payout accounts
 * Allows users to add new bank accounts and view existing ones
 */
const UpdatePayoutAccountForm = () => {
  // State management
  const [banks, setBanks] = useState<Bank[]>([]);
  const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const router = useRouter();

  /**
   * Fetch existing payout accounts on component mount
   */
  useEffect(() => {
    const fetchPayoutAccounts = async () => {
      try {
        const { data } = await axios.post("/api/store/fetch-payout-accounts");
        setPayoutAccounts(data.payoutAccounts);
      } catch (error: any) {
        setError(error.message || "Failed to load payout accounts");
      } finally {
        setLoading(false);
      }
    };

    fetchPayoutAccounts();
  }, []);

  /**
   * Fetch list of supported banks from API
   */
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const { data } = await axios.post("/api/store/fetch-banks");
        setBanks(data.data);
      } catch (error: any) {
        console.error("Bank fetch failed:", error.message);
        toast({
          variant: "destructive",
          title: "Bank List Error",
          description: "Failed to load bank list. Please refresh the page.",
        });
      }
    };

    fetchBanks();
  }, [toast]);

  /**
   * Handle form submission for new payout account
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post("/api/store/add-payout-account", {
        payoutMethod: "Bank Transfer",
        bankDetails: {
          bankName: selectedBank?.name,
          accountNumber,
          accountHolderName,
          bankCode: selectedBank?.code,
          bankId: selectedBank?.id,
        },
      });

      if (res.status === 200) {
        toast({
          title: "Account Added",
          description: "Payout account added successfully",
        });
        router.refresh();
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Submission Error",
        description: "Failed to add payout account. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Validate account number against selected bank
   */
  const validateAccountNumber = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedBank?.code || accountNumber.length !== 10) return;

    setIsValidating(true);
    try {
      const res = await axios.post("/api/store/resolve-account-name", {
        config: { accountNumber, bankCode: selectedBank.code },
      });

      toast({
        title: "Account Verified",
        description: `Account Name: ${res.data.data.account_name}`,
      });
      setAccountHolderName(res.data.data.account_name);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Validation Failed",
        description: "Invalid account number. Please check and try again.",
      });
    } finally {
      setIsValidating(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-8 space-y-8">
        <Skeleton className="h-9 w-64 mb-4" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
        <Skeleton className="h-96 rounded-lg" />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-8">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
      {/* Existing Accounts Section */}
      <section className="space-y-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Banknote className="h-6 w-6" />
          Payout Accounts
        </h1>

        {payoutAccounts.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {payoutAccounts.map((account, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <h3 className="font-semibold">
                    {account.bankDetails.bankName}
                  </h3>
                </CardHeader>
                <CardContent className="space-y-1">
                  <p className="text-sm font-mono">
                    {account.bankDetails.accountNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {account.bankDetails.accountHolderName}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Alert>
            <AlertDescription>No payout accounts found</AlertDescription>
          </Alert>
        )}
      </section>

      {/* Add Account Form */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Banknote className="h-6 w-6" />
          Add New Account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Bank Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Bank Name</label>
              <Select
                onValueChange={(value) => {
                  const bank = banks.find((b) => b.name === value);
                  setSelectedBank(bank || null);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a bank" />
                </SelectTrigger>
                <SelectContent>
                  {banks.map((bank) => (
                    <SelectItem key={bank.id} value={bank.name}>
                      {bank.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Account Details */}
            {selectedBank && (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Number</label>
                  <Input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    onBlur={validateAccountNumber}
                    placeholder="10-digit account number"
                    pattern="\d{10}"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Account Name</label>
                  <Input
                    type="text"
                    value={accountHolderName}
                    onChange={(e) =>
                      setAccountHolderName(e.target.value.toUpperCase())
                    }
                    readOnly={isValidating}
                    className="bg-muted"
                  />
                </div>
              </>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={isSubmitting || isValidating || !accountHolderName}
            >
              {isSubmitting || isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isValidating ? "Validating..." : "Submitting..."}
                </>
              ) : (
                "Add Account"
              )}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default UpdatePayoutAccountForm;
