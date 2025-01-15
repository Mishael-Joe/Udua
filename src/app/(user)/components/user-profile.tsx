"use client";

import { CombinedProduct, User as USER } from "@/types";
import axios from "axios";
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import Link from "next/link";
import Aside1 from "./aside-1";
import { Button } from "@/components/ui/button";
import { addCommasToNumber } from "@/lib/utils";
import Image from "next/image";
import { shimmer, toBase64 } from "@/lib/image";

type user = USER & {
  store: string;
};

const Profile = () => {
  const [user, setUser] = useState<user | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [recentlyViewedProducts, setRecentlyViewedProducts] = useState<
    CombinedProduct[]
  >([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.post<{ data: user }>("/api/user/userData");
        // console.log("userdata", response);
        setUser(response.data.data);
        setLoading(false); // Stop loading when data is fetched
      } catch (error: any) {
        console.error("Failed to fetch user data", error.message);
        setError(true);
        setLoading(false); // Stop loading when data is fetched
      }
    };

    fetchUserData();

    // Set a timeout to show error message if data isn't fetched within 10 seconds
    const timeoutId = setTimeout(() => {
      if (loading) {
        setError(true);
        setLoading(false);
      }
    }, 10000); // 10 seconds timeout

    // Cleanup the timeout when the component unmounts or fetch is successful
    return () => clearTimeout(timeoutId);
  }, [loading]);

  useEffect(() => {
    // Get recently viewed product IDs from localStorage
    const recentlyViewed = JSON.parse(
      localStorage.getItem("recentlyViewed") || "[]"
    );

    // If there are no products, return early
    if (recentlyViewed.length === 0) return;

    // Fetch the recently viewed products from the backend
    const fetchProducts = async () => {
      try {
        // Assuming you have an endpoint for fetching products by multiple IDs
        const response = await axios.post("/api/user/recently-viewed", {
          productIds: recentlyViewed,
        });

        // console.log("Recently viewed products:", response.data.products);
        // Set the fetched products in the state
        setRecentlyViewedProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching recently viewed products:", error);
      }
    };

    fetchProducts();
  }, []);

  if (loading && !error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin" /> Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="text-center text-red-600">
          An error occurred. Please check your internet connection.
        </p>
      </div>
    );
  }

  if (user === null) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center">
        <p className="w-full h-full flex items-center justify-center">
          <Loader className="animate-spin" /> Loading...
        </p>
      </div>
    );
  }

  return (
    <section className="">
      <div className="grid min-h-screen max-w-7xl mx-auto md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] ... md:px-4 gap-4">
        <div className="hidden bg-muted/10 md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <Aside1 />
          </div>
        </div>

        <div className="p-4 bg-muted/10 md:border rounded w-full overflow-auto">
          <div className="pb-4 flex flex-row justify-between gap-3">
            <h1 className="text-xl font-semibold">My Profile</h1>
            {user.isVerified !== false && (
              <span className="text-sm text-green-600">verified</span>
            )}
          </div>

          <div className="grid sm:grid-cols-2 flex-row gap-6 lg:justify-between">
            <div className=" w-full p-3 border rounded">
              <h1 className="py-2 font-medium">Account Details</h1>

              <div>
                <p>
                  <span className=" text-base font-semibold">Name:</span>{" "}
                  <span>{`${user.firstName} ${user.otherNames} ${user.lastName}`}</span>
                </p>

                <p>
                  <span className=" text-base font-semibold">Email:</span>{" "}
                  <span>{user.email}</span>
                </p>
              </div>
            </div>

            <div className=" w-full p-3 border rounded">
              <h1 className="py-2 font-medium">Primary Shipping Address</h1>

              <div>
                <p>
                  <span className=" text-base font-semibold">Name:</span>{" "}
                  <span>{`${user.firstName} ${user.otherNames} ${user.lastName}`}</span>
                </p>

                <p>
                  <span className=" text-base font-semibold">Email:</span>{" "}
                  <span>{user.email}</span>
                </p>

                <p>
                  <span className=" text-base font-semibold">Phone:</span>{" "}
                  <span>{user.phoneNumber}</span>
                </p>

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
          </div>

          {user.store && user.store !== "" && (
            <div className="w-full border rounded-md p-3 mt-4">
              <p className=" font-semibold">Hi {user.firstName},</p>
              <div>
                <p className="pb-3">My store.</p>
                <p className=" max-w-xl">
                  Store owners can create and manage their own store, including
                  customizing the store layout, adding product categories, and
                  managing product listings (titles, descriptions, pricing,
                  stock levels, and images).
                </p>
                <div className="flex justify-end pt-3">
                  <Link
                    href={`/store/${user.store}/my-store`}
                    className="flex items-center gap-2 hover:underline"
                  >
                    My Store
                  </Link>
                </div>
              </div>
            </div>
          )}

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

          {user.isAdmin && (
            <div className="w-full border rounded-md p-3 mt-4">
              <div>
                <p className="pb-3">For Admins.</p>
                <p className=" max-w-xl">
                  LOGIN to the admin dashboard (only admins can see this).
                </p>
                <div className="flex justify-end pt-3">
                  <Link href={`/admin/create-store`} className=" float-end">
                    <Button className=" hover:underline">Admins</Button>
                  </Link>
                </div>
              </div>
            </div>
          )}

          {recentlyViewedProducts.length > 0 && (
            <>
              <div className="border p-4 rounded-md shadow-2xl mt-6 w-full bg-udua-orange-primary/20">
                <h1 className=" text-xl font-semibold">
                  Recently viewed products
                </h1>

                <div className=" flex gap-4 pt-4 overflow-auto">
                  {recentlyViewedProducts.map((product) => {
                    return (
                      <Link
                        key={product._id}
                        href={`/product/${product._id}`}
                        className="group text-sm"
                      >
                        {product.productType === "Physical Product" ? (
                          <>
                            <div className="aspect-square w-40 h-40 md:h-52 md:w-52 overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
                              <Image
                                placeholder="blur"
                                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                  shimmer(300, 150)
                                )}`}
                                src={product.images[0]}
                                alt={product.name}
                                width={300}
                                height={150}
                                className="h-full w-full object-cover object-center"
                                quality={90}
                              />
                            </div>

                            <h3
                              className="mt-1 font-medium w-40 md:w-52"
                              style={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1, // Limits the text to 3 lines
                                maxHeight: "1.5em", // Adjust this based on the number of lines and line height
                                lineHeight: "1.5em", // Adjust based on font size for accurate height control
                              }}
                            >
                              {product.name}
                            </h3>
                            {product.price !== null ? (
                              <p className="mt-1 font-medium">
                                &#8358;{" "}
                                {addCommasToNumber(product.price as number)}{" "}
                              </p>
                            ) : (
                              <p className="mt-1 font-medium">
                                &#8358;{" "}
                                {addCommasToNumber(product.sizes![0].price)}{" "}
                              </p>
                            )}
                          </>
                        ) : (
                          <>
                            <div className="aspect-square w-40 h-40 md:h-52 md:w-52 overflow-hidden rounded-lg border-2 border-gray-200 bg-gray-100 group-hover:opacity-75 dark:border-gray-800">
                              <Image
                                placeholder="blur"
                                blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                  shimmer(300, 150)
                                )}`}
                                src={product.coverIMG[0]}
                                alt={product.title}
                                width={300}
                                height={150}
                                className="h-full w-full object-cover object-center"
                                quality={90}
                              />
                            </div>

                            <h3
                              className="mt-1 font-medium w-40 md:w-52"
                              style={{
                                display: "-webkit-box",
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1, // Limits the text to 3 lines
                                maxHeight: "1.5em", // Adjust this based on the number of lines and line height
                                lineHeight: "1.5em", // Adjust based on font size for accurate height control
                              }}
                            >
                              {product.title}
                            </h3>
                            <p className="mt-1 font-medium">
                              &#8358;{" "}
                              {addCommasToNumber(product.price as number)}{" "}
                            </p>
                          </>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default Profile;
