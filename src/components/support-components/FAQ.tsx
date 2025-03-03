"use client";

// faq.tsx
// FAQ component styled with Tailwind CSS, using the Accordion component from shadcn/ui.

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    question: "How can I track my order?",
    answer:
      "You can track your order by entering the order ID in the tracking section.",
  },
  {
    question: "What is Udua’s return policy?",
    answer:
      "We offer a 30-day return policy on most products. Please check the product page for details.",
  },
  {
    question: "How do I contact customer support?",
    answer:
      "You can reach our support team via the contact form below or email support@udua.com.",
  },
];

const FAQ = () => {
  return (
    <section className="faq-section px-4">
      <h3 className="text-lg md:text-2xl font-semibold mb-6 text-center">
        Frequently Asked Questions
      </h3>

      <Accordion type="single" collapsible className="w-full space-y-4">
        {faqData.map((item, index) => (
          <AccordionItem
            key={index}
            value={`item-${index}`}
            className="border-b border-gray-200"
          >
            <AccordionTrigger className="text-lg font-medium text-gray-900">
              {item.question}
            </AccordionTrigger>
            <AccordionContent className="mt-2 text-sm text-gray-600">
              {item.answer}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
};

export default FAQ;
