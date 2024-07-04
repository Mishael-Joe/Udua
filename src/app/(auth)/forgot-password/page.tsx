"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { useState } from "react";
import { Loader } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsLoading(true);

      const response = await axios.post(`/api/auth/forgotPassword`, JSON.stringify({ email }));
      // console.log(`response`, response);

      if (response.data.success === true || response.status === 200) {
        toast({
          title: `Success`,
          description: `We have sent an mail to the provided E-mail.`,
        });
        setIsLoading(false);
        setMessage(true);
      } else {
        toast({
          variant: `destructive`,
          title: `Error`,
          description: `There was an error sending you the reset link. Please try again.`,
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        variant: `destructive`,
        title: "Error",
        description: `There was an error sending you the reset link. Please try again.`,
      });
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-row justify-center items-center">
      <section className="max-w-3xl mx-auto my-5 px-6">
      {!message ? (
        <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="px-6 py-4">
          <div className="flex justify-center mx-auto">
            {/* <Image
              className="w-auto h-7 sm:h-8"
              src="https://merakiui.com/images/logo.svg"
              width={`60`}
              height={`60`}
              alt=""
            /> */}
          </div>

          <h3 className="mt-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
            Reset My Password
          </h3>

          <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
            Provide the E-mail you used to create an account with Udua.
          </p>

          <form onSubmit={handleSubmit} className="space-y-8 ">
          <input
            className="block w-full px-4 py-2 mt-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
            aria-label="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <Button
            type="submit"
            className="items-end w-full bg-purple-500 hover:bg-purple-600"
          >
            {!isLoading && "Send Reset Link"}
            {isLoading && (
              <Loader className=" animate-spin w-5 h-5 mr-4" />
            )}{" "}
            {isLoading && "Please wait..."}
          </Button>
        </form>
        </div>
      </div>
      ) : (
        <div className="flex items-center flex-col">
          <div className="border rounded-md py-4 px-6">
            <p>A Link has been sent to the E-mail provided.</p>

            <p className="pt-2">
              Please ensure to check your E-mail and follow the instructions
              carefully.
            </p>
          </div>
        </div>
      )}
    </section>
    </main>
  );
};

export default ForgotPassword;
