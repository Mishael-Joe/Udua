"use client";

// FAQSection.tsx
// This component uses the Shadcn accordion for the FAQ section, with collapsible items for each question.

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How do I create a store on Udua?",
    answer:
      "Simply click on the 'Create Your Store' button, fill out the registration form, and submit the required documents.",
  },
  {
    question: "What are the requirements to create a store?",
    answer:
      "You'll need to provide your store details, a valid means of identification, and a few product samples for verification.",
  },
  {
    question: "How long does it take to get approved?",
    answer:
      "Once you submit your application, we will review it and notify you within 3-5 business days.",
  },
  {
    question: "Are there any fees for creating a store?",
    answer:
      "Creating a store on Udua is free. However, transaction fees apply for each sale made through the platform.",
  },
  {
    question: "Can I sell digital products?",
    answer:
      "Yes, Udua supports both physical and digital products. You can easily list and sell eBooks, digital courses, and more.",
  },
  {
    question: "What payment methods are supported?",
    answer:
      "Udua supports multiple payment methods, including credit/debit cards, bank transfers, and mobile payments through our secure platform.",
  },
  {
    question: "How do I track my sales and orders?",
    answer:
      "Once your store is created, you'll have access to a dashboard where you can track your sales, orders, and performance metrics.",
  },
  {
    question: "Can I offer discounts and promotions?",
    answer:
      "Yes, Udua allows you to set up discounts and participate in platform-wide promotions like flash sales and student discounts.",
  },
];

const FAQSection = () => {
  return (
    <section className="faq-section py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-4xl font-bold text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i + 1}`}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
