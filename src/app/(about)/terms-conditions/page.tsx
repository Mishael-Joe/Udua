// /**
//  * Terms and Conditions Page
//  *
//  * This page displays the legal terms and conditions for using the platform.
//  * It features a structured layout with a table of contents, organized sections,
//  * and responsive design elements for better readability.
//  */

// import { siteConfig } from "@/config/site";

// // Reusable section container component for consistent spacing
// const SectionContainer = ({
//   id,
//   title,
//   children,
//   className = "",
// }: {
//   id: string;
//   title: string;
//   children: React.ReactNode;
//   className?: string;
// }) => (
//   <section id={id} className={`scroll-mt-24 pt-12 ${className}`}>
//     <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
//       {title}
//     </h2>
//     <div className="space-y-6">{children}</div>
//   </section>
// );

// // Reusable highlight box component for important notes
// const HighlightBox = ({
//   title,
//   color = "blue",
//   children,
// }: {
//   title: string;
//   color?: "blue" | "yellow" | "green";
//   children: React.ReactNode;
// }) => {
//   const colors = {
//     blue: "bg-blue-50 dark:bg-blue-900/20 border-blue-200",
//     yellow: "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200",
//     green: "bg-green-50 dark:bg-green-900/20 border-green-200",
//   };

//   return (
//     <div className={`${colors[color]} p-6 rounded-lg border-l-4 mb-6`}>
//       <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">
//         {title}
//       </h3>
//       {children}
//     </div>
//   );
// };

// function TermsPage() {
//   // Format current date for last updated display
//   const formattedDate = new Date().toLocaleDateString("en-US", {
//     year: "numeric",
//     month: "long",
//     day: "numeric",
//   });

//   // Table of contents configuration
//   const sections = [
//     { id: "introduction", title: "1. Introduction" },
//     { id: "registration", title: "2. Registration and Account" },
//     { id: "terms-sale", title: "3. Terms and Conditions of Sale" },
//     { id: "returns", title: "4. Returns and Refunds" },
//     { id: "payments", title: "5. Payments" },
//     { id: "content", title: "6. Rules About Your Content" },
//     { id: "rights", title: "7. Our Rights to Use Your Content" },
//     { id: "usage", title: "8. Use of Website and Mobile Applications" },
//     { id: "copyright", title: "9. Copyright and Trademarks" },
//     { id: "privacy", title: "10. Data Privacy" },
//     { id: "audit", title: "11. Due Diligence and Audit Rights" },
//     { id: "marketplace", title: "12. Udua's Role as a Marketplace" },
//     { id: "liability", title: "13. Limitations and Exclusions of Liability" },
//     { id: "indemnification", title: "14. Indemnification" },
//     { id: "breaches", title: "15. Breaches of Terms" },
//     { id: "agreement", title: "16. Entire Agreement" },
//     { id: "changes", title: "17. Changes to Terms" },
//     { id: "contact", title: "18. Contact Us" },
//   ];

//   return (
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//       {/* Page Header */}
//       <header className="mb-12 text-center border-b pb-8">
//         <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
//           Terms and Conditions
//         </h1>
//         <p className="text-lg text-gray-600 dark:text-gray-400">
//           Effective Date: {formattedDate}
//         </p>
//       </header>

//       {/* Main Content Container */}
//       <div className="lg:flex lg:gap-12">
//         {/* Table of Contents - Side Navigation */}
//         <nav className="lg:w-80 xl:w-96 mb-12 lg:mb-0 lg:sticky lg:top-20 lg:self-start">
//           <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-sm">
//             <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
//               Table of Contents
//             </h2>
//             <ul className="space-y-2">
//               {sections.map((section) => (
//                 <li key={section.id}>
//                   <a
//                     href={`#${section.id}`}
//                     className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block py-2 text-sm"
//                   >
//                     {section.title}
//                   </a>
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </nav>

//         {/* Legal Content Sections */}
//         <main className="flex-1 prose prose-gray dark:prose-invert max-w-none">
//           <SectionContainer id="introduction" title="1. Introduction">
//             <p className="text-gray-600 dark:text-gray-400">
//               1.1. “Udua” is the trading name for Udua, an e-commerce platform
//               that operates through a website and mobile application
//               (“marketplace”) along with supporting IT logistics and payment
//               infrastructure...
//             </p>

//             <HighlightBox title="Key Points:" color="blue">
//               <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
//                 <li>
//                   By using our marketplace, you accept these terms in full
//                 </li>
//                 <li>Business users must have proper authority to agree</li>
//                 <li>Terms apply to both individual and organizational use</li>
//               </ul>
//             </HighlightBox>
//           </SectionContainer>

//           <SectionContainer
//             id="registration"
//             title="2. Registration and Account"
//           >
//             <p className="text-gray-600 dark:text-gray-400">
//               2.1. You may not register with our marketplace if you are under 18
//               years of age...
//             </p>

//             <HighlightBox title="Important Account Guidelines:" color="yellow">
//               <ul className="list-disc pl-6 space-y-2 text-gray-700 dark:text-gray-300">
//                 <li>Keep your password confidential</li>
//                 <li>Account transfers to third parties are prohibited</li>
//                 <li>We reserve the right to suspend accounts</li>
//               </ul>
//             </HighlightBox>
//           </SectionContainer>

//           <SectionContainer
//             id="terms-sale"
//             title="3. Terms and Conditions of Sale"
//           >
//             <HighlightBox title="3.1 Marketplace Understanding" color="blue">
//               <p className="mb-4 text-gray-700 dark:text-gray-300">
//                 You acknowledge and agree that:
//               </p>
//               <ul className="list-disc pl-6 space-y-3">
//                 <li>
//                   The marketplace provides an online platform for sellers to
//                   sell and buyers to purchase products
//                 </li>
//                 <li>
//                   We accept binding sales on behalf of sellers, but Udua is not
//                   a party to transactions unless indicated as the seller
//                 </li>
//                 <li>
//                   A purchase confirmation creates a binding contract between
//                   buyer and seller
//                 </li>
//               </ul>
//             </HighlightBox>

//             <HighlightBox title="3.2 Contractual Provisions" color="green">
//               <div className="space-y-6">
//                 <div>
//                   <h4 className="font-medium mb-2">Pricing & Compliance</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>
//                       Listed prices are binding and inclusive of all taxes
//                     </li>
//                     <li>
//                       All charges must be clearly disclosed in product listings
//                     </li>
//                     <li>Products must meet quality and safety standards</li>
//                   </ul>
//                 </div>

//                 <div>
//                   <h4 className="font-medium mb-2">Ownership Rights</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>
//                       Physical products require clear ownership documentation
//                     </li>
//                     <li>Digital products require distribution authorization</li>
//                     <li>No third-party rights or restrictions permitted</li>
//                   </ul>
//                 </div>
//               </div>
//             </HighlightBox>
//           </SectionContainer>

//           <SectionContainer id="returns" title="4. Returns and Refunds">
//             <HighlightBox title="4.1 Return Process" color="blue">
//               <div className="space-y-4">
//                 <p>
//                   Managed through our dedicated{" "}
//                   <a
//                     href="/returns"
//                     className="text-blue-600 dark:text-blue-400 hover:underline"
//                   >
//                     Returns Portal
//                   </a>
//                   , subject to:
//                 </p>
//                 <ul className="list-disc pl-6 space-y-2">
//                   <li>Current marketplace policies</li>
//                   <li>Applicable regional laws</li>
//                   <li>Product condition requirements</li>
//                 </ul>
//               </div>
//             </HighlightBox>

//             <HighlightBox title="4.2 Refund Policy" color="green">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
//                   <h4 className="font-medium mb-2">Refund Components</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Full product price</li>
//                     <li>Shipping costs (where applicable)</li>
//                   </ul>
//                 </div>
//                 <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
//                   <h4 className="font-medium mb-2">Processing Methods</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Original payment method</li>
//                     <li>Bank transfer</li>
//                     <li>E-wallet options</li>
//                   </ul>
//                 </div>
//               </div>
//             </HighlightBox>

//             <HighlightBox title="4.3 Digital Products Exception" color="yellow">
//               <div className="space-y-3">
//                 <p className="font-medium">Special Conditions:</p>
//                 <ul className="list-disc pl-6 space-y-2">
//                   <li>Refunds only for delivery failures</li>
//                   <li>Subject to seller's individual policy</li>
//                 </ul>
//                 <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
//                   Policy updates effective immediately upon publication
//                 </p>
//               </div>
//             </HighlightBox>
//           </SectionContainer>

//           <SectionContainer id="payments" title="5. Payment Methods">
//             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
//               <h3 className="text-lg font-semibold mb-6">
//                 Accepted Payment Options
//               </h3>

//               <div className="grid md:grid-cols-2 gap-8">
//                 <div className="border-l-4 border-blue-500 pl-5">
//                   <h4 className="font-medium mb-3">Card Payments</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>All major credit/debit cards accepted</li>
//                     <li>SSL encrypted transactions</li>
//                     <li>Instant payment confirmation</li>
//                   </ul>
//                 </div>

//                 <div className="border-l-4 border-green-500 pl-5">
//                   <h4 className="font-medium mb-3">Bank Transfers</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Direct bank-to-bank transactions</li>
//                     <li>1-3 business day processing</li>
//                     <li>Digital receipts provided</li>
//                   </ul>
//                 </div>
//               </div>

//               <div className="mt-8 bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
//                 <p className="flex items-center gap-2 text-sm">
//                   <svg
//                     className="w-5 h-5"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   All transactions protected by our{" "}
//                   <a
//                     href="/security"
//                     className="text-blue-600 dark:text-blue-400 hover:underline"
//                   >
//                     Security Protocol
//                   </a>
//                 </p>
//               </div>
//             </div>

//             <HighlightBox
//               title="Payment Management"
//               color="purple"
//               className="mt-8"
//             >
//               <div className="space-y-4">
//                 <p>Manage payment methods through your account dashboard:</p>
//                 <ul className="list-disc pl-6 space-y-2">
//                   <li>Add new payment options</li>
//                   <li>Set default payment method</li>
//                   <li>View transaction history</li>
//                 </ul>
//                 <a
//                   href="/account/payments"
//                   className="inline-flex items-center mt-4 px-5 py-2.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
//                 >
//                   Manage Payments
//                   <svg
//                     className="w-4 h-4 ml-2"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </a>
//               </div>
//             </HighlightBox>
//           </SectionContainer>

//           {/*
//   Content Guidelines Section
//   Details user responsibilities and restrictions regarding submitted content
// */}
//           <SectionContainer id="content" title="6. Rules About Your Content">
//             {/* Content Definition */}
//             <HighlightBox title="6.1 Content Definition" color="blue">
//               <p className="text-gray-700 dark:text-gray-300 mb-4">
//                 "Your content" includes all materials submitted to our platform:
//               </p>
//               <ul className="list-disc pl-6 space-y-3">
//                 <li>
//                   All digital assets (text, images, videos, software files)
//                 </li>
//                 <li>
//                   User-generated communications (reviews, feedback, comments)
//                 </li>
//               </ul>
//             </HighlightBox>

//             {/* Content Standards */}
//             <HighlightBox title="6.2-6.4 Content Standards" color="yellow">
//               <div className="space-y-6">
//                 <div>
//                   <h4 className="font-medium mb-2">Basic Requirements</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Must be accurate and truthful</li>
//                     <li>Must maintain civil discourse</li>
//                     <li>Must comply with internet etiquette standards</li>
//                   </ul>
//                 </div>

//                 <div>
//                   <h4 className="font-medium mb-2">Prohibited Content</h4>
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div>
//                       <p className="text-sm font-medium mb-2">
//                         Content Restrictions:
//                       </p>
//                       <ul className="list-disc pl-6 space-y-2">
//                         <li>Explicit or offensive material</li>
//                         <li>Violent or graphic content</li>
//                         <li>Discriminatory or hate speech</li>
//                       </ul>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium mb-2">
//                         Legal Restrictions:
//                       </p>
//                       <ul className="list-disc pl-6 space-y-2">
//                         <li>No copyright infringement</li>
//                         <li>No privacy violations</li>
//                         <li>No contractual breaches</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </HighlightBox>

//             {/* Platform Conduct */}
//             <HighlightBox title="6.5-6.8 Platform Conduct" color="red">
//               <div className="space-y-6">
//                 <div>
//                   <h4 className="font-medium mb-2">Prohibited Activities</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Posting unauthorized external links</li>
//                     <li>Submitting legally contested material</li>
//                     <li>Creating fake or misleading reviews</li>
//                   </ul>
//                 </div>

//                 <div>
//                   <h4 className="font-medium mb-2">Transaction Integrity</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>No off-platform transaction solicitation</li>
//                     <li>No interference with active transactions</li>
//                     <li>No unauthorized payment collection</li>
//                   </ul>
//                 </div>
//               </div>
//             </HighlightBox>

//             {/* User Responsibilities */}
//             <HighlightBox title="6.9-6.11 User Responsibilities" color="green">
//               <div className="space-y-4">
//                 <div>
//                   <h4 className="font-medium mb-2">Interaction Guidelines</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Protect personal and financial information</li>
//                     <li>Exercise caution in user communications</li>
//                     <li>Report suspicious activities immediately</li>
//                   </ul>
//                 </div>

//                 <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
//                   <p className="text-sm flex items-center gap-2">
//                     <svg
//                       className="w-4 h-4"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
//                     </svg>
//                     We reserve the right to remove content at our discretion
//                   </p>
//                 </div>

//                 <a
//                   href="#contact"
//                   className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:underline"
//                 >
//                   Report Policy Violations
//                   <svg
//                     className="w-4 h-4 ml-1"
//                     fill="none"
//                     stroke="currentColor"
//                     viewBox="0 0 24 24"
//                   >
//                     <path
//                       strokeLinecap="round"
//                       strokeLinejoin="round"
//                       strokeWidth={2}
//                       d="M9 5l7 7-7 7"
//                     />
//                   </svg>
//                 </a>
//               </div>
//             </HighlightBox>
//           </SectionContainer>

//           {/* Content Licensing Section */}
//           <SectionContainer id="rights" title="7. Content Usage Rights">
//             <HighlightBox title="7.1-7.3 License Grants" color="blue">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <h4 className="font-medium mb-2">Granted Rights</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Worldwide content usage rights</li>
//                     <li>Right to modify and distribute</li>
//                     <li>Sub-licensing authorization</li>
//                   </ul>
//                 </div>
//                 <div>
//                   <h4 className="font-medium mb-2">Legal Protections</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Infringement litigation rights</li>
//                     <li>Moral rights waiver</li>
//                     <li>Content moderation authority</li>
//                   </ul>
//                 </div>
//               </div>
//             </HighlightBox>

//             <HighlightBox title="7.4-7.5 Content Moderation" color="yellow">
//               <div className="space-y-4">
//                 <div className="flex items-start gap-3">
//                   <svg
//                     className="w-5 h-5 flex-shrink-0 text-yellow-600 dark:text-yellow-400"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <div>
//                     <p className="font-medium">Moderation Policy:</p>
//                     <p>
//                       We reserve the right to remove content that violates our
//                       policies
//                     </p>
//                   </div>
//                 </div>
//               </div>
//             </HighlightBox>
//           </SectionContainer>

//           {/* Platform Usage Section */}
//           <SectionContainer id="usage" title="8. Platform Usage Guidelines">
//             <HighlightBox title="8.1-8.5 Permitted Usage" color="green">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <h4 className="font-medium mb-2">Allowed Actions</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Browser-based viewing</li>
//                     <li>Limited caching/printing</li>
//                     <li>Media streaming</li>
//                   </ul>
//                 </div>
//                 <div>
//                   <h4 className="font-medium mb-2">Restrictions</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>No unauthorized downloads</li>
//                     <li>No content modification</li>
//                     <li>Commercial use limitations</li>
//                   </ul>
//                 </div>
//               </div>
//             </HighlightBox>

//             <HighlightBox title="8.6-8.9 Prohibited Activities" color="red">
//               <div className="space-y-6">
//                 <div>
//                   <h4 className="font-medium mb-2">Content Restrictions</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>No republication of platform content</li>
//                     <li>No commercial exploitation</li>
//                     <li>No unauthorized redistribution</li>
//                   </ul>
//                 </div>

//                 <div>
//                   <h4 className="font-medium mb-2">Security & Conduct</h4>
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div>
//                       <ul className="list-disc pl-6 space-y-2">
//                         <li>No hacking or tampering</li>
//                         <li>No vulnerability testing</li>
//                         <li>No unauthorized access</li>
//                       </ul>
//                     </div>
//                     <div>
//                       <ul className="list-disc pl-6 space-y-2">
//                         <li>No malicious software</li>
//                         <li>No resource overloading</li>
//                         <li>No automated scraping</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </HighlightBox>

//             <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
//               <div className="flex items-center gap-4">
//                 <svg
//                   className="w-8 h-8 text-blue-600 dark:text-blue-400"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M2.94 6.412A2 2 0 002 8.108V16a2 2 0 002 2h12a2 2 0 002-2V8.108a2 2 0 00-.94-1.696l-6-3.75a2 2 0 00-2.12 0l-6 3.75zm2.615 7.423a1 1 0 10-1.11 1.664l5 3.333a1 1 0 001.11 0l5-3.333a1 1 0 00-1.11-1.664L10 16.798l-4.445-2.963z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <div>
//                   <h4 className="font-medium">System Integrity</h4>
//                   <p className="text-sm mt-1">
//                     We maintain the right to suspend access for maintenance or
//                     security purposes
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </SectionContainer>

//           {/* Intellectual Property Section */}
//           <SectionContainer
//             id="copyright"
//             title="9. Intellectual Property Rights"
//           >
//             {/* Ownership Section */}
//             <HighlightBox title="9.1 Ownership Declaration" color="blue">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <h4 className="font-medium mb-2">Platform Rights</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Full copyright ownership of website content</li>
//                     <li>Exclusive control of intellectual property</li>
//                   </ul>
//                 </div>
//                 <div>
//                   <h4 className="font-medium mb-2">Reserved Rights</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>All IP rights strictly maintained</li>
//                     <li>No implicit usage licenses granted</li>
//                   </ul>
//                 </div>
//               </div>
//             </HighlightBox>

//             {/* Trademark Section */}
//             <HighlightBox title="9.2-9.3 Trademark Policy" color="purple">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <div className="flex items-center gap-3 mb-3">
//                     <svg
//                       className="w-6 h-6 text-purple-600"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                     <h4 className="font-medium">Udua Trademarks</h4>
//                   </div>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Logo and brand marks protected</li>
//                     <li>Unauthorized use prohibited</li>
//                   </ul>
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-3 mb-3">
//                     <svg
//                       className="w-6 h-6 text-gray-600"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M13 10V3L4 14h7v7l9-11h-7z"
//                       />
//                     </svg>
//                     <h4 className="font-medium">Third-Party Marks</h4>
//                   </div>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Respect for external IP rights</li>
//                     <li>No endorsement implied</li>
//                   </ul>
//                 </div>
//               </div>
//             </HighlightBox>
//           </SectionContainer>

//           {/* Data Privacy Section */}
//           <SectionContainer id="privacy" title="10. Data Protection">
//             <HighlightBox title="10.1-10.3 Data Handling" color="green">
//               <div className="grid md:grid-cols-2 gap-8">
//                 <div>
//                   <div className="flex items-center gap-3 mb-3">
//                     <svg
//                       className="w-6 h-6 text-green-600"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     <h4 className="font-medium">Data Processing</h4>
//                   </div>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Compliance with privacy policy</li>
//                     <li>Secure data handling practices</li>
//                   </ul>
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-3 mb-3">
//                     <svg
//                       className="w-6 h-6 text-red-600"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     <h4 className="font-medium">Liability Notice</h4>
//                   </div>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Seller responsibility for data misuse</li>
//                     <li>No platform liability for third-party actions</li>
//                   </ul>
//                 </div>
//               </div>
//             </HighlightBox>
//           </SectionContainer>

//           {/* Compliance Section */}
//           <SectionContainer id="audit" title="11. Compliance & Audits">
//             <HighlightBox title="11.1-11.2 Verification Rights" color="yellow">
//               <div className="space-y-6">
//                 <div className="flex items-start gap-4">
//                   <svg
//                     className="w-6 h-6 text-yellow-600 flex-shrink-0"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zm0 16a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
//                   </svg>
//                   <div>
//                     <h4 className="font-medium mb-2">Anti-Fraud Measures</h4>
//                     <p>We maintain rigorous compliance programs including:</p>
//                     <ul className="list-disc pl-6 mt-2 space-y-2">
//                       <li>Regular user verification checks</li>
//                       <li>AML/KYC procedures</li>
//                       <li>Transaction monitoring systems</li>
//                     </ul>
//                   </div>
//                 </div>

//                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
//                   <h4 className="font-medium mb-3">User Obligations</h4>
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div>
//                       <p className="text-sm font-medium mb-2">Must Provide:</p>
//                       <ul className="list-disc pl-6 space-y-2">
//                         <li>Business documentation</li>
//                         <li>Operational access</li>
//                         <li>Compliance evidence</li>
//                       </ul>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium mb-2">Legal Basis:</p>
//                       <ul className="list-disc pl-6 space-y-2">
//                         <li>Court orders</li>
//                         <li>Regulatory requirements</li>
//                         <li>Contractual verification</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </HighlightBox>
//           </SectionContainer>

//           {/* Marketplace Role Section */}
//           <SectionContainer
//             id="marketplace"
//             title="12. Platform Responsibilities"
//           >
//             <HighlightBox title="12.1 Marketplace Structure" color="blue">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <h4 className="font-medium mb-2">Platform Function</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Facilitates buyer-seller transactions</li>
//                     <li>Third-party seller marketplace</li>
//                     <li>Dispute resolution protocols</li>
//                   </ul>
//                 </div>
//                 <div>
//                   <h4 className="font-medium mb-2">Liability Framework</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Seller responsibility for products</li>
//                     <li>Direct recourse requirements</li>
//                     <li>Transaction-specific accountability</li>
//                   </ul>
//                 </div>
//               </div>
//             </HighlightBox>

//             <HighlightBox title="12.2-12.3 Content Assurance" color="green">
//               <div className="space-y-6">
//                 <div className="flex items-start gap-4">
//                   <svg
//                     className="w-6 h-6 text-green-600 flex-shrink-0"
//                     fill="currentColor"
//                     viewBox="0 0 20 20"
//                   >
//                     <path
//                       fillRule="evenodd"
//                       d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
//                       clipRule="evenodd"
//                     />
//                   </svg>
//                   <div>
//                     <h4 className="font-medium mb-2">Seller Obligations</h4>
//                     <ul className="list-disc pl-6 space-y-2">
//                       <li>Accurate product representations</li>
//                       <li>Timely information updates</li>
//                       <li>Compliance with listing standards</li>
//                     </ul>
//                   </div>
//                 </div>

//                 <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
//                   <p className="flex items-center gap-2 text-sm">
//                     <svg
//                       className="w-5 h-5"
//                       fill="currentColor"
//                       viewBox="0 0 20 20"
//                     >
//                       <path
//                         fillRule="evenodd"
//                         d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
//                         clipRule="evenodd"
//                       />
//                     </svg>
//                     Service availability subject to force majeure events
//                   </p>
//                 </div>
//               </div>
//             </HighlightBox>

//             <HighlightBox title="12.4-12.6 Service Continuity" color="purple">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <h4 className="font-medium mb-2">Modification Rights</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Unilateral service changes</li>
//                     <li>No compensation guarantees</li>
//                     <li>15-day notice for non-emergency changes</li>
//                   </ul>
//                 </div>
//                 <div>
//                   <h4 className="font-medium mb-2">Performance Disclaimer</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>No commercial outcome guarantees</li>
//                     <li>Best-effort service provision</li>
//                     <li>Exclusion of implied warranties</li>
//                   </ul>
//                 </div>
//               </div>
//             </HighlightBox>
//           </SectionContainer>

//           {/* Liability Section */}
//           <SectionContainer id="liability" title="13. Liability Framework">
//             <HighlightBox title="13.1-13.2 Legal Boundaries" color="red">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <h4 className="font-medium mb-2">
//                     Jurisdictional Compliance
//                   </h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Adherence to applicable laws</li>
//                     <li>Non-exclusion of statutory rights</li>
//                     <li>Local legal requirements</li>
//                   </ul>
//                 </div>
//                 <div>
//                   <h4 className="font-medium mb-2">Scope of Limitations</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Contractual liabilities</li>
//                     <li>Tort liabilities</li>
//                     <li>Regulatory compliance</li>
//                   </ul>
//                 </div>
//               </div>
//             </HighlightBox>

//             <HighlightBox title="13.3-13.5 Financial Caps" color="yellow">
//               <div className="space-y-6">
//                 <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
//                   <h4 className="font-medium mb-4">Liability Structure</h4>
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div>
//                       <p className="text-sm font-medium mb-2">Free Services:</p>
//                       <p className="text-gray-600 dark:text-gray-400">
//                         No liability for complimentary offerings
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-sm font-medium mb-2">Paid Services:</p>
//                       <p className="text-gray-600 dark:text-gray-400">
//                         Limited to transaction value
//                       </p>
//                     </div>
//                   </div>
//                 </div>

//                 <div>
//                   <h4 className="font-medium mb-2">Excluded Damages</h4>
//                   <div className="grid md:grid-cols-2 gap-6">
//                     <div>
//                       <ul className="list-disc pl-6 space-y-2">
//                         <li>Business interruption losses</li>
//                         <li>Data corruption</li>
//                         <li>Reputational damage</li>
//                       </ul>
//                     </div>
//                     <div>
//                       <ul className="list-disc pl-6 space-y-2">
//                         <li>Consequential damages</li>
//                         <li>Lost opportunities</li>
//                         <li>Force majeure impacts</li>
//                       </ul>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </HighlightBox>

//             <HighlightBox title="13.6 Legal Entity Protection" color="blue">
//               <div className="flex items-start gap-4">
//                 <svg
//                   className="w-6 h-6 text-blue-600 flex-shrink-0"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <div>
//                   <p className="text-sm text-gray-600 dark:text-gray-400">
//                     Legal claims must be directed to the corporate entity.
//                     Individual employees and officers are protected from
//                     personal liability under this agreement.
//                   </p>
//                 </div>
//               </div>
//             </HighlightBox>
//           </SectionContainer>

//           {/* Indemnification Section */}
//           <SectionContainer
//             id="indemnification"
//             title="14. Financial Responsibilities"
//           >
//             <HighlightBox title="14.1 Indemnity Obligations" color="red">
//               <div className="grid md:grid-cols-2 gap-6">
//                 <div>
//                   <h4 className="font-medium mb-2">
//                     Legal & Financial Coverage
//                   </h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Legal fee reimbursement</li>
//                     <li>Third-party settlement costs</li>
//                     <li>Operational damages recovery</li>
//                   </ul>
//                 </div>
//                 <div>
//                   <h4 className="font-medium mb-2">Tax Compliance</h4>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>VAT obligations</li>
//                     <li>Withholding tax liabilities</li>
//                     <li>Cross-border tax compliance</li>
//                   </ul>
//                 </div>
//               </div>
//             </HighlightBox>
//           </SectionContainer>

//           {/* Breach Consequences Section */}
//           <SectionContainer id="breaches" title="15. Policy Enforcement">
//             <HighlightBox title="15.1-15.3 Account Management" color="yellow">
//               <div className="grid md:grid-cols-2 gap-8">
//                 <div>
//                   <div className="flex items-center gap-3 mb-3">
//                     <svg
//                       className="w-6 h-6 text-yellow-600"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
//                       />
//                     </svg>
//                     <h4 className="font-medium">Account Restrictions</h4>
//                   </div>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Temporary access suspension</li>
//                     <li>Permanent platform ban</li>
//                     <li>IP-based restrictions</li>
//                   </ul>
//                 </div>
//                 <div>
//                   <div className="flex items-center gap-3 mb-3">
//                     <svg
//                       className="w-6 h-6 text-red-600"
//                       fill="none"
//                       stroke="currentColor"
//                       viewBox="0 0 24 24"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
//                       />
//                     </svg>
//                     <h4 className="font-medium">Legal Recourse</h4>
//                   </div>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Civil litigation</li>
//                     <li>Contract breach claims</li>
//                     <li>ISP collaboration</li>
//                   </ul>
//                 </div>
//               </div>
//             </HighlightBox>
//           </SectionContainer>

//           {/* Agreement Section */}
//           <SectionContainer
//             id="agreement"
//             title="16. Contractual Understanding"
//           >
//             <HighlightBox title="16.1 Comprehensive Agreement" color="green">
//               <div className="flex items-start gap-4">
//                 <svg
//                   className="w-6 h-6 text-green-600 flex-shrink-0"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <div>
//                   <p className="text-gray-700 dark:text-gray-300">
//                     This agreement supersedes all prior understandings and
//                     constitutes the complete terms governing platform use. All
//                     policies and codes are incorporated by reference.
//                   </p>
//                 </div>
//               </div>
//             </HighlightBox>
//           </SectionContainer>

//           {/* Terms Modification Section */}
//           <SectionContainer id="changes" title="17. Policy Updates">
//             <HighlightBox title="17.1 Amendment Process" color="blue">
//               <div className="flex items-start gap-4">
//                 <svg
//                   className="w-6 h-6 text-blue-600 flex-shrink-0"
//                   fill="currentColor"
//                   viewBox="0 0 20 20"
//                 >
//                   <path
//                     fillRule="evenodd"
//                     d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
//                     clipRule="evenodd"
//                   />
//                 </svg>
//                 <div>
//                   <div className="mb-3">
//                     <h4 className="font-medium">Modification Terms</h4>
//                     <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
//                       Updated terms become effective immediately upon
//                       publication
//                     </p>
//                   </div>
//                   <ul className="list-disc pl-6 space-y-2">
//                     <li>Continuous use implies acceptance</li>
//                     <li>Version tracking through revision dates</li>
//                     <li>No individual notification requirement</li>
//                   </ul>
//                 </div>
//               </div>
//             </HighlightBox>
//           </SectionContainer>

//           {/* Contact Section */}
//           <SectionContainer id="contact" title="18. Contact Us">
//             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
//               <p className="text-gray-600 dark:text-gray-400">
//                 For any inquiries regarding these Terms and Conditions:
//               </p>
//               <div className="mt-4 space-y-2">
//                 <p className="font-medium">Email:</p>
//                 <a
//                   href={`mailto:contact@${siteConfig.name.toLowerCase()}.com`}
//                   className="text-blue-600 dark:text-blue-400 hover:underline"
//                 >
//                   contact@{siteConfig.name.toLowerCase()}.com
//                 </a>
//               </div>
//             </div>
//           </SectionContainer>
//         </main>
//       </div>

//       {/* Back to Top Floating Button */}
//       <div className="fixed bottom-8 right-8">
//         <a
//           href="#top"
//           className="inline-flex items-center justify-center p-3 rounded-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow"
//           aria-label="Back to top"
//         >
//           <svg
//             className="w-6 h-6 text-gray-600 dark:text-gray-400"
//             fill="none"
//             stroke="currentColor"
//             viewBox="0 0 24 24"
//           >
//             <path
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeWidth={2}
//               d="M5 10l7-7m0 0l7 7m-7-7v18"
//             />
//           </svg>
//         </a>
//       </div>
//     </div>
//   );
// }

// export default TermsPage;

import { siteConfig } from "@/config/site";

function page() {
  // const currentDate = new Date().getFullYear();
  const currentDate = new Date();
  const formattedDate = currentDate.toISOString().split("T")[0];

  return (
    <div className=" md:max-w-5xl md:container md:mx-auto min-h-screen my-auto flex justify-center items-center">
      <div className="py-8 px-4 flex flex-col gap-4">
        <h1 className=" text-xl font-semibold text-center md:text-3xl">
          UDUA'S TERMS AND CONDITIONS
        </h1>

        <p className=" text-xl">Last updated: {formattedDate}</p>

        <h2>1. Introduction</h2>
        <p>
          1.1. “Udua” is the trading name for Udua, an e-commerce platform that
          operates through a website and mobile application (“marketplace”)
          along with supporting IT logistics and payment infrastructure for the
          sale and purchase of consumer products and services (“products”)
          within the university ecosystem.
        </p>

        <p>
          1.2. These general terms and conditions apply to both buyers and
          sellers on the marketplace and govern your use of the marketplace and
          related services.
        </p>

        <p>
          1.3. By using our marketplace, you accept these general terms and
          conditions in full. If you disagree with these terms and conditions or
          any part of them, you must not use our marketplace.
        </p>

        <p>
          1.4. If you use our marketplace in the course of a business or
          organizational project, then by doing so you:
        </p>

        <ul>
          <li>
            1.4.1. Confirm that you have obtained the necessary authority to
            agree to these general terms and conditions;
          </li>
          <li>
            1.4.2. Bind both yourself and the person, company, or other legal
            entity that operates that business or organizational project to
            these terms and conditions; and
          </li>
          <li>
            1.4.3. Agree that the term “you” in these general terms and
            conditions shall reference both the individual user and the relevant
            person, company, or legal entity unless the context requires
            otherwise.
          </li>
        </ul>

        <h2>2. Registration and Account</h2>
        <p>
          2.1. You may not register with our marketplace if you are under 18
          years of age. By using our marketplace or agreeing to these general
          terms and conditions, you warrant and represent to us that you are at
          least 18 years of age.
        </p>

        <p>
          2.2. If you register for an account with our marketplace, you will be
          asked to provide an email address/user ID and password, and you agree
          to:
        </p>

        <ul>
          <li>2.2.1. Keep your password confidential;</li>
          <li>
            2.2.2. Be responsible for any activity on our marketplace arising
            out of any failure to keep your password confidential, and you may
            be held liable for any losses arising out of such a failure.
          </li>
          <li>
            2.2.3. Your account shall be used exclusively by you, and you shall
            not transfer your account to any third party. If you authorize any
            third party to manage your account on your behalf, this shall be at
            your own risk.
          </li>
          <li>
            2.2.4. We may suspend or cancel your account and/or edit your
            account details at any time in our sole discretion and without
            notice or explanation. If we cancel any products or services you
            have paid for but not received, and you have not breached these
            general terms and conditions, we will refund you in respect of the
            same.
          </li>
        </ul>

        <p>
          You may diactivate your account on our marketplace by contacting us.
        </p>

        <h2>3. Terms and Conditions of Sale</h2>
        <p>3.1. You acknowledge and agree that:</p>

        <ul>
          <li>
            3.1.1. The marketplace provides an online platform for sellers to
            sell and buyers to purchase products;
          </li>
          <li>
            3.1.2. We shall accept binding sales on behalf of sellers, but
            (unless Udua is indicated as the seller) Udua is not a party to the
            transaction between the seller and the buyer; and
          </li>
          <li>
            3.1.3. A contract for the sale and purchase of a product will come
            into force between the buyer and seller, and accordingly, you commit
            to buying or selling the relevant product upon the buyer’s
            confirmation of purchase via the marketplace.
          </li>
        </ul>

        <p>
          3.2. Subject to these general terms and conditions, the seller’s terms
          of business shall govern the contract for sale and purchase between
          the buyer and the seller. Notwithstanding this, the following
          provisions will be incorporated into the contract of sale and
          purchase:
        </p>

        <ul>
          <li>
            3.2.1. The price for a product will be as stated in the relevant
            product listing;
          </li>
          <li>
            3.2.2. The price for the product must include all taxes and comply
            with applicable laws in force from time to time;
          </li>
          <li>
            3.2.3. Delivery charges, packaging charges, handling charges,
            administrative charges, insurance costs, and other ancillary costs
            and charges, where applicable, will only be payable by the buyer if
            this is expressly and clearly stated in the product listing.
            Delivery of digital products may be made electronically;
          </li>
          <li>
            3.2.4. Products must be of satisfactory quality, fit, and safe for
            any purpose specified in, and conform in all material respects to,
            the product listing and any other description of the products
            supplied or made available by the seller to the buyer; and
          </li>
          <li>
            3.2.5. In respect of physical products sold, the seller warrants
            that they have good title to and are the sole legal and beneficial
            owner of the products and/or have the right to supply the products
            pursuant to this agreement. The products are not subject to any
            third-party rights or restrictions, including intellectual property
            rights or any criminal, insolvency, or tax investigation
            proceedings. For digital products, the seller warrants that they
            have the right to supply the digital products to the buyer.
          </li>
        </ul>

        <h2>4. Returns and Refunds</h2>

        <p>
          4.1. Returns of products by buyers and acceptance of returned products
          by sellers shall be managed by us in accordance with the returns page
          on the marketplace as may be amended from time to time. Acceptance of
          returns shall be at our discretion subject to compliance with
          applicable laws of the territory.
        </p>

        <p>
          4.2. Refunds in respect of returned products shall be managed in
          accordance with the refunds page on the marketplace as may be amended
          from time to time. Our rules on refunds shall be exercised at our
          discretion subject to applicable laws of the territory. We may offer
          refunds in our discretion:
        </p>
        <ul>
          <li>4.2.1. In respect of the product price;</li>
          <li>
            4.2.2. Local and/or international shipping fees (as stated on the
            refunds page); and
          </li>
          <li>
            By way of mobile money transfer, bank transfers, or such other
            methods as we may determine from time to time.
          </li>
        </ul>

        <p>
          4.3. Returned products shall be accepted and refunds issued by Udua
          acting for and on behalf of the seller. Notwithstanding paragraphs 4.1
          and 4.2 above, in respect of digital products or services, Udua shall
          issue refunds in respect of failures in delivery only. Refunds of
          payment for such products for any other reasons shall be subject to
          the seller’s terms and conditions of sale.
        </p>

        <p>
          4.4. Changes to our returns page or refunds page shall be effective in
          respect of all purchases made from the date of publication of the
          change on our website.
        </p>

        <h2>5. Payments (Payment Information and Guidelines)</h2>

        <h4> 5.1 Payment Methods Accepted by Udua</h4>
        <p>
          Udua accepts the following methods of payment (availability may vary
          depending on your region):
        </p>
        <ul>
          {/* <li>Payment on delivery</li> */}
          <li>Debit & Credit card</li>
          <li>Bank transfer</li>
          {/* <li>Mobile money transfer</li> */}
        </ul>

        {/* <h4>1.1 Payment on Delivery</h4>
<p>
  You may make payments for your purchases from the Udua marketplace
  once the goods are delivered to you. You can provide the exact amount
  of the purchase price to the delivery agent in cash or by paying the
  exact amount via mobile money to the Udua payment details that will be
  provided by the delivery agent.
</p> */}

        <h4>5.1.1 Debit & Credit Cards</h4>
        <p>
          You may make payments for your purchases from the Udua marketplace
          using your debit or credit card. You will be required to input your
          card details during the checkout process. Please refer to Udua’s terms
          and conditions and privacy notice for information on how your details
          are processed.
        </p>

        <h4>5.1.2 Bank Transfer</h4>
        <p>
          You may make payments for your purchases from the Udua marketplace via
          bank transfer. You will be required to input your bank information
          during the checkout process.
        </p>

        {/* <h4>1.4 Mobile Money</h4>
<p>
  You may make payments for your purchases via mobile money transfer.
  You will be required to input your mobile money account details during
  the checkout process. For more details on how your information is
  processed, please refer to Udua’s privacy policy.
</p> */}

        {/* <h4>2. Adding or Changing Payment Methods</h4>
<p>
  You can add a new payment method or change your existing payment
  method at any time by logging into your Udua account and updating your
  profile. You may also add or remove payment methods that are linked to
  your account through UduaPay.
</p> */}

        <h2>6. Rules About Your Content</h2>

        <p>6.1. In these general terms and conditions, "your content" means:</p>
        <ul>
          <li>
            6.1.1. All works and materials (including, without limitation, text,
            graphics, images, audio material, video material, audio-visual
            material, scripts, software, and files) that you submit to us or our
            marketplace for storage, publication, processing, or onward
            transmission.
          </li>
          <li>
            6.1.2. All communications on the marketplace, including product
            reviews, feedback, and comments.
          </li>
        </ul>

        <p>
          6.2. Your content and its use by us in accordance with these general
          terms and conditions must be accurate, complete, and truthful.
        </p>

        <p>
          6.3. Your content must be appropriate, civil, and tasteful, and must
          accord with generally accepted standards of internet etiquette. Your
          content must not:
        </p>
        <ul>
          <li>
            6.3.1. Be offensive, obscene, indecent, pornographic, lewd,
            suggestive, or sexually explicit;
          </li>
          <li>
            6.3.2. Depict violence in an explicit, graphic, or gratuitous
            manner;
          </li>
          <li>
            6.3.3. Be blasphemous, or breach racial or religious hatred or
            discrimination legislation;
          </li>
          <li>
            6.3.4. Be deceptive, fraudulent, threatening, abusive, harassing,
            anti-social, menacing, hateful, discriminatory, or inflammatory;
          </li>
          <li>
            6.3.5. Cause annoyance, inconvenience, or needless anxiety to any
            person;
          </li>
          <li>6.3.6. Constitute spam.</li>
        </ul>

        <p>
          6.4. Your content must not be illegal or unlawful, infringe any
          person's legal rights, or be capable of giving rise to legal action
          against any person (in any jurisdiction and under any applicable law).
          Specifically, your content must not:
        </p>
        <ul>
          <li>
            6.4.1. Infringe any copyright, moral right, database right,
            trademark right, design right, or any other intellectual property
            right;
          </li>
          <li>
            6.4.2. Infringe any right of confidence, right of privacy, or rights
            under data protection legislation;
          </li>
          <li>
            6.4.3. Breach any contractual obligation owed to any person or any
            court order.
          </li>
        </ul>

        <p>
          6.5. You must not use our marketplace to link to any website or web
          page that, if posted on our marketplace, would breach these general
          terms and conditions.
        </p>

        <p>
          6.6. You must not submit any material to our marketplace that is or
          has ever been the subject of any threatened or actual legal
          proceedings or other similar complaint.
        </p>

        <p>
          6.7. The review function on the marketplace may be used to facilitate
          buyer reviews on products. You shall not use the review function or
          any other form of communication to provide inaccurate, inauthentic, or
          fake reviews.
        </p>

        <p>6.8. You must not interfere with a transaction by:</p>
        <ul>
          <li>
            6.8.1. Contacting another user to buy or sell an item listed on the
            marketplace outside of the marketplace;
          </li>
          <li>
            6.8.2. Communicating with a user involved in an active or completed
            transaction to warn them away from a particular buyer, seller, or
            item;
          </li>
          <li>
            6.8.3. Contacting another user with the intent to collect any
            payments.
          </li>
        </ul>

        <p>
          6.9. You acknowledge that all users of the marketplace are solely
          responsible for interactions with other users. You shall exercise
          caution and good judgment in your communication with users, and you
          must not send them personal information, including credit card
          details.
        </p>

        <p>
          6.10. We may periodically review your content and reserve the right to
          remove any content at our discretion for any reason whatsoever.
        </p>

        <p>
          6.11. If you learn of any unlawful material or activity on our
          marketplace, or any material or activity that breaches these general
          terms and conditions, you may inform us by contacting us.
        </p>

        <h2>7. Our Rights to Use Your Content</h2>

        <p>
          7.1. You grant to us a worldwide, irrevocable, non-exclusive,
          royalty-free license to use, reproduce, store, adapt, publish,
          translate, and distribute your content on our marketplace and across
          our marketing channels, as well as in any existing or future media.
        </p>

        <p>
          7.2. You grant to us the right to sub-license the rights licensed
          under section 7.1.
        </p>

        <p>
          7.3. You grant to us the right to bring an action for infringement of
          the rights licensed under section 7.1.
        </p>

        <p>
          7.4. You hereby waive all your moral rights in your content to the
          maximum extent permitted by applicable law, and you warrant and
          represent that all other moral rights in your content have been waived
          to the maximum extent permitted by applicable law.
        </p>

        <p>
          7.5. Without prejudice to our other rights under these general terms
          and conditions, if you breach our rules on content in any way, or if
          we reasonably suspect that you have breached our rules on content, we
          may delete, unpublish, or edit any or all of your content.
        </p>

        <h2>8. Use of Website and Mobile Applications</h2>

        <p>
          8.1. In this section, the words "marketplace" and "website" shall be
          used interchangeably to refer to Udua's websites.
        </p>

        <p>8.2. You may:</p>
        <ul>
          <li>8.2.1. view pages from our website in a web browser;</li>
          <li>
            8.2.2. download pages from our website for caching in a web browser;
          </li>
          <li>
            8.2.3. print pages from our website for your own personal and
            non-commercial use, provided that such printing is not systematic or
            excessive;
          </li>
          <li>
            8.2.4. stream audio and video files from our website using the media
            player on our website; and
          </li>
          <li>
            8.2.5. use our marketplace services by means of a web browser
            subject to the other provisions of these general terms and
            conditions.
          </li>
        </ul>

        <p>
          8.3. Except as expressly permitted by section 8.2 or the other
          provisions of these general terms and conditions, you must not
          download any material from our website or save any such material to
          your computer.
        </p>

        <p>
          8.4. You may only use our website for your own personal and business
          purposes in respect of selling or purchasing products on the
          marketplace.
        </p>

        <p>
          8.5. Except as expressly permitted by these general terms and
          conditions, you must not edit or otherwise modify any material on our
          website.
        </p>

        <p>
          8.6. Unless you own or control the relevant rights in the material,
          you must not:
        </p>
        <ul>
          <li>
            8.6.1. republish material from our website (including republication
            on another website);
          </li>
          <li>8.6.2. sell, rent, or sub-license material from our website;</li>
          <li>8.6.3. show any material from our website in public;</li>
          <li>
            8.6.4. exploit material from our website for a commercial purpose;
            or
          </li>
          <li>8.6.5. redistribute material from our website.</li>
        </ul>

        <p>
          8.7. Notwithstanding section 8.6, you may forward links to products on
          our website and redistribute our newsletter and promotional materials
          in print and electronic form to any person.
        </p>

        <p>
          8.8. We reserve the right to suspend or restrict access to our
          website, areas of our website, and/or functionality on our website. We
          may, for example, suspend access to the website during server
          maintenance or updates. You must not circumvent or attempt to bypass
          any access restriction measures on the website.
        </p>

        <p>8.9. You must not:</p>
        <ul>
          <li>
            8.9.1. use our website in any way or take any action that causes or
            may cause damage to the website or impairment of its performance,
            availability, accessibility, integrity, or security;
          </li>
          <li>
            8.9.2. use our website in any unethical, unlawful, illegal,
            fraudulent, or harmful manner, or in connection with any unlawful,
            illegal, fraudulent, or harmful purpose or activity;
          </li>
          <li>8.9.3. hack or otherwise tamper with our website;</li>
          <li>
            8.9.4. probe, scan, or test the vulnerability of our website without
            permission;
          </li>
          <li>
            8.9.5. circumvent any authentication or security systems on our
            website;
          </li>
          <li>
            8.9.6. use our website to copy, store, host, transmit, send, use,
            publish, or distribute any material consisting of (or linked to) any
            spyware, virus, Trojan horse, worm, keystroke logger, rootkit, or
            other malicious software;
          </li>
          <li>
            8.9.7. impose an unreasonably large load on our website resources
            (including bandwidth, storage, and processing capacity);
          </li>
          <li>
            8.9.8. decrypt or decipher any communications sent by or to our
            website without permission;
          </li>
          <li>
            8.9.9. conduct any systematic or automated data collection
            activities (such as scraping, data mining, or data harvesting)
            without express written consent;
          </li>
          <li>
            8.9.10. access or interact with our website using automated means
            except for search engine indexing;
          </li>
          <li>
            8.9.11. use our website except by means of our public interfaces;
          </li>
          <li>
            8.9.12. use data from our website for direct marketing activities
            (including email, SMS, or telemarketing); or
          </li>
          <li>8.9.13. interfere with the normal use of our website.</li>
        </ul>

        <h2>9. Copyright and Trademarks</h2>

        <p>
          9.1. Subject to the express provisions of these general terms and
          conditions:
        </p>
        <ul>
          <li>
            9.1.1. We, together with our licensors, own and control all the
            copyright and other intellectual property rights in our website and
            the material on our website; and
          </li>
          <li>
            9.1.2. All the copyright and other intellectual property rights in
            our website and the material on our website are reserved.
          </li>
        </ul>

        <p>
          9.2. Udua's logos and other registered and unregistered trademarks are
          trademarks belonging to us; we do not give permission for the use of
          these trademarks, and such use may constitute an infringement of our
          rights.
        </p>

        <p>
          9.3. The third-party registered and unregistered trademarks or service
          marks on our website are the property of their respective owners. We
          do not endorse, nor are we affiliated with, any of the holders of such
          rights, and therefore cannot grant any license to exercise those
          rights.
        </p>

        <h2>10. Data Privacy</h2>

        <p>
          10.1. Buyers agree to the processing of their personal data in
          accordance with the terms of Udua’s Privacy Policy.
        </p>

        <p>
          10.2. Udua shall process all personal data obtained through the
          marketplace and related services in accordance with the terms of Our
          Privacy Policy.
        </p>

        <p>
          10.3. Sellers shall be directly responsible to buyers for any misuse
          of their personal data, and Udua shall bear no liability to buyers in
          respect of any misuse by sellers of their personal data.
        </p>

        <h2>11. Due Diligence and Audit Rights</h2>

        <p>
          11.1. We operate an anti-fraud and anti-money laundering compliance
          program and reserve the right to perform due diligence checks on all
          users of the marketplace.
        </p>

        <p>
          11.2. You agree to provide to us all such information, documentation,
          and access to your business premises as we may require:
        </p>

        <ul>
          <li>
            11.2.1. in order to verify your adherence to and performance of your
            obligations under these terms and conditions;
          </li>
          <li>
            11.2.2. for the purpose of disclosures pursuant to a valid order by
            a court or other governmental body; or
          </li>
          <li>
            11.2.3. as otherwise required by law or applicable regulation.
          </li>
        </ul>

        <h2>12. Udua’s Role as a Marketplace</h2>

        <p>12.1. You acknowledge that:</p>

        <ul>
          <li>
            12.1.1. Udua facilitates a marketplace for buyers and third-party
            sellers;
          </li>
          <li>
            12.1.2. The relevant seller of the product (whether a third-party
            seller or Udua itself) shall at all times remain exclusively liable
            for the products they sell on the marketplace; and
          </li>
          <li>
            12.1.3. In the event of an issue arising from the purchase of a
            product, the buyer should seek recourse from the relevant seller by
            following the process set out in Udua's Dispute Resolution Policy.
          </li>
        </ul>

        <p>
          12.2. We commit to ensuring that sellers submit information relating
          to their products that is complete, accurate, and up to date. To this
          end:
        </p>

        <ul>
          <li>
            12.2.1. The relevant seller warrants and represents the completeness
            and accuracy of their product information;
          </li>
          <li>
            12.2.2. The relevant seller warrants and represents that the
            material on the marketplace is up to date; and
          </li>
          <li>
            12.2.3. If a buyer has a complaint about the accuracy or
            completeness of the product information, they may seek recourse from
            the relevant seller by following Udua's Dispute Resolution Policy.
          </li>
        </ul>

        <p>
          12.3. We do not warrant that the marketplace will operate without
          fault or that it will remain available during events beyond Udua’s
          control (force majeure), including but not limited to natural
          disasters, hacking, terrorist attacks, or pandemics.
        </p>

        <p>
          12.4. We reserve the right to discontinue or alter our marketplace
          services and to stop publishing the marketplace at any time at our
          discretion, without notice or explanation. You will not be entitled to
          any compensation or other payment upon the discontinuance or
          alteration of services. This is without prejudice to any unfulfilled
          orders or other existing liabilities.
        </p>

        <p>
          12.5. If we discontinue or alter the marketplace under circumstances
          not related to force majeure, we will provide prior notice to buyers
          and sellers of not less than fifteen (15) days with guidance on
          pending transactions or liabilities.
        </p>

        <p>
          12.6. We do not guarantee any commercial results from the use of the
          marketplace.
        </p>

        <p>
          To the maximum extent permitted by applicable law, and subject to
          section 13.1 below, we exclude all representations and warranties
          related to the subject matter of these terms and conditions, our
          marketplace, and its use.
        </p>

        <h2>13. Limitations and Exclusions of Liability</h2>

        <p>13.1. Nothing in these general terms and conditions will:</p>
        <ul>
          <li>
            13.1.1. Limit any liabilities in any way that is not permitted under
            applicable law; or
          </li>
          <li>
            13.1.2. Exclude any liabilities or statutory rights that may not be
            excluded under applicable law.
          </li>
        </ul>

        <p>
          13.2. The limitations and exclusions of liability set out in this
          section 13 and elsewhere in these general terms and conditions:
        </p>
        <ul>
          <li>13.2.1. Are subject to section 13.1; and</li>
          <li>
            13.2.2. Govern all liabilities arising under these general terms and
            conditions or relating to the subject matter of these general terms
            and conditions, including liabilities arising in contract, in tort
            (including negligence), and for breach of statutory duty except to
            the extent expressly provided otherwise in these general terms and
            conditions.
          </li>
        </ul>

        <p>
          13.3. In respect of services offered to you free of charge, we will
          not be liable to you for any loss or damage of any nature whatsoever.
        </p>

        <p>
          13.4. Our aggregate liability to you in respect of any contract to
          provide services under these general terms and conditions shall not
          exceed the total amount paid and payable to us under the contract.
          Each separate transaction on the marketplace shall constitute a
          separate contract for the purposes of this section 13.
        </p>

        <p>
          13.5. Notwithstanding section 13.4 above, we will not be liable to you
          for any loss or damage of any nature, including in respect of:
        </p>
        <ul>
          <li>
            13.5.1. Any losses occasioned by any interruption or dysfunction to
            the website;
          </li>
          <li>
            13.5.2. Any losses arising out of any event or events beyond our
            reasonable control;
          </li>
          <li>
            13.5.3. Any business losses including (without limitation) loss of
            or damage to profits, income, revenue, use, production, anticipated
            savings, business, contracts, commercial opportunities, or goodwill;
          </li>
          <li>
            13.5.4. Any loss or corruption of any data, database, or software;
            or
          </li>
          <li>
            13.5.5. Any special, indirect, or consequential loss or damage.
          </li>
        </ul>

        <p>
          13.6. We accept that we have an interest in limiting the personal
          liability of our officers and employees. Having regard to that
          interest, you acknowledge that we are a limited liability entity; you
          agree that you will not bring any claim personally against our
          officers or employees in respect of any losses you suffer in
          connection with the marketplace or these general terms and conditions
          (this does not limit or exclude the liability of the limited liability
          entity itself for the acts and omissions of our officers and
          employees).
        </p>

        {/* <p>
          13.7. Our marketplace includes hyperlinks to other websites owned and
          operated by third parties; such hyperlinks are not recommendations. We
          have no control over third-party websites and their contents, and we
          accept no responsibility for them or for any loss or damage that may
          arise from your use of them.
        </p> */}

        <h2>14. Indemnification</h2>

        <p>
          14.1. You hereby indemnify us and undertake to keep us indemnified
          against:
        </p>
        <ul>
          <li>
            14.1.1. Any and all losses, damages, costs, liabilities, and
            expenses (including, without limitation, legal expenses and any
            amounts paid by us to any third party in settlement of a claim or
            dispute) incurred or suffered by us and arising directly or
            indirectly out of your use of our marketplace or any breach by you
            of any provision of these general terms and conditions or the Udua
            codes, policies, or guidelines; and
          </li>
          <li>
            14.1.2. Any VAT liability or other tax liability that we may incur
            in relation to any sale, supply, or purchase made through our
            marketplace, where that liability arises out of your failure to pay,
            withhold, declare, or register to pay any VAT or other tax properly
            due in any jurisdiction.
          </li>
        </ul>

        <h2>15. Breaches of these General Terms and Conditions</h2>

        <p>
          15.1. If we permit the registration of an account on our marketplace,
          it will remain open indefinitely subject to these general terms and
          conditions.
        </p>

        <p>
          15.2. If you breach these general terms and conditions or if we
          reasonably suspect that you have breached these general terms and
          conditions or any Udua codes, policies, or guidelines in any way, we
          may:
        </p>
        <ul>
          <li>15.2.1. Temporarily suspend your access to our marketplace;</li>
          <li>
            15.2.2. Permanently prohibit you from accessing our marketplace;
          </li>
          <li>
            15.2.3. Block computers using your IP address from accessing our
            marketplace;
          </li>
          <li>
            15.2.4. Contact any or all of your internet service providers and
            request that they block your access to our marketplace;
          </li>
          <li>
            15.2.5. Suspend or delete your account on our marketplace; and/or
          </li>
          <li>
            15.2.6. Commence legal action against you whether for breach of
            contract or otherwise.
          </li>
        </ul>

        <p>
          15.3. Where we suspend, prohibit, or block your access to our
          marketplace or a part of our marketplace, you must not take any action
          to circumvent such suspension or prohibition or blocking (including,
          without limitation, creating and/or using a different account).
        </p>

        <h2>16. Entire Agreement</h2>

        <p>
          16.1. These general terms and conditions and the Udua codes, policies,
          and guidelines (and in respect of sellers, the seller terms and
          conditions) shall constitute the entire agreement between you and us
          in relation to your use of our marketplace and shall supersede all
          previous agreements between you and us in relation to your use of our
          marketplace.
        </p>

        <h2>
          <span className="font-semibold text-lg">17. Changes to Terms:</span>
        </h2>

        <p>
          17.1 We may update these Terms and Conditions from time to time. The{" "}
          <strong>Last updated</strong> will indicate the most recent revisions.
          Continued use of our services after changes constitutes acceptance of
          the modified terms.
        </p>

        <h2>
          <span className="font-semibold text-lg">18. Contact Us:</span>
        </h2>

        <p>
          18.1 If you have any questions or concerns about these Terms and
          Conditions, please contact us at contact{siteConfig.name}@gmail.com.{" "}
        </p>

        <p>
          Thank you for choosing{" "}
          <span className=" font-semibold font-mono">{siteConfig.name}</span>.
          We appreciate your adherence to these terms as they contribute to a
          safe and enjoyable shopping experience for all users.
        </p>

        {/* <p>Welcome to <span className=' font-semibold font-mono'>{siteConfig.name}</span> By using our website, you agree to comply with and be bound by the following Terms and Conditions. Please read these terms carefully before using our services.</p>

        <p><span className='font-semibold text-lg'>1. Acceptance of Terms:</span> - By accessing or using our website, you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our services.</p>

        <p><span className='font-semibold text-lg'>2. Use of Services:</span> - You must be at least 15 years old to use our services. By using our website, you affirm that you are at least 15 years old or have the consent of a parent or guardian.</p>

        {/* <p><span className='font-semibold text-lg'>3. User Account:</span> - You may be required to create a user account to access certain features of our website. You are responsible for maintaining the confidentiality of your account information.</p> *

        <p><span className='font-semibold text-lg'>3. Order and Payment:</span> - When you place an order on our website, you agree to provide accurate and complete information for the purchase.</p>

        <p><span className='font-semibold text-lg'>4. Product Information:</span> - We strive to provide accurate product information, but we do not guarantee the accuracy, completeness, or reliability of any product descriptions or other content on the site.</p>

        <p><span className='font-semibold text-lg'>5. Intellectual Property:</span> - All content on our website, including logos, images, and text, is the property of <span className=' font-semibold font-mono'>{siteConfig.name}</span> and is protected by intellectual property laws. You may not use, reproduce, or distribute any content without our written permission.</p>

        <p><span className='font-semibold text-lg'>6. Limitation of Liability:</span> - <span className=' font-semibold font-mono'>{siteConfig.name}</span> is not liable for any indirect, incidental, special, or consequential damages arising out of or in connection with the use of our website or products.</p>

        <p><span className='font-semibold text-lg'>7. Indemnification:</span> - You agree to indemnify and hold <span className=' font-semibold font-mono'>{siteConfig.name}</span> harmless from any claims, damages, or expenses arising out of your use of our services.</p>

        <p><span className='font-semibold text-lg'>8. Termination:</span> - We reserve the right to terminate or suspend your account and access to our services at our discretion, without prior notice.</p>

        <p><span className='font-semibold text-lg'>9. Governing Law:</span> - These Terms and Conditions are governed by and construed in accordance with the laws of [Your Country/State].</p>

        <p><span className='font-semibold text-lg'>10. Changes to Terms:</span> - We may update these Terms and Conditions from time to time. The <strong>Effective Date</strong> will indicate the most recent revisions. Continued use of our services after changes constitutes acceptance of the modified terms.</p>

        <p><span className='font-semibold text-lg'>11. Contact Us:</span> - If you have any questions or concerns about these Terms and Conditions, please contact us at contact{siteConfig.name}@gmail.com. </p>

        <p>Thank you for choosing <span className=' font-semibold font-mono'>{siteConfig.name}</span>. We appreciate your adherence to these terms as they contribute to a safe and enjoyable shopping experience for all users.</p> */}
      </div>
    </div>
  );
}

export default page;
