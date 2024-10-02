"use client";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import axios from "axios";
import { FormEvent, useState } from "react";
import { Loader } from "lucide-react";

interface Store {
  name: string;
  storeOwner: string;
  storeEmail: string;
  uniqueId: string;
  defaultPassword: string;
  confirmPassword?: string;
}

function AdminCreateStore() {
  const [store, setStore] = useState<Store>({
    name: "",
    storeOwner: "",
    storeEmail: "",
    uniqueId: "",
    defaultPassword: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (e: FormEvent<HTMLInputElement>) => {
    const { name, value } = e.target as HTMLInputElement;

    setStore((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });

    // console.log(store);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      store.name === "" ||
      store.storeOwner === "" ||
      store.storeEmail === "" ||
      store.defaultPassword === "" ||
      store.uniqueId === ""
    ) {
      toast({
        variant: `destructive`,
        title: `Error`,
        description: `Please fill in the details.`,
      });
      return;
    } else if (store.defaultPassword !== store.confirmPassword) {
      toast({
        variant: `destructive`,
        title: `Password Error`,
        description: `Please ensure that the default password and confirm password match.`,
      });
      return;
    }

    try {
      setIsLoading(true);
      delete store["confirmPassword"];

      const response = await axios.post("/api/admin/create-store", { store });
      // console.log(`response`, response);

      if (response.data.success === true || response.status === 200) {
        toast({
          title: `Success`,
          description: `This user now has a store on our platform.`,
        });
        setIsLoading(false);
      } else {
        toast({
          variant: `destructive`,
          title: `Error`,
          description: `There was an error creating a store for this user. Please try again.`,
        });
        setIsLoading(false);
      }
    } catch (error) {
      toast({
        variant: `destructive`,
        title: "Error",
        description: `There was an error creating a store for this user. Please try again.`,
      });
      setIsLoading(false);
    }
  };

  return (
    <section>
      <h3 className="my-3 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
        Create Store
      </h3>

      <div>
        <div>
          <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 mb-6">
            <div className="px-6 py-4">
              <p className="mt-3 text-center text-gray-500 dark:text-gray-400">
                Provide the store details.
              </p>

              <form onSubmit={(e) => handleSubmit(e)} className="space-y-8 ">
                <input
                  className="block w-full px-4 py-2 mt-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-label="ID"
                  type="text"
                  name="storeOwner"
                  value={store.storeOwner}
                  onChange={handleChange}
                  placeholder="User ID"
                  required
                />

                <input
                  className="block w-full px-4 py-2 mt-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-label="Store Name"
                  type="text"
                  name="name"
                  value={store.name}
                  onChange={handleChange}
                  placeholder="Store Name"
                  required
                />

                <input
                  className="block w-full px-4 py-2 mt-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-label="Store Email"
                  type="email"
                  name="storeEmail"
                  value={store.storeEmail}
                  onChange={handleChange}
                  placeholder="Store Email"
                  required
                />

                <input
                  className="block w-full px-4 py-2 mt-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-label="Store Unique Id"
                  type="text"
                  name="uniqueId"
                  value={store.uniqueId}
                  onChange={handleChange}
                  placeholder="Store Unique Id"
                  required
                />

                <input
                  className="block w-full px-4 py-2 mt-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-label="Store Unique Id"
                  type="password"
                  name="defaultPassword"
                  value={store.defaultPassword}
                  onChange={handleChange}
                  placeholder="Default Password"
                  required
                />

                <input
                  className="block w-full px-4 py-2 mt-2 dark:text-slate-200 text-black placeholder-gray-500 bg-white border rounded-lg dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400"
                  aria-label="Store Unique Id"
                  type="password"
                  name="confirmPassword"
                  value={store.confirmPassword}
                  onChange={handleChange}
                  placeholder="confirm Password"
                  required
                />
                <Button
                  type="submit"
                  className="items-end w-full bg-purple-500 hover:bg-purple-600"
                >
                  {!isLoading && "Submit"}
                  {isLoading && (
                    <Loader className=" animate-spin w-5 h-5 mr-4" />
                  )}{" "}
                  {isLoading && "Please wait..."}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminCreateStore;