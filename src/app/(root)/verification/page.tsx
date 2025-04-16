"use client";

// Core Imports
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

// UI Components
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export default function VerificationPage() {
  // Hooks Initialization
  const router = useRouter();
  const { toast } = useToast();

  // State Management
  const [otp, setOtp] = useState("");
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isVerifying, setIsVerifying] = useState(false);

  // Countdown Timer Effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isResendDisabled && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (countdown === 0) {
      setIsResendDisabled(false);
    }
    return () => clearInterval(interval);
  }, [isResendDisabled, countdown]);

  /**
   * Handles OTP resend request
   * @async
   */
  const handleResendOTP = async () => {
    try {
      await axios.post("/api/auth/verify/sendToken");
      setIsResendDisabled(true);
      setCountdown(60); // Reset 60-second timer
      toast({
        title: "OTP Sent",
        description: "New code has been sent to your email",
      });
    } catch (error) {
      toast({
        title: "Resend Failed",
        description: "Failed to send new OTP code",
        variant: "destructive",
      });
    }
  };

  /**
   * Handles OTP verification submission
   * @async
   */
  const handleVerification = async () => {
    if (otp.length !== 6) {
      toast({
        title: "Invalid Code",
        description: "Please enter a 6-digit verification code",
        variant: "destructive",
      });
      return;
    }

    setIsVerifying(true);
    try {
      const response = await axios.post("/api/auth/verify/verifyToken", {
        token: otp,
      });

      if (response.status === 200) {
        toast({
          title: "Verification Successful",
          description: "Your account has been successfully verified",
        });
        router.back();
      }
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "The code you entered is invalid or expired",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 space-y-6">
        {/* Header Section */}
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-slate-800">
            Verify Your Account
          </h1>
          <p className="text-slate-600">
            Enter the 6-digit code sent to your email address
          </p>
        </div>

        {/* OTP Input Section */}
        <div className="space-y-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={setOtp}
            className="justify-center"
          >
            <InputOTPGroup className="gap-2">
              {[...Array(6)].map((_, index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="w-12 h-12 text-lg border-2 border-slate-200 hover:border-blue-300 rounded-lg transition-colors"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleVerification}
              disabled={isVerifying || otp.length !== 6}
              size="lg"
              className="w-full"
            >
              {isVerifying ? <>Verifying...</> : "Verify Account"}
            </Button>

            <div className="text-center text-sm text-slate-600">
              Didn&apos;t receive code?{" "}
              <Button
                variant="link"
                onClick={handleResendOTP}
                disabled={isResendDisabled}
                className="text-blue-600 p-0 h-auto"
              >
                {isResendDisabled ? `Resend in ${countdown}s` : "Resend Code"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
