import { siteConfig } from "@/config/site";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";

let reasons = [
  {
    why: "Reach more buyers",
    detail: "Sell to a global audience, 24/7, from your comfort zone.",
  },
  {
    why: "Lower costs",
    detail: "Skip rent and staff for a virtual storefront.",
  },
  {
    why: "Grow faster",
    detail: "Easily add products and scale your business online.",
  },
  {
    why: "Flexibility",
    detail: "Manage your store and inventory from anywhere.",
  },
];

let HowItWorks = [
  {
    desc: "Step 1",
    title: "Register",
    content: "Fill in the registration form and submit the required documents",
  },
  {
    desc: "Step 2",
    title: "Check your mail",
    content:
      "Once you've submitted the form, Check your mail for further instructions.",
  },
  {
    desc: "Step 3",
    title: "List your Products",
    content: "Upload your best selling products and start selling",
  },
  {
    desc: "Step 4",
    title: "Benefit from Promotions",
    content:
      "Get visibility from our promotions and insights on best selling products",
  },
];

function page() {
  return (
    <section className="max-w-6xl mx-auto my-5 px-6 h-full">
      <div className="px-4 pt-16 text-center">
        <h1 className="text-4xl font-extrabold tracking-normal">
          {siteConfig.sellPageName}
        </h1>
        <p className="mx-auto mt-4 text-base">
          Udua is an innovative online marketplace that brings buyers and
          sellers together.
        </p>
      </div>

      <div className="px-4 text-center">
        <p className="mx-auto mt-4 text-base">
          We empower businesses of all sizes to reach new customers and grow.
        </p>
      </div>

      <div className="px-4 pt-10 text-center">
        <p className="mx-auto my-4 text-base md:text-2xl">Our mission</p>

        <div className="flex flex-col gap-4 md:flex-row justify-center items-center">
          <div className="basis-1/2">
            <Image
              src={"/working-together.jpg"}
              width={450}
              height={450}
              alt="working-together"
              className="rounded-md object-contain w-full"
            />
          </div>

          <div className=" basis-1/2 text-2xl">
            <p>
              "Empowering African entrepreneurs to thrive on a global stage."
            </p>{" "}
            <br />
            {/* <p>...You bring the product, We'll make earning easy.</p> */}
            <p>...Sell smart, sell globally. Udua makes it simple.</p>
          </div>
        </div>
      </div>

      <div className="px-4 pt-10 text-center">
        <p className="mx-auto my-4 text-base md:text-2xl">
          Why sell on {siteConfig.sellPageName}
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {reasons.map((reason, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{reason.why}</CardTitle>
              </CardHeader>

              <CardContent>
                <p>{reason.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="px-4 pt-10 text-center">
        <p className="mx-auto my-4 text-base md:text-2xl">How it works</p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HowItWorks.map((item, i) => (
            <Card key={i}>
              <CardHeader>
                <CardDescription>{item.desc}</CardDescription>
                <CardTitle>{item.title}</CardTitle>
              </CardHeader>

              <CardContent>
                <p>{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

export default page;
