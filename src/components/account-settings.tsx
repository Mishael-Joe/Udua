"use client";

import { cn } from "@/lib/utils";
import { useMediaQuery } from "@react-hook/media-query";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { User } from "@/types";
import { ArrowUpRightFromSquare, DeleteIcon, Edit } from "lucide-react";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";
import { toast } from "./ui/use-toast";
import { useRouter } from "next/navigation";

type user = {
  user: User;
};

function AccountSettings({ user }: user) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [delectAccount, setDelectAccount] = useState("");
  const [openNewShippingAddress, setOpenNewShippingAddress] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const [newUserData, setNewUserData] = useState({
    firstName: `${user.firstName}`,
    lastName: `${user.lastName}`,
    otherNames: `${user.otherNames}`,
    phoneNumber: `${user.phoneNumber}`,
    email: `${user.email}`,
  });
  const [newShippingAddress, setNewShippingAddress] = useState({
    address: `${user.address}`,
    city: `${user.cityOfResidence}`,
    state: `${user.stateOfResidence}`,
    postal: `${user.postalCode}`,
  });

  const handleAccontDelection = () => {
    if (delectAccount === "DELECT MY ACCOUNT") {
      toast({
        title: `Successful`,
        description: `Your Account has been delected successfully`,
      });
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { name, value } = e.target;

    setNewUserData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleChangeForShippingAddress = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    const { name, value } = e.target;

    setNewShippingAddress((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const onSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    type: string
  ) => {
    e.preventDefault();
    if (type === "newUserData") {
      try {
        const body = {
          firstName: newUserData.firstName,
          lastName: newUserData.lastName,
          otherNames: newUserData.otherNames,
          phoneNumber: newUserData.phoneNumber,
          email: newUserData.email,
        };
        const response = await axios.post(`/api/user/updateUserData`, body);
        // console.log(`response`, response);

        if (response.status === 200) {
          toast({
            title: `Successful`,
            description: `Your user data has been updated successfully`,
          });
          router.refresh();
        }
      } catch (error) {
        // console.log(error);
        toast({
          variant: "destructive",
          title: `Error `,
          description: `There was an error updating your data`,
        });
      }
    } else if (type === "newShippingAddress") {
      try {
        const body = {
          address: newShippingAddress.address,
          cityOfResidence: newShippingAddress.city,
          stateOfResidence: newShippingAddress.state,
          postalCode: newShippingAddress.postal,
        };
        const response = await axios.post(
          `/api/user/updateUserShippingData`,
          body
        );
        // console.log(`response`, response);

        if (response.status === 200) {
          toast({
            title: `Successful`,
            description: `Your user data has been updated successfully`,
          });
          router.refresh();
        }
      } catch (error) {
        // console.log(error);
        toast({
          variant: "destructive",
          title: `Error `,
          description: `There was an error updating your data`,
        });
      }
    }
  };

  if (isDesktop) {
    return (
      <div className="p-4 bg-muted/20 border rounded w-full">
        <div className="pb-4 flex flex-row justify-between gap-3">
          <h1>Account Settings</h1>
          {/* {user.isVerified !== false && (
            <span className="text-sm text-green-600">verified</span>
          )} */}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 flex-row gap-6 flex-wrap items-cente justify-center lg:justify-between">
          <div className="p-3 border rounded">
            <h1 className="py-3 flex flex-row justify-between gap-3">
              Account Details{" "}
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Edit Account Details</DialogTitle>
                    <DialogDescription>
                      Make changes to your account details here. Click save when
                      you're done.
                    </DialogDescription>
                  </DialogHeader>
                  <ProfileForm />
                </DialogContent>
              </Dialog>
            </h1>

            <div>
            <p>
              <span className=" text-base font-semibold">Name:</span>{" "}
              <span>{`${user.firstName} ${user.otherNames} ${user.lastName}`}</span>
            </p>

            <p>
              <span className=" text-base font-semibold">Phone:</span>{" "}
              <span>{user.phoneNumber}</span>
            </p>

            <p>
              <span className=" text-base font-semibold">Email:</span>{" "}
              <span>{user.email}</span>
            </p>
          </div>
          </div>

          <div className="p-3 border rounded">
            <h1 className="py-3 flex flex-row justify-between gap-3">
              Shipping Address{" "}
              <span>
                <Dialog
                  open={openNewShippingAddress}
                  onOpenChange={setOpenNewShippingAddress}
                >
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      className="bg-purple-500 hover:bg-purple-600"
                    >
                      <Edit className="w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Edit Shipping Details</DialogTitle>
                      <DialogDescription>
                        Make changes to your Shipping Details here. Click save
                        when you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <ShippingForm />
                  </DialogContent>
                </Dialog>
              </span>
            </h1>

            <div>
            <p>
              <span className=" text-base font-semibold">Address:</span>{" "}
              <span>{user.address}</span>
            </p>

            <p>
              <span className=" text-base font-semibold">
                City Of Residence:{" "}
              </span>{" "}
              <span>{user.cityOfResidence}</span>
            </p>

            <p>
              <span className=" text-base font-semibold">
                State Of Residence:{" "}
              </span>{" "}
              <span>{user.stateOfResidence}</span>
            </p>

            <p>
              <span className=" text-base font-semibold">Postal Code:</span>{" "}
              <span>{user.postalCode}</span>
            </p>
          </div>
          </div>

          <div className="p-3 border rounded">
            <h1 className="py-3 flex flex-row justify-between gap-3">
              Change Password{" "}
              <span>
                <Button
                  size="icon"
                  className="bg-purple-500 hover:bg-purple-600"
                >
                  <ArrowUpRightFromSquare className="w-5 h-5" />
                </Button>
              </span>
            </h1>
          </div>

          <div className="p-3 border rounded border-red-600">
            <h1 className="py-3 flex flex-row justify-between gap-3 text-red-600">
              Delect Account{" "}
              <span>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      size="icon"
                      className="bg-red-600 dark:bg-red-600 hover:bg-red-700"
                    >
                      <DeleteIcon className="w-5 h-5" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Delect Account</DialogTitle>
                      <DialogDescription>
                        Make changes to your profile here. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      key in{" "}
                      <span className=" font-bold">DELECT MY ACCOUNT</span> to
                      delect your account.
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Input
                          id="delectAccount"
                          className="col-span-3"
                          onChange={(e) => setDelectAccount(e.target.value)}
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        className=" bg-red-600"
                        onClick={handleAccontDelection}
                      >
                        Delect Account
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </span>
            </h1>

            <p>
              Once you delete your account, there is no going back. Please be
              certain.
            </p>
          </div>
        </div>

        {user.isVerified === false && (
          <div className="w-full border rounded-md p-3 mt-4">
            <p className=" font-semibold">Hi {user.firstName},</p>
            <div>
              <p className="pb-3">Welcome to Udua.</p>
              <p className=" max-w-xl">
                To complete your registration and access all the features we
                offer, please verify your account.
              </p>
              <div className="flex justify-end pt-3">
                <Link href={`/verification`} className=" float-end">
                  <Button className=" hover:underline">verify account</Button>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  function ProfileForm({ className }: React.ComponentProps<"form">) {
    return (
      <form className={cn("grid items-start gap-4", className)}>
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="name"
            name="email"
            value={newUserData.email}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            type="text"
            id="firstName"
            name="firstName"
            value={newUserData.firstName}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            type="text"
            id="lastName"
            name="lastName"
            value={newUserData.lastName}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="otherNames">Other Names</Label>
          <Input
            type="text"
            id="otherNames"
            name="otherNames"
            value={newUserData.otherNames}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="phoneNumber">Phone Number</Label>
          <Input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={newUserData.phoneNumber}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <Button onClick={(e) => onSubmit(e, "newUserData")}>
          Save changes
        </Button>
      </form>
    );
  }

  function ShippingForm({ className }: React.ComponentProps<"form">) {
    return (
      <form className={cn("grid items-start gap-4", className)}>
        <div className="grid gap-2">
          <Label htmlFor="address">Address</Label>
          <Input
            type="text"
            id="address"
            name="address"
            value={newShippingAddress.address}
            onChange={(e) => handleChangeForShippingAddress(e)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="city">City</Label>
          <Input
            type="text"
            id="city"
            name="city"
            value={newShippingAddress.city}
            onChange={(e) => handleChangeForShippingAddress(e)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="state">State</Label>
          <Input
            type="text"
            id="state"
            name="state"
            value={newShippingAddress.state}
            onChange={(e) => handleChangeForShippingAddress(e)}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="postal">Postal Code</Label>
          <Input
            type="text"
            id="postal"
            name="postal"
            value={newShippingAddress.postal}
            onChange={(e) => handleChangeForShippingAddress(e)}
          />
        </div>
        <Button onClick={(e) => onSubmit(e, "newShippingAddress")}>
          Save changes
        </Button>
      </form>
    );
  }

  return (
    <div className="p-4 bg-muted/20 border rounded w-full">
      <div className="pb-4 flex flex-row justify-between gap-3">
        <h1>Account Settings</h1>
        {/* {user.isVerified !== false && (
          <span className="text-sm text-green-600">verified</span>
        )} */}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 flex-row gap-6 flex-wrap items-cente justify-center lg:justify-between">
        <div className="p-3 border rounded">
          <h1 className="py-3 flex flex-row justify-between gap-3">
            Account Details{" "}
            <span>
              <Drawer open={open} onOpenChange={setOpen}>
                <DrawerTrigger asChild>
                  <Button
                    size="icon"
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader className="text-left">
                    <DrawerTitle>Edit Account Details</DrawerTitle>
                    <DrawerDescription>
                      Make changes to your Account Details here. Click save when
                      you're done.
                    </DrawerDescription>
                  </DrawerHeader>
                  <ProfileForm className="px-4" />
                  <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </span>
          </h1>

          <div>
            <p>
              <span className=" text-base font-semibold">Name:</span>{" "}
              <span>{`${user.firstName} ${user.otherNames} ${user.lastName}`}</span>
            </p>

            <p>
              <span className=" text-base font-semibold">Phone:</span>{" "}
              <span>{user.phoneNumber}</span>
            </p>

            <p>
              <span className=" text-base font-semibold">Email:</span>{" "}
              <span>{user.email}</span>
            </p>
          </div>
        </div>

        <div className="p-3 border rounded">
          <h1 className="py-3 flex flex-row justify-between gap-3">
            Shipping Address{" "}
            <span>
              <Drawer
                open={openNewShippingAddress}
                onOpenChange={setOpenNewShippingAddress}
              >
                <DrawerTrigger asChild>
                  <Button
                    size="icon"
                    className="bg-purple-500 hover:bg-purple-600"
                  >
                    <Edit className="w-5 h-5" />
                  </Button>
                </DrawerTrigger>
                <DrawerContent>
                  <DrawerHeader className="text-left">
                    <DrawerTitle>Edit Shipping Details</DrawerTitle>
                    <DrawerDescription>
                      Make changes to your Shipping Details here. Click save
                      when you're done.
                    </DrawerDescription>
                  </DrawerHeader>
                  <ShippingForm className="px-4" />
                  <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </span>
          </h1>

          <div>
            <p>
              <span className=" text-base font-semibold">Address:</span>{" "}
              <span>{user.address}</span>
            </p>

            <p>
              <span className=" text-base font-semibold">
                City Of Residence:{" "}
              </span>{" "}
              <span>{user.cityOfResidence}</span>
            </p>

            <p>
              <span className=" text-base font-semibold">
                State Of Residence:{" "}
              </span>{" "}
              <span>{user.stateOfResidence}</span>
            </p>

            <p>
              <span className=" text-base font-semibold">Postal Code:</span>{" "}
              <span>{user.postalCode}</span>
            </p>
          </div>
        </div>

        <div className="p-3 border rounded">
          <h1 className="py-3 flex flex-row justify-between gap-3">
            Change Password{" "}
            <span>
              <Button size="icon" className="bg-purple-500 hover:bg-purple-600">
                <ArrowUpRightFromSquare className="w-5 h-5" />
              </Button>
            </span>
          </h1>
        </div>

        <div className="p-3 border rounded border-red-600">
          <h1 className="py-3 flex flex-row justify-between gap-3 text-red-600">
            Delect Account{" "}
            <span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    size="icon"
                    className="bg-red-600 dark:bg-red-600 hover:bg-red-700"
                  >
                    <DeleteIcon className="w-5 h-5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>Delect Account</DialogTitle>
                    <DialogDescription>
                      Make changes to your profile here. Click save when you're
                      done.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    key in <span className=" font-bold">DELECT MY ACCOUNT</span>{" "}
                    to delect your account.
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Input
                        id="delectAccount"
                        className="col-span-3"
                        onChange={(e) => setDelectAccount(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      className=" bg-red-600"
                      onClick={handleAccontDelection}
                    >
                      Delect Account
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </span>
          </h1>
        </div>
      </div>

      {user.isVerified === false && (
        <div className="w-full border rounded-md p-3 mt-4">
          <p className=" font-semibold">Hi {user.firstName},</p>
          <div>
            <p className="pb-3">Welcome to Udua.</p>
            <p className=" max-w-xl">
              To complete your registration and access all the features we
              offer, please verify your account.
            </p>
            <div className="flex justify-end pt-3">
              <Link href={`/verification`} className=" float-end">
                <Button className=" hover:underline">verify account</Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AccountSettings;
