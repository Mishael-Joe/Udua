"use client";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import axios from "axios";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Page() {
  const router = useRouter();
  const { toast } = useToast();
  const [value, setValue] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [counter, setCounter] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (isButtonDisabled) {
      timer = setInterval(() => {
        setCounter((prevCounter) => {
          if (prevCounter <= 1) {
            clearInterval(timer);
            setIsButtonDisabled(false);
            return 0;
          }
          return prevCounter - 1;
        });
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isButtonDisabled]);

  const requestOTP = () => {
    axios.post("/api/users/verify/sendToken");
    setIsButtonDisabled(true);
    setCounter(60); // 1 minute
  };

  const handleSubmit = async () => {
    if (value.length !== 6) {
      toast({
        title: "Invalid",
        description: "OTP must be 6-digit numbers",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await axios.post("/api/users/verify/verifyToken", {
        token: value,
      });
      if (response.status === 200) {
        toast({
          title: "Successful",
          description: "Your account has been verified",
        });
        router.back();
      } else {
        throw new Error();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "There was an error verifying your account",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2 min-h-screen flex flex-col items-center justify-center gap-3">
      <div className="flex flex-col items-center justify-start gap-3">
        <div className="text-center text-sm">
          {value === "" ? (
            <>Enter the 6-digit OTP sent to your E-mail.</>
          ) : (
            <>{value}</>
          )}
        </div>
        <InputOTP
          maxLength={6}
          value={value}
          onChange={(value) => setValue(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <Button onClick={requestOTP} disabled={isButtonDisabled}>
          {isButtonDisabled ? `Resend OTP in ${counter}s` : "Request OTP"}
        </Button>
        <Button onClick={handleSubmit}>Verify</Button>
      </div>
    </div>
  );
}
