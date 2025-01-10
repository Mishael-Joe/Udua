"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

let security = [
  {
    title: "Reset Store Password",
    desc: "Password Reset",
    content:
      "Every store is created with a default password. For security reasons, we strongly recommend that you reset this password immediately.",
    link: "store-password-reset",
  },
  {
    title: "Two-Factor Authentication (2FA)",
    desc: "Enhanced Security",
    content: "This feature is currently under construction. Stay tuned for updates.",
    link: "#",
  },
  {
    title: "Payout Management",
    desc: "Manage Payment Accounts",
    content: "Add or remove accounts for receiving payouts.",
    link: "add-payout-accout",
  },
  // {
  //   title: "General Security Guidelines",
  //   desc: "Best Practices",
  //   content: "Follow these general security tips to protect your store and account.",
  //   link: "#",
  // },
  {
    title: "Payout Policies and Guidelines",
    desc: "Important Information",
    content: "Review the policies and guidelines for receiving payouts.",
    link: "payout-policy",
  },
];


export default function Security({ params }: { params: { slug: string } }) {
  // console.log('params', params.slug)
  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div className="grid gap-4 sm:grid-cols-2 md:gap-8 lg:grid-cols-2">
        {security.map((item, i) => (
          <Link href={`/store/${params.slug}/${item.link}`} key={i}>
            <Card key={i} className="h-full">
              <CardHeader>
                <CardTitle>{item.title}</CardTitle>
                <CardDescription>{item.desc}</CardDescription>
              </CardHeader>

              <CardContent>
                <p>{item.content}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </main>
  );
}
