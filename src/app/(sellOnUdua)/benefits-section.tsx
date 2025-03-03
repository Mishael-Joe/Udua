// BenefitsSection.tsx
// This component is the Benefits section of the 'Create a Store' page.
// It highlights key benefits of creating a store on Udua.

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

const benefits = [
  {
    title: "Reach More Audience",
    detail: "Access a large network of customers who shop on Udua.",
  },
  {
    title: "Low Startup Costs",
    detail: "No need for physical stores, reducing your overhead.",
  },
  {
    title: "Grow Your Brand",
    detail: "Increase your brand's visibility and sales.",
  },
  {
    title: "Easy Management",
    detail: "Manage products and orders from anywhere.",
  },
  {
    title: "Create Deals Easily",
    detail: "Effortlessly create deals or promotions to boost sales.",
  },
  {
    title: "Integrated Payment System",
    detail:
      "Easily receive payments through a secure platform with multiple options.",
  },
  {
    title: "Analytics and Insights",
    detail:
      "Get data-driven insights on customer behavior and sales performance.",
  },
];

const BenefitsSection = () => {
  return (
    <section className="benefits-section py-6">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">
          Why Create a Store on Udua?
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, i) => (
            <Card key={i} className="h-full">
              <CardHeader>
                <CardTitle className="text-xl md:text-2xl">
                  {benefit.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p>{benefit.detail}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;
