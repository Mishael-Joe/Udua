// support.tsx

import ContactForm from "@/components/support-components/contact-form";
import FAQ from "@/components/support-components/FAQ";
import SupportLayout from "@/components/support-components/support-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Phone } from "lucide-react";
import ZohoWidget from "@/components/support-components/contact-form";

const SupportPage = () => {
  return (
    <SupportLayout>
      {/* Help Channels Section */}
      <section className="grid md:grid-cols-3 gap-6 mb-12">
        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="mb-4 flex justify-center">
            <Mail className="h-8 w-8 text-udua-orange-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Email Support</h3>
          <p className="text-muted-foreground mb-4">
            24/7 email support with average 4-hour response time
          </p>
          <Button variant="outline" className="w-full">
            support@udua.com
          </Button>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="mb-4 flex justify-center">
            <Phone className="h-8 w-8 text-udua-orange-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Phone Support</h3>
          <p className="text-muted-foreground mb-4">
            Mon-Fri: 8AM - 6PM (GMT+1)
          </p>
          <Button variant="outline" className="w-full">
            +234 800 000 0000
          </Button>
        </Card>

        <Card className="p-6 text-center hover:shadow-lg transition-shadow">
          <div className="mb-4 flex justify-center">
            <MessageSquare className="h-8 w-8 text-udua-orange-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2">Live Chat</h3>
          <p className="text-muted-foreground mb-4">
            Instant messaging with our support team
          </p>
          <Button className="w-full bg-udua-orange-primary hover:bg-orange-500">
            Start Chat
          </Button>
        </Card>
      </section>

      {/* FAQ Section */}
      <section className="mb-12">
        <FAQ />
      </section>

      {/* Contact Form Section */}
      <section className="mb-6">
        <Card className=" border-none shadow-none">
          <ContactForm />
        </Card>
      </section>
    </SupportLayout>
  );
};

export default SupportPage;

// // support.tsx

// import ContactForm from "@/components/support-components/contact-form";
// import FAQ from "@/components/support-components/FAQ";
// import SupportLayout from "@/components/support-components/support-layout";

// const SupportPage = () => {
//   return (
//     <SupportLayout>
//       {/* Section 1: Frequently Asked Questions */}
//       <section className="faq-section px-4 pb-4">
//         <FAQ />
//       </section>

//       {/* Section 2: Contact Support Form */}
//       <section className="contact-section px-4 py-4">
//         <ContactForm />
//       </section>

//       {/* Section 3:  */}
//     </SupportLayout>
//   );
// };

// export default SupportPage;
