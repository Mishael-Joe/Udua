// contact-form.tsx
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { CardHeader, CardContent } from "@/components/ui/card";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

const ContactForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log("Form submitted:", values);
    form.reset();
  };

  return (
    <div className="max-w-2xl mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold text-center">Contact Support</h2>
        <p className="text-center text-muted-foreground">
          Our team typically responds within 4 hours
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      className="focus:ring-udua-orange-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="john@example.com"
                      {...field}
                      className="focus:ring-udua-orange-primary"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your issue in detail..."
                      {...field}
                      className="focus:ring-udua-orange-primary h-32"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full bg-udua-orange-primary hover:bg-orange-500"
            >
              Submit Request
            </Button>
          </form>
        </Form>
      </CardContent>
    </div>
  );
};

export default ContactForm;

// "use client";

// // contact-support.tsx
// // Displays a form where users can submit a support request to the Udua team.

// import { useState } from "react";

// const ContactSupport = () => {
//   // State to store form input values
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     message: "",
//   });

//   // State to handle submission status
//   const [isSubmitted, setIsSubmitted] = useState(false);

//   // Handle form input changes
//   const handleChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
//   ) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle form submission
//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     // Simulate form submission to the server (replace with actual logic)
//     // console.log("Form submitted:", formData);
//     setIsSubmitted(true); // Mark as submitted after submission
//   };

//   return (
//     <section className="contact-support px-4">
//       <h2 className="text-lg md:text-2xl font-bold text-gray-800 text-center mb-6">
//         Contact Support
//       </h2>

//       {isSubmitted ? (
//         <p className="text-center text-green-600 font-semibold">
//           Thank you for reaching out! We'll get back to you shortly.
//         </p>
//       ) : (
//         <form
//           className="max-w-xl mx-auto rounded-lg shadow-xs"
//           onSubmit={handleSubmit}
//         >
//           {/* Name Input */}
//           <div className="mb-4">
//             <label
//               htmlFor="name"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Your Name
//             </label>
//             <input
//               type="text"
//               name="name"
//               id="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Enter your name"
//             />
//           </div>

//           {/* Email Input */}
//           <div className="mb-4">
//             <label
//               htmlFor="email"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Your Email
//             </label>
//             <input
//               type="email"
//               name="email"
//               id="email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Enter your email"
//             />
//           </div>

//           {/* Message Input */}
//           <div className="mb-4">
//             <label
//               htmlFor="message"
//               className="block text-gray-700 font-medium mb-2"
//             >
//               Your Message
//             </label>
//             <textarea
//               name="message"
//               id="message"
//               value={formData.message}
//               onChange={handleChange}
//               required
//               className="w-full p-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
//               placeholder="Enter your message"
//               rows={6}
//             ></textarea>
//           </div>

//           {/* Submit Button */}
//           <button
//             type="submit"
//             className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-lg hover:bg-indigo-700 transition duration-300"
//           >
//             Submit
//           </button>
//         </form>
//       )}
//     </section>
//   );
// };

// export default ContactSupport;
