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
      payoutMethod: "bank transfer",
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

// "use client";

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useRouter } from "next/navigation";
// import { Button } from "@/components/ui/button";
// import { Loader2Icon } from "lucide-react";
// import { useToast } from "@/components/ui/use-toast";
// import { Bank, PayoutAccount } from "@/types";

// const UpdatePayoutForm = () => {
//   //   const [payoutMethod, setPayoutMethod] = useState("bank transfer");
//   const [banks, setBanks] = useState<Bank[]>([]); // State for an array of banks
//   const [selectedBank, setSelectedBank] = useState<Bank | null>(null);
//   const [accountNumber, setAccountNumber] = useState("");
//   const [accountHolderName, setAccountHolderName] = useState("");
//   const [bankcode, setBankcode] = useState<string | null | undefined>("");
//   const [isLoading, setIsLoading] = useState<boolean>(false);
//   const { toast } = useToast();
//   const router = useRouter();
//   const [payoutAccounts, setPayoutAccounts] = useState<PayoutAccount[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     async function fetchPayoutAccounts() {
//       try {
//         const response = await axios.post("/api/store/fetch-payout-accounts");

//         if (response.status === 200) {
//           setPayoutAccounts(response.data.payoutAccounts);
//         } else {
//           throw new Error(
//             response.data.error || "Failed to fetch payout accounts"
//           );
//         }
//       } catch (error: any) {
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     }

//     fetchPayoutAccounts();
//   }, []);

//   useEffect(() => {
//     const fetchBanks = async () => {
//       try {
//         // const response = await axios.post("/api/update-mongodb-models");
//         const response = await axios.post("/api/store/fetch-banks");
//         // console.log("Response data:", response.data.data); // Log the response data
//         setBanks(response.data.data); // Set the banks array with the response
//       } catch (error: any) {
//         console.error("Failed to fetch store data:", error.message);
//       }
//     };

//     fetchBanks(); // Call the function to fetch banks
//   }, []);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault(); // Prevent default form submission
//     setIsLoading(true);

//     if (
//       selectedBank?.name === `` ||
//       accountNumber === `` ||
//       accountHolderName === ``
//     )
//       return;

//     const payoutData = {
//       payoutMethod: "bank transfer",
//       bankDetails: {
//         bankName: selectedBank?.name || "", // Ensure it's not null
//         accountNumber,
//         accountHolderName,
//       },
//     };

//     try {
//       const res = await axios.post("/api/store/add-payout-account", payoutData);

//       if (res.status === 200) {
//         toast({
//           variant: "default",
//           title: `Successfull`,
//           description: `Successfully added payout account.`,
//         });
//         setIsLoading(false);
//         router.back();
//       }
//     } catch (err) {
//       console.error("Error adding payout account:", err);
//       alert("Failed to add payout account. Please try again."); // Error message
//       toast({
//         variant: "destructive",
//         title: `Error adding payout account`,
//         description: `Failed to add payout account. Please try again.`,
//       });
//       setIsLoading(false);
//     }
//   };

//   return (
//     <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
//       <section>
//         <h1>My payout Accounts</h1>

//         <div>
//           <h2>Payout Accounts</h2>
//           {payoutAccounts.length > 0 ? (
//             <ul>
//               {payoutAccounts.map((account, index) => (
//                 <li key={index}>
//                   <strong>Payout Method:</strong> {account.payoutMethod}
//                   <br />
//                   <strong>Bank Name:</strong> {account.bankDetails.bankName}
//                   <br />
//                   <strong>Account Number:</strong>{" "}
//                   {account.bankDetails.accountNumber}
//                   <br />
//                   <strong>Account Holder:</strong>{" "}
//                   {account.bankDetails.accountHolderName}
//                 </li>
//               ))}
//             </ul>
//           ) : (
//             <p>No payout accounts found.</p>
//           )}
//         </div>
//       </section>
//       <h2 className="text-2xl font-semibold">Add Payout Account</h2>
//       <form onSubmit={handleSubmit} className=" max-w-sm mx-auto">
//         <div className=" flex flex-col gap-3">
//           <label>
//             Bank Name:
//             <select
//               value={selectedBank?.name || ""}
//               onChange={(e) => {
//                 const bank = banks.find((b) => b.name === e.target.value);
//                 setSelectedBank(bank || null); // Set the selected bank
//                 setBankcode(bank?.code);
//               }}
//               className="block w-full px-4 py-2 text-gray-700 placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:text-slate-200 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
//             >
//               <option value="" disabled>
//                 Select a bank
//               </option>{" "}
//               {/* Placeholder option */}
//               {banks.map((bank) => (
//                 <option key={bank.id} value={bank.name}>
//                   {bank.name}
//                 </option>
//               ))}
//             </select>
//           </label>

//           {selectedBank !== null && (
//             <>
//               <label>
//                 Account Number:
//                 <input
//                   type="text"
//                   value={accountNumber}
//                   onChange={(e) => setAccountNumber(e.target.value)}
//                   className="block w-full px-4 py-2 text-gray-700 dark:text-white placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
//                   required
//                 />
//               </label>

//               <label>
//                 Account Holder Name:
//                 <input
//                   type="text"
//                   value={accountHolderName}
//                   onChange={(e) =>
//                     setAccountHolderName(e.target.value.toUpperCase())
//                   }
//                   className="block w-full px-4 py-2 text-gray-700 dark:text-white placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring focus:ring-blue-300"
//                   required
//                 />
//               </label>
//             </>
//           )}
//         </div>

//         <Button
//           type="submit"
//           onSubmit={handleSubmit}
//           className="float-right mt-3"
//         >
//           <span>
//             {isLoading && (
//               <p className="flex flex-row items-center justify-between w-full">
//                 <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
//                 <span>Loading...</span>
//               </p>
//             )}
//             {!isLoading && (
//               <p className="flex flex-row items-center justify-between w-full">
//                 <span>Submit</span>
//               </p>
//             )}
//           </span>
//         </Button>
//       </form>
//     </main>
//   );
// };

// export default UpdatePayoutForm;
