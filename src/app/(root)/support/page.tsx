// support.tsx

import ContactForm from "@/components/support-components/contact-form";
import FAQ from "@/components/support-components/FAQ";
import SupportLayout from "@/components/support-components/support-layout";

const SupportPage = () => {
  return (
    <SupportLayout>
      {/* Section 1: Frequently Asked Questions */}
      <section className="faq-section px-4 pb-4">
        <FAQ />
      </section>

      {/* Section 2: Contact Support Form */}
      <section className="contact-section px-4 py-4">
        <ContactForm />
      </section>

      {/* Section 3:  */}
    </SupportLayout>
  );
};

export default SupportPage;
