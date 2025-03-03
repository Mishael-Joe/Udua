import { siteConfig } from "@/config/site";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import BenefitsSection from "../benefits-section";
import HeroSection from "../hero-section";
import FAQSection from "../FAQ-section";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
      <HeroSection />

      {/* <div className="px-4 text-center">
        <p className="mx-auto mt-4 text-base">
          We empower businesses of all sizes to reach new customers and grow.
        </p>
      </div> */}

      {/* <div className="px-4 pt-10 text-center">
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
            <p>...Sell smart, sell globally. Udua makes it simple.</p>
          </div>
        </div>
      </div> */}

      <BenefitsSection />

      <div className="px-4 pt-10 text-center">
        <p className="mx-auto my-4 text-2xl md:text-4xl font-bold">
          How it works
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {HowItWorks.map((item, i) => (
            <Card key={i}>
              <CardHeader>
                <CardDescription>{item.desc}</CardDescription>
                <CardTitle className="text-xl md:text-2xl">
                  {item.title}
                </CardTitle>
              </CardHeader>

              <CardContent>
                <p>{item.content}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <FAQSection />

      <section className="py-6">
        <div className="container mx-auto text-center">
          <h2 className="text-xl md:text-3xl font-bold mb-4">
            Ready to take your business global?
          </h2>
          <p className="text-base md:text-lg mb-8">
            Join thousands of sellers who are growing their businesses on Udua.
            Start your store today and reach a new audience!
          </p>
          <Link href="/partner-with-udua/create-store">
            <Button className="text-lg px-6 py-3 bg-blue-600 text-white hover:bg-blue-700">
              Create Your Store
            </Button>
          </Link>
        </div>
      </section>
    </section>
  );
}

export default page;
